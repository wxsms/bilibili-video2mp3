#!/usr/bin/env node
import { program, InvalidArgumentError } from 'commander';
import { download2mp3 } from './src/download2mp3.js';
import { getDataByUrl } from './src/getDataByUrl.js';
import { createRequire } from 'module';
import { chunk } from 'lodash-es';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
program.version(pkg.version);

function validateInt(value) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

program
  .requiredOption(
    '--url [urls...]',
    `the video set (or single) url of bilibili.`
  )
  .option(
    '--from <number>',
    'limit to page download from, 1-based.',
    validateInt
  )
  .option('--to <number>', 'limit to page download to, 1-based.', validateInt)
  .option('--threads <number>', 'how many download threads.', validateInt, 5)
  .option(
    '--naming <string>',
    `change the downloaded files' naming pattern. available: INDEX, TITLE, AUTHOR, DATE`,
    'TITLE-AUTHOR-DATE'
  )
  .option(
    '--index-offset <number>',
    'offset added to INDEX while saved.',
    validateInt
  )
  .option(
    '--skip-mp3',
    'skip the mp3 transform and keep downloaded file as video.',
    false
  )
  .option('--debug', 'enable debug log.', false);

program.parse(process.argv);
const argv = program.opts();
// console.log(argv);

(async function () {
  const urls = typeof argv.url === 'string' ? [argv.url] : argv.url;
  let pages = [];

  for (let url of urls) {
    url = url.trim();
    console.log(`fetching pages for ${url}`);
    const data = await getDataByUrl(url);
    // console.log(data);
    // console.log(`total threads: ${data.videoData.pages.length}`);
    pages = [
      ...pages,
      ...data.videoData.pages.map((value, index) => {
        const p = index + 1;
        return url.indexOf('p=') > 0
          ? url.replace(/p=\d+/, `p=${p}`)
          : `${url.replace(/\?.+/, '')}?p=${p}`;
      }),
    ];
  }
  pages = pages
    .map((value, index) => {
      return {
        url: value,
        index: index + 1,
      };
    })
    .filter(
      ({ index }) =>
        !(
          (typeof argv.from === 'number' && index < argv.from) ||
          (typeof argv.to === 'number' && index > argv.to)
        )
    );

  const pageChunks = chunk(pages, argv.threads || 5);
  for (const c of pageChunks) {
    await Promise.all(c.map(download2mp3));
  }
})();
