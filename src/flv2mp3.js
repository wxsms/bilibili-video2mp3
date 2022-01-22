import { fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg';
import * as fs from 'fs';
import { resolve } from 'path';

export async function flv2mp3 (filename) {
  const after = filename.replace('.flv', '.mp3');
  const ffmpeg = createFFmpeg({ log: false });
  await ffmpeg.load();
  ffmpeg.FS('writeFile', 'before.flv', await fetchFile(resolve(process.cwd(), filename)));
  // ffmpeg -y -i ${filename} -q:a 0 ${mp3}
  await ffmpeg.run('-y', '-i', 'before.flv', '-q:a', '0', 'after.mp3');
  await fs.promises.writeFile(resolve(process.cwd(), after), ffmpeg.FS('readFile', 'after.mp3'));
}
