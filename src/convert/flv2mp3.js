import { execFile } from 'child_process';

export function flv2mp3(filename, ffmpegOpts = '') {
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
