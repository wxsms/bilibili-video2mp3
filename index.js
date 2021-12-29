#!/usr/bin/env node

import { download2mp3 } from './src/download2mp3.js';
import { getDataByUrl } from './src/getDataByUrl.js';
import argv from './src/argv.js';

(async function () {
  const data = await getDataByUrl(argv.url);
  // console.log(`total threads: ${data.videoData.pages.length}`);
  await Promise.all(
    data.videoData.pages.map((v, i) => {

      return download2mp3(
        argv.url.indexOf('p=') > 0 ?
          argv.url.replace(/p=\d+/, `p=${i + 1}`) :
          `${argv.url.replace(/\?.+/, '')}?p=${i + 1}`
      );
    }));
})();
