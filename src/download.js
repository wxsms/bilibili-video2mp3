import https from 'https';
import http from 'http';
import fs from 'fs';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { getDataByUrl } from './getDataByUrl.js';
import argv from './argv.js';
import { createProgressBar } from './progress.js';

function download (url, filename) {
  // console.log('download', url)
  return new Promise(((resolve, reject) => {
    try {
      fs.statSync(filename);
      fs.unlinkSync(filename);
    } catch (err) {
      // ignore
    }

    const writeStream = fs.createWriteStream(filename);
    const request = (url.startsWith('https') ? https : http)
      .get(url, {
        url: url,
        headers: {
          'Range': `bytes=0-`,
          'User-Agent': 'PostmanRuntime/7.28.4',
          'Referer': 'https://www.bilibili.com/'
        }
      }, function (response) {
        response.pipe(writeStream);
        const bar = createProgressBar(
          parseInt(response.headers['content-length'], 10),
          filename
        );
        response.on('data', function (chunk) {
          bar.tick(chunk.length);
        });

        response.on('end', () => {
          writeStream.close();
          resolve();
        });

        request.on('error', err => {
          fs.unlinkSync(filename);
          reject(err);
        });
      });
  }));
}

export async function download2disk (url) {
  const initialState = await getDataByUrl(url);
  // console.log(initialState);
  const aid = initialState.videoData.aid;
  const pid = initialState.p;
  const cid = initialState.videoData.pages[pid - 1].cid;
  const title = initialState.videoData.pages[pid - 1].part;
  const date = new Date(initialState.videoData.ctime * 1000);
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const author = argv.author || 'yousa';
  const filename = `${title}-${author}-${dateString}.flv`;
  // console.log('aid:', aid);
  // console.log('pid:', pid);
  // console.log('cid:', cid);

  const params = `appkey=iVGUTjsxvpLeuDCf&cid=${cid}&otype=json&qn=112&quality=112&type=`;
  const sign = crypto.createHash('md5').update(params + 'aHRmhWMLkdeMuILqORnYZocwMBpMEOdt').digest('hex');
  const playUrl = `https://interface.bilibili.com/v2/playurl?${params}&sign=${sign}`;

  const playResult = await (await fetch(playUrl)).json();
  // console.log(playResult);
  const videoDownloadUrl = playResult.durl[0].url;
  // console.log(videoDownloadUrl);
  await download(videoDownloadUrl, filename);
  return filename;
}
