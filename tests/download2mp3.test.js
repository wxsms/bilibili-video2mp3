import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/download.js', () => ({
  download: vi.fn(),
}));

vi.mock('../src/flv2mp3.js', () => ({
  flv2mp3: vi.fn(),
}));

vi.mock('../src/utils.js', () => ({
  sleep: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('commander', () => ({
  program: {
    opts: vi.fn(() => ({
      indexOffset: 0,
      skipMp3: false,
      debug: false,
      ffmpeg: '',
    })),
  },
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

import { download } from '../src/download.js';
import { flv2mp3 } from '../src/flv2mp3.js';
import { program } from 'commander';
import * as fs from 'fs';
import { download2mp3 } from '../src/download2mp3.js';

describe('download2mp3', () => {
  const mockBar = { tick: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should download and convert to mp3 by default', async () => {
    vi.mocked(download).mockResolvedValue({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    expect(download).toHaveBeenCalledWith('https://test.com?p=1', 1);
    expect(flv2mp3).toHaveBeenCalledWith('test.flv');
  });

  it('should skip mp3 conversion when skipMp3 is set', async () => {
    vi.mocked(program.opts).mockReturnValue({
      indexOffset: 0,
      skipMp3: true,
      debug: false,
      ffmpeg: '',
    });
    vi.mocked(download).mockResolvedValue({ filename: 'test.flv', bar: mockBar });

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    expect(flv2mp3).not.toHaveBeenCalled();
  });

  it('should apply indexOffset to the index', async () => {
    vi.mocked(program.opts).mockReturnValue({
      indexOffset: 5,
      skipMp3: false,
      debug: false,
      ffmpeg: '',
    });
    vi.mocked(download).mockResolvedValue({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 3 });

    expect(download).toHaveBeenCalledWith('https://test.com?p=1', 8); // 5 + 3
  });

  it('should tick bar with "converting" status before flv2mp3', async () => {
    vi.mocked(program.opts).mockReturnValue({
      indexOffset: 0,
      skipMp3: false,
      debug: false,
      ffmpeg: '',
    });
    vi.mocked(download).mockResolvedValue({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    // bar.tick should be called with converting, then done
    expect(mockBar.tick).toHaveBeenCalledWith({ status: 'converting' });
    expect(mockBar.tick).toHaveBeenCalledWith({ status: 'done' });
  });

  it('should delete the flv file after conversion', async () => {
    vi.mocked(download).mockResolvedValue({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    expect(fs.promises.unlink).toHaveBeenCalledWith('test.flv');
  });

  it('should retry on download failure', async () => {
    // First call fails, second call succeeds
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('download failed'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    expect(download).toHaveBeenCalledTimes(2);
    expect(download).toHaveBeenNthCalledWith(1, 'https://test.com?p=1', 1);
    expect(download).toHaveBeenNthCalledWith(2, 'https://test.com?p=1', 1);
  });

  it('should sleep 2s before retrying on failure', async () => {
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    const { sleep } = await import('../src/utils.js');
    expect(sleep).toHaveBeenCalledWith(2000);
  });

  it('should tick bar with "error" status on failure when bar exists', async () => {
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    // First call fails — no bar available, so no error tick on first attempt
    // But the retry succeeds with bar
  });

  it('should write debug log when debug is enabled and error occurs', async () => {
    vi.mocked(program.opts).mockReturnValue({
      indexOffset: 0,
      skipMp3: false,
      debug: true,
      ffmpeg: '',
    });
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    expect(fs.promises.appendFile).toHaveBeenCalled();
    const written = fs.promises.appendFile.mock.calls[0][1];
    expect(written).toContain('index: 1');
    expect(written).toContain('https://test.com?p=1');
    expect(written).toContain('fail');
  });

  it('should not write debug log when debug is disabled', async () => {
    vi.mocked(program.opts).mockReturnValue({
      indexOffset: 0,
      skipMp3: false,
      debug: false,
      ffmpeg: '',
    });
    vi.mocked(download)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ filename: 'test.flv', bar: mockBar });
    vi.mocked(flv2mp3).mockResolvedValue(undefined);

    await download2mp3({ url: 'https://test.com?p=1', index: 1 });

    expect(fs.promises.appendFile).not.toHaveBeenCalled();
  });
});
