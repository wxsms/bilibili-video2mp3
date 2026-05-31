import * as p from '@clack/prompts';
import { download2mp3 } from './download2mp3.js';
import { startProgress, advanceProgress, stopProgress } from './progress.js';
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
  let failed = 0;

  startProgress(pages.length);

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
    }).then((result) => {
      currentThreads -= 1;
      finished += 1;
      if (!result.success) {
        failed += 1;
        p.log.error(`❌ ${result.index}. ${result.url} — ${result.error}`);
      }
      advanceProgress(`${finished}/${pages.length}`);
      if (finished === pages.length) {
        stopProgress();
      }
    });
  }

  // Wait for all downloads to finish
  while (finished < pages.length) {
    await sleep(100);
  }

  return { total: pages.length, failed };
}
