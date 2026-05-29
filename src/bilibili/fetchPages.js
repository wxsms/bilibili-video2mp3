import { getDataByUrl } from './getDataByUrl.js';

/**
 * Fetch pages for all given URLs and return page info with titles.
 * @param {string[]} urls
 * @returns {Promise<{url: string, index: number, title: string}[]>}
 */
export async function fetchPages(urls) {
  let pages = [];
  for (const rawUrl of urls) {
    const url = rawUrl.trim();
    const data = await getDataByUrl(url);
    pages = [
      ...pages,
      ...data.videoData.pages.map((value, index) => {
        const pageNum = index + 1;
        const pageUrl =
          url.indexOf('p=') > 0
            ? url.replace(/p=\d+/, `p=${pageNum}`)
            : `${url.replace(/\?.+/, '')}?p=${pageNum}`;
        return {
          url: pageUrl,
          title:
            data.videoData.pages.length === 1
              ? data.videoData.title
              : value.part,
        };
      }),
    ];
  }
  return pages.map((page, index) => ({ ...page, index: index + 1 }));
}
