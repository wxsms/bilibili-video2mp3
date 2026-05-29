import { fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg';
import * as fs from 'fs';
import { resolve } from 'path';
import { uniqueId } from 'lodash-es';

(async () => {
  let filename = process.argv[2];
  let ff = process.argv[3];
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
    let ffArgs = ['-y'];
    if (ff) {
      ffArgs = [
        ...ffArgs,
        ...ff
          .split(' ')
          .map((v) => v.trim())
          .filter((v) => !!v),
      ];
    }
    ffArgs = [...ffArgs, '-i', memBefore, '-q:a', '0', memAfter];

    await ffmpeg.run(...ffArgs);
    await fs.promises.writeFile(
      resolve(process.cwd(), mp3),
      ffmpeg.FS('readFile', memAfter),
    );
    ffmpeg.FS('unlink', memBefore);
    ffmpeg.FS('unlink', memAfter);
    process.exit(0);
  } catch {
    process.exit(1);
  }
})();
