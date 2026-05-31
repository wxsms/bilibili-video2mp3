import * as fs from 'fs';
import axios from 'axios';

export async function downloadStream(url, filename) {
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
      .then(({ data }) => {
        const writeStream = fs.createWriteStream(filename);
        let failed = false;
        data.pipe(writeStream);
        writeStream.on('finish', () => {
          if (failed) {
            return;
          }
          resolve();
        });
        writeStream.on('error', (err) => {
          failed = true;
          reject(err);
        });
        data.on('error', (err) => {
          failed = true;
          writeStream.destroy();
          reject(err);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
