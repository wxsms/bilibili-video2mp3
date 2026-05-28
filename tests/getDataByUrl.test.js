import { describe, it, expect, vi } from 'vitest';

const mockState = {
  videoData: {
    bvid: 'BV1xx411c7mD',
    aid: 12345,
    title: 'Test Video',
    owner: { name: 'TestAuthor' },
    ctime: 1700000000,
    pages: [{ cid: 100, part: 'Part1' }],
  },
  p: 1,
};

const mockHtml = `<script>__INITIAL_STATE__=${JSON.stringify(mockState)};(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script>`;

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from 'axios';
import { getDataByUrl } from '../src/getDataByUrl.js';

describe('getDataByUrl', () => {
  it('should parse __INITIAL_STATE__ from HTML response', async () => {
    axios.get.mockResolvedValue({ data: mockHtml });
    const result = await getDataByUrl('https://www.bilibili.com/video/BV1xx411c7mD');
    expect(result.videoData.bvid).toBe('BV1xx411c7mD');
    expect(result.videoData.title).toBe('Test Video');
    expect(result.p).toBe(1);
  });

  it('should throw if __INITIAL_STATE__ is not found', async () => {
    axios.get.mockResolvedValue({ data: '<html>no state here</html>' });
    await expect(getDataByUrl('https://www.bilibili.com/video/BV1xx411c7mD')).rejects.toThrow(
      'Failed to extract __INITIAL_STATE__ from page',
    );
  });

  it('should handle state with special characters in title', async () => {
    const specialState = {
      ...mockState,
      videoData: { ...mockState.videoData, title: 'Test "Video" & <More>' },
    };
    const specialHtml = `<script>__INITIAL_STATE__=${JSON.stringify(specialState)};(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script>`;
    axios.get.mockResolvedValue({ data: specialHtml });
    const result = await getDataByUrl('https://www.bilibili.com/video/BV1xx411c7mD');
    expect(result.videoData.title).toBe('Test "Video" & <More>');
  });
});
