import { fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg';
import * as fs from 'fs';
import { resolve } from 'path';
import { uniqueId, noop } from 'lodash-es';
import { sleep } from './utils.js';

let ffmpeg = createFFmpeg({ log: false });
ffmpeg.load().then(noop);
let isRunning = false;

export async function flv2mp3(filename, bar) {
  try {
    while (!ffmpeg.isLoaded() || isRunning) {
      bar.tick({ status: 'queueing' });
      await sleep(1000);
    }
    bar.tick({ status: 'converting' });
    isRunning = true;
    const id = uniqueId();
    const mp3 = filename.replace('.flv', '.mp3');
    const memBefore = `${id}before.flv`;
    const memAfter = `${id}after.mp3`;
    ffmpeg.FS(
      'writeFile',
      memBefore,
      await fetchFile(resolve(process.cwd(), filename))
    );
    // ffmpeg -y -i ${filename} -q:a 0 ${mp3}
    await ffmpeg.run('-y', '-i', memBefore, '-q:a', '0', memAfter);
    await fs.promises.writeFile(
      resolve(process.cwd(), mp3),
      ffmpeg.FS('readFile', memAfter)
    );
    ffmpeg.FS('unlink', memBefore);
    ffmpeg.FS('unlink', memAfter);
  } catch (err) {
    bar.tick({ status: 'error' });
    throw err;
  } finally {
    isRunning = false;
  }
}
