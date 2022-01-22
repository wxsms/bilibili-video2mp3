import { fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg';
import * as fs from 'fs';
import { resolve } from 'path';
import { uniqueId, noop } from 'lodash-es';
import { sleep } from './utils.js';

let ffmpeg = createFFmpeg({ log: false });
ffmpeg.load().then(noop);

export async function flv2mp3(filename) {
  while (!ffmpeg.isLoaded()) {
    await sleep(100);
  }
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
}
