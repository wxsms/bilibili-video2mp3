import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'stream';

// Mock axios - create the mock function inside the factory
vi.mock('axios', () => {
  const mock = vi.fn();
  mock.get = vi.fn();
  return { default: mock };
});

vi.mock('../src/bilibili/getDataByUrl.js', () => ({
  getDataByUrl: vi.fn(),
}));

vi.mock('../src/bilibili/getPlayUrl.js', () => ({
  getPlayUrl: vi.fn(),
}));

vi.mock('../src/bilibili/naming.js', () => ({
  getName: vi.fn(() => 'TestFile'),
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
import { getDataByUrl } from '../src/bilibili/getDataByUrl.js';
import { getPlayUrl } from '../src/bilibili/getPlayUrl.js';
import { getName } from '../src/bilibili/naming.js';
import * as fs from 'fs';
import { download } from '../src/download/downloadTask.js';

const defaultNaming = 'TITLE-AUTHOR-DATE';

function mockStreamDownload(contentLength = 1024) {
  const mockStream = new EventEmitter();
  mockStream.pipe = vi.fn((ws) => {
    setTimeout(() => {
      mockStream.emit('data', Buffer.alloc(512));
      mockStream.emit('data', Buffer.alloc(contentLength - 512));
      mockStream.emit('end');
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
    fs.promises.stat.mockRejectedValue(new Error('not found'));
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
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1, {
      naming: defaultNaming,
    });
    expect(getDataByUrl).toHaveBeenCalledWith(
      'https://www.bilibili.com/video/BV1test?p=1',
    );
  });

  it('should call getName with index, derived metadata, and naming', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 3, {
      naming: 'INDEX-TITLE',
    });

    // getName(index, title, author, dateString, naming)
    expect(getName).toHaveBeenCalledTimes(1);
    const [index, title, author, dateStr, naming] = getName.mock.calls[0];
    expect(index).toBe(3);
    expect(title).toBe('Part-1');
    expect(author).toBe('TestAuthor');
    expect(dateStr).toMatch(/^\d{4}-\d{1,2}-\d{1,2}$/);
    expect(naming).toBe('INDEX-TITLE');
  });

  it('should call getPlayUrl with correct cid and bvid', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1, {
      naming: defaultNaming,
    });

    expect(getPlayUrl).toHaveBeenCalledWith(100, 'BV1test');
  });

  it('should return filename and title', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');
    mockStreamDownload();

    const result = await download(
      'https://www.bilibili.com/video/BV1test?p=1',
      1,
      { naming: defaultNaming },
    );
    expect(result.filename).toBe('TestFile.flv');
    expect(result.title).toBe('Part-1');
  });

  it('should unlink existing file before download', async () => {
    fs.promises.stat.mockResolvedValueOnce(undefined);
    fs.promises.unlink.mockResolvedValueOnce(undefined);

    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1, {
      naming: defaultNaming,
    });
    expect(fs.promises.unlink).toHaveBeenCalled();
  });

  it('should reject on stream error', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');

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
      download('https://www.bilibili.com/video/BV1test?p=1', 1, {
        naming: defaultNaming,
      }),
    ).rejects.toThrow('network broken');
  });

  it('should reject on axios request failure', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');
    axios.mockRejectedValueOnce(new Error('request failed'));

    await expect(
      download('https://www.bilibili.com/video/BV1test?p=1', 1, {
        naming: defaultNaming,
      }),
    ).rejects.toThrow('request failed');
  });

  it('should reject on writeStream error', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');

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
      download('https://www.bilibili.com/video/BV1test?p=1', 1, {
        naming: defaultNaming,
      }),
    ).rejects.toThrow('disk full');
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
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1, {
      naming: defaultNaming,
    });

    const [, title] = getName.mock.calls[0];
    expect(title).toBe('Single-Video-Title');
  });

  it('should use page part name for multi-page videos', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    vi.mocked(getPlayUrl).mockResolvedValue('https://audio.url/test.m4s');
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1, {
      naming: defaultNaming,
    });

    const [, title] = getName.mock.calls[0];
    expect(title).toBe('Part-1');
  });
});
