#!/usr/bin/env node

import { download2mp3 } from './src/download2mp3.js';
import { getDataByUrl } from './src/getDataByUrl.js';
import argv from './src/argv.js';
import { help } from './src/help.js';
import { createRequire } from 'module';
import { chunk } from 'lodash-es';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

process.on('uncaughtException', err => {
  for (let i = 1; i <= 100; ++i) {
    console.log();
  }
  console.error(err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

(async function () {
  if (argv.help) {
    console.log(help);
    return;
  }

  if (argv.version) {
    console.log(pkg.version);
    return;
  }

  if (!argv.url) {
    throw new Error('Please specify url to download');
  }

  let urls = argv.url;
  const from = argv.from;
  const to = argv.to;
  let pages = [];

  if (typeof urls === 'string') {
    urls = [urls];
  }

  for (let url of urls) {
    url = url.trim();
    console.log(`fetching pages for ${url}`);
    const data = await getDataByUrl(url);
    // console.log(data);
    // console.log(`total threads: ${data.videoData.pages.length}`);
    pages = [...pages, ...data.videoData.pages
      .map((value, index) => {
        const p = index + 1;
        return url.indexOf('p=') > 0 ? url.replace(/p=\d+/, `p=${p}`) : `${url.replace(/\?.+/, '')}?p=${p}`;
      })];
  }
  pages = pages
    .map((value, index) => {
      return {
        url: value,
        index: index + 1
      };
    })
    .filter(({ index }) => {
      return !((typeof from === 'number' && index < from) || (typeof to === 'number' && index > to));
    });

  const pageChunks = chunk(pages, 10);
  for (const c of pageChunks) {
    await Promise.all(c.map(download2mp3));
  }
})();
