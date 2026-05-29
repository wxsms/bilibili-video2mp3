import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'stream';

// Mock axios - create the mock function inside the factory
vi.mock('axios', () => {
  const mock = vi.fn();
  mock.get = vi.fn();
  return { default: mock };
});

vi.mock('../src/getDataByUrl.js', () => ({
  getDataByUrl: vi.fn(),
}));

vi.mock('../src/naming.js', () => ({
  getName: vi.fn(() => 'TestFile'),
}));

vi.mock('../src/progress.js', () => ({
  createProgressBar: vi.fn(() => ({ tick: vi.fn() })),
}));

vi.mock('filenamify', () => ({
  default: (name) => name,
}));

vi.mock('fs', () => ({
  default: {
    promises: {
      stat: vi.fn().mockRejectedValue(new Error('not found')),
      unlink: vi.fn(),
    },
    createWriteStream: vi.fn(() => {
      const ws = new EventEmitter();
      ws.destroy = vi.fn();
      return ws;
    }),
  },
  promises: {
    stat: vi.fn().mockRejectedValue(new Error('not found')),
    unlink: vi.fn(),
  },
  createWriteStream: vi.fn(() => {
    const ws = new EventEmitter();
    ws.destroy = vi.fn();
    return ws;
  }),
}));

import axios from 'axios';
import { getDataByUrl } from '../src/getDataByUrl.js';
import { getName } from '../src/naming.js';
import { createProgressBar } from '../src/progress.js';
import * as fs from 'fs';
import { download } from '../src/download.js';

function mockStreamDownload(contentLength = 1024) {
  const mockStream = new EventEmitter();
  mockStream.pipe = vi.fn((ws) => {
    setTimeout(() => {
      mockStream.emit('data', Buffer.alloc(512));
      mockStream.emit('data', Buffer.alloc(contentLength - 512));
      mockStream.emit('end');
      // pipe triggers 'finish' on writeStream after source 'end'
      ws.emit('finish');
    }, 0);
    return ws;
  });

  axios.mockResolvedValueOnce({
    data: mockStream,
    headers: { 'content-length': String(contentLength) },
  });
}

describe('download', () => {
  const mockVideoData = {
    videoData: {
      bvid: 'BV1test',
      aid: 999,
      title: 'Test Video Title',
      owner: { name: 'TestAuthor' },
      ctime: 1700000000,
      pages: [
        { cid: 100, part: 'Part 1' },
        { cid: 200, part: 'Part 2' },
      ],
    },
    p: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: stat rejects (file doesn't exist)
    fs.promises.stat.mockRejectedValue(new Error('not found'));
    // Restore createWriteStream implementation after clearAllMocks resets it
    fs.default.createWriteStream.mockImplementation(() => {
      const ws = new EventEmitter();
      ws.destroy = vi.fn();
      return ws;
    });
    fs.createWriteStream.mockImplementation(() => {
      const ws = new EventEmitter();
      ws.destroy = vi.fn();
      return ws;
    });
  });

  it('should call getDataByUrl with the given url', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1);
    expect(getDataByUrl).toHaveBeenCalledWith(
      'https://www.bilibili.com/video/BV1test?p=1',
    );
  });

  it('should call getName with index and derived metadata', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 3);

    // getName(index, title, author, dateString)
    expect(getName).toHaveBeenCalledTimes(1);
    const [index, title, author, dateStr] = getName.mock.calls[0];
    expect(index).toBe(3);
    // Multi-page: title = pages[p-1].part with spaces replaced by -
    expect(title).toBe('Part-1');
    expect(author).toBe('TestAuthor');
    expect(dateStr).toMatch(/^\d{4}-\d{1,2}-\d{1,2}$/);
  });

  it('should fetch playurl API with correct cid and bvid', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1);

    expect(axios.get).toHaveBeenCalledWith(
      'https://api.bilibili.com/x/player/playurl?fnval=80&cid=100&bvid=BV1test',
    );
  });

  it('should return filename and bar', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    mockStreamDownload();

    const result = await download(
      'https://www.bilibili.com/video/BV1test?p=1',
      1,
    );
    expect(result.filename).toBe('TestFile.flv');
    expect(result.bar).toBeDefined();
  });

  it('should create progress bar with correct params', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    mockStreamDownload(2048);

    await download('https://www.bilibili.com/video/BV1test?p=1', 2);
    expect(createProgressBar).toHaveBeenCalledWith(2, 'Part-1', 2048);
  });

  it('should unlink existing file before download', async () => {
    // Simulate file already exists: stat succeeds, then unlink is called
    fs.promises.stat.mockResolvedValueOnce(undefined);
    fs.promises.unlink.mockResolvedValueOnce(undefined);

    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1);
    expect(fs.promises.unlink).toHaveBeenCalled();
  });

  it('should reject on stream error', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });

    const mockStream = new EventEmitter();
    mockStream.pipe = vi.fn((ws) => {
      setTimeout(() => {
        mockStream.emit('data', Buffer.alloc(512));
        mockStream.emit('error', new Error('network broken'));
      }, 0);
      return ws;
    });
    axios.mockResolvedValueOnce({
      data: mockStream,
      headers: { 'content-length': '1024' },
    });

    await expect(
      download('https://www.bilibili.com/video/BV1test?p=1', 1),
    ).rejects.toThrow('network broken');
  });

  it('should reject on axios request failure', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    axios.mockRejectedValueOnce(new Error('request failed'));

    await expect(
      download('https://www.bilibili.com/video/BV1test?p=1', 1),
    ).rejects.toThrow('request failed');
  });

  it('should ignore data events after stream failure', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });

    const mockBar = { tick: vi.fn() };
    vi.mocked(createProgressBar).mockReturnValueOnce(mockBar);

    const mockStream = new EventEmitter();
    mockStream.pipe = vi.fn((ws) => {
      setTimeout(() => {
        mockStream.emit('error', new Error('stream error'));
        // data after error should be ignored (failed = true guard)
        mockStream.emit('data', Buffer.alloc(100));
        mockStream.emit('end');
      }, 0);
      return ws;
    });
    axios.mockResolvedValueOnce({
      data: mockStream,
      headers: { 'content-length': '1024' },
    });

    try {
      await download('https://www.bilibili.com/video/BV1test?p=1', 1);
    } catch {
      // expected
    }

    // bar.tick should have been called for error (tick total), but NOT for post-error data/end
    // Should not have a 'done' or 'downloading' status after error
    const statusCalls = mockBar.tick.mock.calls.filter((c) => c[1]);
    expect(statusCalls.length).toBeLessThanOrEqual(2); // at most initial tick + error status
  });

  it('should reject on writeStream error', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });

    // Override createWriteStream to emit 'error'
    fs.default.createWriteStream.mockImplementation(() => {
      const ws = new EventEmitter();
      ws.destroy = vi.fn();
      ws.pipe = vi.fn();
      setTimeout(() => {
        ws.emit('error', new Error('disk full'));
      }, 0);
      return ws;
    });
    fs.createWriteStream.mockImplementation(() => {
      const ws = new EventEmitter();
      ws.destroy = vi.fn();
      ws.pipe = vi.fn();
      setTimeout(() => {
        ws.emit('error', new Error('disk full'));
      }, 0);
      return ws;
    });

    const mockStream = new EventEmitter();
    mockStream.pipe = vi.fn((ws) => ws);
    axios.mockResolvedValueOnce({
      data: mockStream,
      headers: { 'content-length': '1024' },
    });

    await expect(
      download('https://www.bilibili.com/video/BV1test?p=1', 1),
    ).rejects.toThrow('disk full');
  });

  it('should ignore finish event after stream error', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });

    const mockBar = { tick: vi.fn() };
    vi.mocked(createProgressBar).mockReturnValueOnce(mockBar);

    const mockStream = new EventEmitter();
    mockStream.pipe = vi.fn((ws) => {
      setTimeout(() => {
        mockStream.emit('error', new Error('stream error'));
        // finish after error should be ignored (failed = true guard)
        ws.emit('finish');
      }, 0);
      return ws;
    });
    axios.mockResolvedValueOnce({
      data: mockStream,
      headers: { 'content-length': '1024' },
    });

    try {
      await download('https://www.bilibili.com/video/BV1test?p=1', 1);
    } catch {
      // expected
    }

    // Should not have resolved successfully, so no 'done' status tick
    const doneTicks = mockBar.tick.mock.calls.filter(
      (c) => c[1] && c[1].status === 'done',
    );
    expect(doneTicks.length).toBe(0);
  });

  it('should use videoData.title for single-page videos', async () => {
    const singlePageData = {
      videoData: {
        ...mockVideoData.videoData,
        title: 'Single Video Title',
        pages: [{ cid: 100, part: 'Only Part' }],
      },
      p: 1,
    };
    vi.mocked(getDataByUrl).mockResolvedValue(singlePageData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1);

    // getName is called with the video title, not page part
    const [, title] = getName.mock.calls[0];
    expect(title).toBe('Single-Video-Title');
  });

  it('should use page part name for multi-page videos', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: {
        data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } },
      },
    });
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1);

    // mockVideoData has p:1 and pages[0].part = 'Part 1' -> 'Part-1'
    const [, title] = getName.mock.calls[0];
    expect(title).toBe('Part-1');
  });
});
