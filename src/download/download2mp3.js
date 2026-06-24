import { download } from './downloadTask.js';
import { flv2mp3 } from '../convert/flv2mp3.js';
import * as fs from 'fs';
import { sleep } from '../utils/sleep.js';
import { resolve } from 'path';

const MAX_RETRY = 3;

export async function download2mp3(
  { url, index, naming, ffmpeg, skipMp3, debug, indexOffset },
  retryCount = 0,
) {
  const offsetIndex = (indexOffset || 0) + index;
  try {
    const { filename } = await download(url, offsetIndex, { naming });
    if (!skipMp3) {
      await flv2mp3(filename, ffmpeg);
      await fs.promises.unlink(filename);
    }
    return { index: offsetIndex, success: true };
  } catch (err) {
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
      return { index: offsetIndex, success: false, error: err.message, url };
    }
    await sleep(2000 * (retryCount + 1));
    return download2mp3(
      { url, index, naming, ffmpeg, skipMp3, debug, indexOffset },
      retryCount + 1,
    );
  }
}
