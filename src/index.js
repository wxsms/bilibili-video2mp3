#!/usr/bin/env node
import { program } from 'commander';
import { createRequire } from 'module';
import { validateInt } from './utils/validateInt.js';
import { checkFfmpeg } from './utils/checkFfmpeg.js';
import { fetchPages } from './bilibili/fetchPages.js';
import { runDownload } from './download/runDownload.js';
import { interactive } from './interactive.js';
import axios from 'axios';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

axios.defaults.headers = {
  referer: 'https://www.bilibili.com/',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
};
axios.defaults.timeout = 0;

program.version(pkg.version);
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
  .option('-f --ffmpeg <string>', 'additional options applied to ffmpeg', '')
  .option(
    '--skip-mp3',
    'skip the mp3 transform and keep downloaded file as video.',
    false,
  )
  .option('--debug', 'enable debug log.', false);

if (process.argv.length <= 2) {
  interactive();
} else {
  program.parse(process.argv);
  const argv = program.opts();

  (async function () {
    if (!argv.skipMp3 && !(await checkFfmpeg())) {
      console.error(
        'Error: ffmpeg not found. Install it from https://ffmpeg.org/ or use --skip-mp3 to skip conversion.',
      );
      process.exit(1);
    }

    const urls = typeof argv.url === 'string' ? [argv.url] : argv.url;
    let pages = await fetchPages(urls);

    pages = pages.filter(
      ({ index }) =>
        !(
          (typeof argv.from === 'number' && index < argv.from) ||
          (typeof argv.to === 'number' && index > argv.to)
        ),
    );

    await runDownload({
      pages,
      threads: argv.threads,
      naming: argv.naming,
      ffmpeg: argv.ffmpeg,
      skipMp3: argv.skipMp3,
      debug: argv.debug,
      indexOffset: argv.indexOffset,
    });
  })();
}
