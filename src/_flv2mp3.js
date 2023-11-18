import { fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg';
import * as fs from 'fs';
import { resolve } from 'path';
import { uniqueId } from 'lodash-es';
// import { debuglog } from './debuglog.js';

(async () => {
  let filename = process.argv[2];
  let cutFrom = process.argv[3];
  let cutTo = process.argv[4];
  // debuglog(`start: ${filename}`)
  let ffmpeg = createFFmpeg({ log: false });
  await ffmpeg.load();
  try {
    const id = uniqueId();
    const mp3 = filename.replace('.flv', '.mp3');
    const memBefore = `${id}before.flv`;
    const memAfter = `${id}after.mp3`;
    ffmpeg.FS(
      'writeFile',
      memBefore,
      await fetchFile(resolve(process.cwd(), filename)),
    );
    // ffmpeg -y -i ${filename} -q:a 0 ${mp3}
    let ffArgs = ['-y'];
    if (cutFrom) {
      ffArgs = [...ffArgs, '-ss', cutFrom];
    }
    if (cutTo) {
      ffArgs = [...ffArgs, '-to', cutTo];
    }
    ffArgs = [...ffArgs, '-i', memBefore, '-q:a', '0', memAfter];

    await ffmpeg.run(...ffArgs);
    await fs.promises.writeFile(
      resolve(process.cwd(), mp3),
      ffmpeg.FS('readFile', memAfter),
    );
    ffmpeg.FS('unlink', memBefore);
    ffmpeg.FS('unlink', memAfter);
    // debuglog(`done: ${filename}`);
    process.exit(0);
  } catch (err) {
    // debuglog(`error: ${filename}`);
    // debuglog(err);
    process.exit(1);
  }
})();
