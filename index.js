#!/usr/bin/env node
import { program, InvalidArgumentError } from 'commander';
import { download2mp3 } from './src/download2mp3.js';
import { getDataByUrl } from './src/getDataByUrl.js';
import { createRequire } from 'module';
import { sleep } from './src/utils.js';
import axios from 'axios';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
program.version(pkg.version);

axios.defaults.headers = {
  referer: 'https://www.bilibili.com/',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
};
axios.defaults.timeout = 0;

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
    '-u, --url [urls...]',
    `the video set (or single) url of bilibili, can input multiple urls.`,
  )
  .option(
    '-t, --threads <number>',
    'how many download threads.',
    validateInt,
    10,
  )
  .option(
    '-n, --naming <string>',
    `change the downloaded files' naming pattern. available: INDEX, TITLE, AUTHOR, DATE`,
    'TITLE-AUTHOR-DATE',
  )
  .option(
    '--from <number>',
    'limit to page download from, 1-based.',
    validateInt,
  )
  .option('--to <number>', 'limit to page download to, 1-based.', validateInt)
  .option(
    '--index-offset <number>',
    'offset added to INDEX while saved.',
    validateInt,
    0,
  )
  .option('-ff --ffmpeg <string>', 'additional options applied to ffmpeg', '')
  .option(
    '--skip-mp3',
    'skip the mp3 transform and keep downloaded file as video.',
    false,
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
    console.log(`Fetching pages for:`, url);
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
        ),
    );
  // console.log('Pages:', pages);

  let maxThreads = argv.threads;
  let currentThreads = 0;
  let finished = 0;

  for (const page of pages) {
    while (currentThreads === maxThreads) {
      // wait for available thread
      await sleep(100);
    }
    currentThreads += 1;
    download2mp3(page).finally(() => {
      currentThreads -= 1;
      finished += 1;
      if (finished === pages.length) {
        process.exit(0);
      }
    });
  }
})();
