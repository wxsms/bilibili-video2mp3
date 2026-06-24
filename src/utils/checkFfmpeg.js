import { execFile } from 'child_process';

export function checkFfmpeg() {
  if (process.env.BV2MP3_SKIP_FFMPEG_CHECK === '1') {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    execFile('ffmpeg', ['-version'], (err) => {
      resolve(!err);
    });
  });
}
