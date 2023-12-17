import { download } from './download.js';
import { flv2mp3 } from './flv2mp3.js';
import * as fs from 'fs';
import { program } from 'commander';
import { sleep } from './utils.js';
import { resolve } from 'path';

export async function download2mp3({ url, index }) {
  const argv = program.opts();
  const offsetIndex = (argv.indexOffset || 0) + index;
  let b;
  try {
    const { filename, bar } = await download(url, offsetIndex);
    b = bar;
    if (!argv.skipMp3) {
      bar.tick({ status: 'converting' });
      await flv2mp3(filename);
      await fs.promises.unlink(filename);
    }
    bar.tick({ status: 'done' });
  } catch (err) {
    b?.tick({ status: 'error' });
    if (argv.debug) {
      const logFile = resolve(process.cwd(), 'bilibili-video2mp3-error.log');
      await fs.promises.appendFile(
        logFile,
        `index: ${offsetIndex}
url: ${url}
err: ${err.message}
stack: ${err.stack}


`,
      );
    }
    await sleep(2000);
    await download2mp3({ url, index });
  }
}
