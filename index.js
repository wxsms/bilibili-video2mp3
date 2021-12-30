#!/usr/bin/env node

import { download2mp3 } from './src/download2mp3.js';
import { getDataByUrl } from './src/getDataByUrl.js';
import argv from './src/argv.js';

(async function () {
  for (let url of argv.url.split(',')) {
    url = url.trim();
    const data = await getDataByUrl(url);
    // console.log(data);
    // console.log(`total threads: ${data.videoData.pages.length}`);
    await Promise.all(data.videoData.pages.map((v, i) => {
      return download2mp3(url.indexOf('p=') > 0 ? url.replace(/p=\d+/, `p=${i + 1}`) : `${url.replace(/\?.+/, '')}?p=${i + 1}`);
    }));
  }
})();
