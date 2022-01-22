import { download } from './download.js';
import { flv2mp3 } from './flv2mp3.js';
import * as fs from 'fs';
import { program } from 'commander';
import { sleep } from './utils.js';
import { resolve } from 'path';

export async function download2mp3({ url, index }) {
  try {
    const argv = program.opts();
    const { filename, bar } = await download(url, index);
    if (argv.skipMp3) {
      return;
    }
    await flv2mp3(filename, bar);
    await fs.promises.unlink(filename);
    bar.tick({ status: 'done' });
  } catch (err) {
    const logFile = resolve(process.cwd(), 'bilibili-video2mp3-error.log');
    await fs.promises.appendFile(
      logFile,
      `index: ${index}\n` + `url: ${url}\n` + err.stack + '\n\n'
    );
    await sleep(2000);
    await download2mp3({ url, index });
  }
}
