import { downloadToDisk } from './src/download.js';

const url = 'https://www.bilibili.com/video/BV1yZ4y1X7v3?p=1';

(async function () {
  await downloadToDisk(url)
})();
