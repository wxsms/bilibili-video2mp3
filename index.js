import { downloadToDisk } from './src/download.js';
import { getDataByUrl } from './src/getDataByUrl.js';

const url = 'https://www.bilibili.com/video/BV1yZ4y1X7v3?p=1';

(async function () {
  const data = await getDataByUrl(url);
  console.log(`total threads: ${data.videoData.pages.length}`);
  await Promise.all(
    data.videoData.pages.map((v, i) => downloadToDisk(url.replace(/p=\d+/, `p=${i + 1}`)))
  );
})();
