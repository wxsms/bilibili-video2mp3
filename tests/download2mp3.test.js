import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/download/downloadTask.js', () => ({
  download: vi.fn(),
}));

vi.mock('../src/convert/flv2mp3.js', () => ({
  flv2mp3: vi.fn(),
}));

vi.mock('../src/utils/sleep.js', () => ({
  sleep: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('fs', () => ({
  default: {
    promises: {
      unlink: vi.fn().mockResolvedValue(undefined),
      appendFile: vi.fn().mockResolvedValue(undefined),
    },
  },
  promises: {
    unlink: vi.fn().mockResolvedValue(undefined),
    appendFile: vi.fn().mockResolvedValue(undefined),
  },
}));

import { download } from '../src/download/downloadTask.js';
import { flv2mp3 } from '../src/convert/flv2mp3.js';
import * as fs from 'fs';
import { download2mp3 } from '../src/download2mp3.js';

const defaultOpts = {
  naming: 'TITLE-AUTHOR-DATE',
  ffmpeg: '',
  skipMp3: false,
  debug: false,
  indexOffset: 0,
};

describe('download2mp3', () => {
  const mockBar = { tick: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should download and convert to mp3 by default', async () => {
    vi.mocked(download).mockResolvedValue({
      filename: 'test.flv',
      bar: mockBar,
    });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
    });

    expect(download).toHaveBeenCalledWith('https://test.com?p=1', 1, {
      naming: 'TITLE-AUTHOR-DATE',
    });
    expect(flv2mp3).toHaveBeenCalledWith('test.flv', '');
  });

  it('should skip mp3 conversion when skipMp3 is set', async () => {
    vi.mocked(download).mockResolvedValue({
      filename: 'test.flv',
      bar: mockBar,
    });

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
      skipMp3: true,
    });

    expect(flv2mp3).not.toHaveBeenCalled();
  });

  it('should apply indexOffset to the index', async () => {
    vi.mocked(download).mockResolvedValue({
      filename: 'test.flv',
      bar: mockBar,
    });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 3,
      ...defaultOpts,
      indexOffset: 5,
    });

    expect(download).toHaveBeenCalledWith('https://test.com?p=1', 8, {
      naming: 'TITLE-AUTHOR-DATE',
    }); // 5 + 3
  });

  it('should tick bar with "converting" status before flv2mp3', async () => {
    vi.mocked(download).mockResolvedValue({
      filename: 'test.flv',
      bar: mockBar,
    });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
    });

    // bar.tick should be called with converting, then done
    expect(mockBar.tick).toHaveBeenCalledWith({ status: 'converting' });
    expect(mockBar.tick).toHaveBeenCalledWith({ status: 'done' });
  });

  it('should delete the flv file after conversion', async () => {
    vi.mocked(download).mockResolvedValue({
      filename: 'test.flv',
      bar: mockBar,
    });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
    });

    expect(fs.promises.unlink).toHaveBeenCalledWith('test.flv');
  });

  it('should retry on download failure', async () => {
    // First call fails, second call succeeds
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('download failed'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
    });

    expect(download).toHaveBeenCalledTimes(2);
    expect(download).toHaveBeenNthCalledWith(1, 'https://test.com?p=1', 1, {
      naming: 'TITLE-AUTHOR-DATE',
    });
    expect(download).toHaveBeenNthCalledWith(2, 'https://test.com?p=1', 1, {
      naming: 'TITLE-AUTHOR-DATE',
    });
  });

  it('should sleep with backoff before retrying on failure', async () => {
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
    });

    const { sleep } = await import('../src/utils/sleep.js');
    expect(sleep).toHaveBeenCalledWith(2000);
  });

  it('should increase sleep delay on subsequent retries', async () => {
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
    });

    const { sleep } = await import('../src/utils/sleep.js');
    expect(sleep).toHaveBeenNthCalledWith(1, 2000);
    expect(sleep).toHaveBeenNthCalledWith(2, 4000);
  });

  it('should throw after exceeding max retries', async () => {
    vi.mocked(download).mockRejectedValue(new Error('permanent fail'));

    await expect(
      download2mp3({ url: 'https://test.com?p=1', index: 1, ...defaultOpts }),
    ).rejects.toThrow('permanent fail');
    expect(download).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });

  it('should not tick bar with "error" when bar is not yet available', async () => {
    // First call fails before bar is assigned, so b?.tick should be a no-op
    const localBar = { tick: vi.fn() };
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: localBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
    });

    // localBar only received calls from the successful retry, no error tick
    expect(localBar.tick).not.toHaveBeenCalledWith({ status: 'error' });
  });

  it('should write debug log when debug is enabled and error occurs', async () => {
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
      debug: true,
    });

    expect(fs.promises.appendFile).toHaveBeenCalled();
    const written = fs.promises.appendFile.mock.calls[0][1];
    expect(written).toContain('index: 1');
    expect(written).toContain('https://test.com?p=1');
    expect(written).toContain('fail');
  });

  it('should not write debug log when debug is disabled', async () => {
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({
      url: 'https://test.com?p=1',
      index: 1,
      ...defaultOpts,
      debug: false,
    });

    expect(fs.promises.appendFile).not.toHaveBeenCalled();
  });
});
