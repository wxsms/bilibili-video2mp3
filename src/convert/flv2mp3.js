import { execFile } from 'child_process';
import { join } from 'path';
import url from 'url';
import path from 'path';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export function flv2mp3(filename, ffmpegOpts = '') {
  const nodeVersion = Number(process.versions.node.split('.')[0]);
  if (nodeVersion >= 18) {
    const mp3 = filename.replace('.flv', '.mp3');
    return new Promise((resolve, reject) => {
      const ffArgs = ffmpegOpts
        ? ffmpegOpts
            .split(' ')
            .map((v) => v.trim())
            .filter((v) => !!v)
        : [];
      execFile(
        'ffmpeg',
        ['-y', ...ffArgs, '-i', filename, '-q:a', '0', mp3],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }
  return new Promise((resolve, reject) => {
    // because ffmpeg.wasm can only run one command a time,
    // we use child process to run it concurrently
    execFile(
      'node',
      [join(__dirname, '_flv2mp3.js'), filename, ffmpegOpts || ''],
      { cwd: process.cwd() },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
}
