import https from 'https';
import http from 'http';
import fs from 'fs';
import fetch from 'node-fetch';
import crypto from 'crypto';

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

        const len = parseInt(response.headers['content-length'], 10);
        let cur = 0;
        const total = len / 1048576; //1048576 - bytes in  1Megabyte

        response.on('data', function (chunk) {
          cur += chunk.length;
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(`Downloading ${(100.0 * cur / len).toFixed(2)}%. ${filename}: ${total.toFixed(2)} mb.`);
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

export async function downloadToDisk (url) {
  const htmlPage = await (await fetch(url)).text();
  // console.log(htmlPage);
  const initialStateStr = htmlPage.match(/__INITIAL_STATE__=(.*?);/)[1];
  const initialState = JSON.parse(initialStateStr);
  // console.log(initialState);
  const aid = initialState.videoData.aid;
  const pid = initialState.p;
  const cid = initialState.videoData.pages[pid - 1].cid;
  const title = initialState.videoData.pages[pid - 1].part;
  const date = new Date(initialState.videoData.ctime * 1000);
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const filename = `${title}-yousa-${dateString}.flv`;
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
}
