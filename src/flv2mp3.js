import { exec } from 'child_process';
import { join } from 'path';
import url from 'url';
import path from 'path';
import { program } from 'commander';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export function flv2mp3(filename) {
  const nodeVersion = Number(process.versions.node.split('.')[0]);
  // console.log(nodeVersion);
  if (nodeVersion >= 18) {
    const mp3 = filename.replace('.flv', '.mp3');
    return new Promise((resolve, reject) => {
      const argv = program.opts();
      exec(
        `ffmpeg -y ${argv.ffmpeg
          .split(' ')
          .map((v) => v.trim())
          .filter((v) => !!v)
          .join(' ')} -i "${filename}" -q:a 0 "${mp3}"`,
        (err) => {
          if (err) {
            reject(err);
          } else {
            // console.log(`${mp3} converted`);
            resolve();
          }
        },
      );
    });
  }
  return new Promise((resolve, reject) => {
    const argv = program.opts();
    // because ffmpeg.wasm can only run one command a time,
    // we use child process to run it concurrently
    exec(
      `node ${join(__dirname, '_flv2mp3.js')} "${filename}" "${argv.ffmpeg}"`,
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
