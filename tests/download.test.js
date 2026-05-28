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
    createWriteStream: vi.fn(() => ({ close: vi.fn() })),
  },
  promises: {
    stat: vi.fn().mockRejectedValue(new Error('not found')),
    unlink: vi.fn(),
  },
  createWriteStream: vi.fn(() => ({ close: vi.fn() })),
}));

import axios from 'axios';
import { getDataByUrl } from '../src/getDataByUrl.js';
import { getName } from '../src/naming.js';
import { createProgressBar } from '../src/progress.js';
import { download } from '../src/download.js';

function mockStreamDownload(contentLength = 1024) {
  const mockStream = new EventEmitter();
  mockStream.pipe = vi.fn((ws) => {
    setTimeout(() => {
      mockStream.emit('data', Buffer.alloc(512));
      mockStream.emit('data', Buffer.alloc(contentLength - 512));
      mockStream.emit('end');
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
  });

  it('should call getDataByUrl with the given url', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: { data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } } },
    });
    mockStreamDownload();

    await download('https://www.bilibili.com/video/BV1test?p=1', 1);
    expect(getDataByUrl).toHaveBeenCalledWith('https://www.bilibili.com/video/BV1test?p=1');
  });

  it('should call getName with index and derived metadata', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: { data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } } },
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
      data: { data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } } },
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
      data: { data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } } },
    });
    mockStreamDownload();

    const result = await download('https://www.bilibili.com/video/BV1test?p=1', 1);
    expect(result.filename).toBe('TestFile.flv');
    expect(result.bar).toBeDefined();
  });

  it('should create progress bar with correct params', async () => {
    vi.mocked(getDataByUrl).mockResolvedValue(mockVideoData);
    axios.get.mockResolvedValue({
      data: { data: { dash: { audio: [{ baseUrl: 'https://audio.url/test.m4s' }] } } },
    });
    mockStreamDownload(2048);

    await download('https://www.bilibili.com/video/BV1test?p=1', 2);
    expect(createProgressBar).toHaveBeenCalledWith(2, 'Part-1', 2048);
  });
});

describe('download title derivation', () => {
  it('uses videoData.title for single-page videos', () => {
    const pages = [{ cid: 100, part: 'Only Part' }];
    const videoData = { title: 'Main Title', pages };
    const isSingle = pages.length === 1;
    const pid = 1;
    const title = (isSingle ? videoData.title : pages[pid - 1].part).replace(/\s/g, '-');
    expect(title).toBe('Main-Title');
  });

  it('uses page part name for multi-page videos', () => {
    const pages = [
      { cid: 100, part: 'First Episode' },
      { cid: 200, part: 'Second Episode' },
    ];
    const isSingle = pages.length === 1;
    const pid = 2;
    const title = (isSingle ? 'Main' : pages[pid - 1].part).replace(/\s/g, '-');
    expect(title).toBe('Second-Episode');
  });
});
