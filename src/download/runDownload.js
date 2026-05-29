import { download2mp3 } from './download2mp3.js';
import { sleep } from '../utils/sleep.js';

export async function runDownload({
  pages,
  threads,
  naming,
  ffmpeg,
  skipMp3,
  debug,
  indexOffset,
}) {
  let maxThreads = threads;
  let currentThreads = 0;
  let finished = 0;

  for (const page of pages) {
    while (currentThreads === maxThreads) {
      await sleep(100);
    }
    currentThreads += 1;
    download2mp3({
      url: page.url,
      index: page.index,
      naming,
      ffmpeg,
      skipMp3,
      debug,
      indexOffset,
    })
      .then(() => {
        currentThreads -= 1;
        finished += 1;
        if (finished === pages.length) {
          process.exit(0);
        }
      })
      .catch((err) => {
        currentThreads -= 1;
        finished += 1;
        console.error(`Failed after retries: ${page.url}`, err.message);
        if (finished === pages.length) {
          process.exit(1);
        }
      });
  }
}
