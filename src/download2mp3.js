import { download } from './download/downloadTask.js';
import { flv2mp3 } from './convert/flv2mp3.js';
import * as fs from 'fs';
import { sleep } from './utils/sleep.js';
import { resolve } from 'path';

const MAX_RETRY = 3;

export async function download2mp3(
  { url, index, naming, ffmpeg, skipMp3, debug, indexOffset },
  retryCount = 0,
) {
  const offsetIndex = (indexOffset || 0) + index;
  let b;
  try {
    const { filename, bar } = await download(url, offsetIndex, { naming });
    b = bar;
    if (!skipMp3) {
      bar.tick({ status: 'converting' });
      await flv2mp3(filename, ffmpeg);
      await fs.promises.unlink(filename);
    }
    bar.tick({ status: 'done' });
  } catch (err) {
    b?.tick({ status: 'error' });
    if (debug) {
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
    if (retryCount >= MAX_RETRY) {
      throw err;
    }
    await sleep(2000 * (retryCount + 1));
    await download2mp3(
      { url, index, naming, ffmpeg, skipMp3, debug, indexOffset },
      retryCount + 1,
    );
  }
}
