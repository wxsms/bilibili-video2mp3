#!/usr/bin/env node

import { download2mp3 } from './src/download2mp3.js';
import { getDataByUrl } from './src/getDataByUrl.js';
import minimist from 'minimist';

const { url } = minimist(process.argv.slice(2));

(async function () {
  const data = await getDataByUrl(url);
  console.log(`total threads: ${data.videoData.pages.length}`);
  await Promise.all(
    data.videoData.pages.map((v, i) => {
      return download2mp3(url.replace(/p=\d+/, `p=${i + 1}`));
    }));
})();
