import * as fs from 'fs';
import { createProgressBar } from './progress.js';
import axios from 'axios';

export async function downloadStream(url, title, filename, index) {
  try {
    await fs.promises.stat(filename);
    await fs.promises.unlink(filename);
  } catch {
    // ignore
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        Range: `bytes=${0}-`,
      },
    })
      .then(({ data, headers }) => {
        const writeStream = fs.createWriteStream(filename);
        const total = parseInt(headers['content-length'], 10);
        const bar = createProgressBar(index, title, total);
        let failed = false;
        data.pipe(writeStream);
        data.on('data', (chunk) => {
          if (failed) {
            return;
          }
          bar.tick(chunk.length, { status: 'downloading' });
        });
        writeStream.on('finish', () => {
          if (failed) {
            return;
          }
          resolve(bar);
        });
        writeStream.on('error', (err) => {
          failed = true;
          bar.tick(total);
          bar.tick({ status: 'error' });
          reject(err);
        });
        data.on('error', (err) => {
          failed = true;
          bar.tick(total);
          bar.tick({ status: 'error' });
          writeStream.destroy();
          reject(err);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
