/**
 * Custom ESM loader that intercepts specific modules and replaces them with mocks.
 *
 * Registered by mock-server.mjs via Module.register().
 *
 * Intercepts:
 * - getDataByUrl.js / getPlayUrl.js: injects axios.get mock returning fixture data
 * - download.js: replaces downloadStream with a mock that creates dummy .flv files
 * - flv2mp3.js: replaces flv2mp3 with a mock that creates dummy .mp3 files
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let mockDir;
let htmlContent;
let playUrlData;
let axiosMockSource;

export function initialize(data) {
  mockDir = data.mockDir;
  htmlContent = readFileSync(resolve(mockDir, 'bilibili-page.html'), 'utf-8');
  playUrlData = JSON.parse(
    readFileSync(resolve(mockDir, 'bilibili-playurl.json'), 'utf-8'),
  );
  axiosMockSource = `
  const __mockHtmlContent = ${JSON.stringify(htmlContent)};
  const __mockPlayUrlData = ${JSON.stringify(playUrlData)};
  const __originalGet = axios.get.bind(axios);
  axios.get = function(url, config) {
    if (url.includes('bilibili.com/video/')) {
      return Promise.resolve({ data: __mockHtmlContent, status: 200, headers: {} });
    }
    if (url.includes('api.bilibili.com/x/player/playurl')) {
      const m = url.match(/cid=(\\d+)/);
      const cid = m ? m[1] : null;
      const resp = __mockPlayUrlData[cid];
      if (resp) {
        return Promise.resolve({ data: resp, status: 200, headers: {} });
      }
    }
    return __originalGet(url, config);
  };
`;
}

function decodeSource(result) {
  return typeof result.source === 'string'
    ? result.source
    : new TextDecoder().decode(result.source);
}

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);

  if (result.format !== 'module') return result;

  // Inject axios.get mock into getDataByUrl.js
  if (url.includes('/bilibili/getDataByUrl.js')) {
    const original = decodeSource(result);
    result.source = original.replace(
      /(import axios from 'axios';)/,
      `$1\n${axiosMockSource}`,
    );
    return result;
  }

  // Inject axios.get mock into getPlayUrl.js
  if (url.includes('/bilibili/getPlayUrl.js')) {
    const original = decodeSource(result);
    result.source = original.replace(
      /(import axios from 'axios';)/,
      `$1\n${axiosMockSource}`,
    );
    return result;
  }

  // Replace flv2mp3 — skip actual ffmpeg conversion
  if (url.includes('flv2mp3.js') && !url.includes('_flv2mp3')) {
    result.source = [
      "import { writeFile } from 'node:fs/promises';",
      'export async function flv2mp3(filename, ffmpegOpts) {',
      "  const mp3 = filename.replace('.flv', '.mp3');",
      "  await writeFile(mp3, 'mock-mp3-data');",
      '}',
    ].join('\n');
    return result;
  }

  // Replace downloadStream — skip actual network download, create dummy .flv file
  if (
    url.endsWith('/download/download.js') ||
    url.includes('/download/download.js?')
  ) {
    result.source = [
      "import { writeFile } from 'node:fs/promises';",
      'export async function downloadStream(url, title, filename, index) {',
      "  await writeFile(filename, 'mock-flv-data');",
      '  return { tick: () => {} };',
      '}',
    ].join('\n');
    return result;
  }

  return result;
}
