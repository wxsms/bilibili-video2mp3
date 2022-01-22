import * as fs from 'fs';
import { createHash } from 'crypto';
import { getDataByUrl } from './getDataByUrl.js';
import argv from './argv.js';
import { createProgressBar } from './progress.js';
import { getName } from './naming.js';
import agent from './agent.js';
import axios from 'axios';

async function _download (url, filename, index) {
  // console.log('download', url)
  try {
    await fs.promises.stat(filename);
    await fs.promises.unlink(filename);
  } catch (err) {
    // ignore
  }
  return new Promise((resolve, reject) => {


    agent({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'Range': `bytes=0-`,
        'User-Agent': 'PostmanRuntime/7.28.4',
        'Referer': 'https://www.bilibili.com/'
      },
    })
      .then(({ data, headers }) => {
        const writeStream = fs.createWriteStream(filename);
        const bar = createProgressBar(index, filename, parseInt(headers['content-length'], 10));
        data.pipe(writeStream);
        data.on('data', (chunk) => bar.tick(chunk.length));
        data.on('end', () => {
          writeStream.close();
          resolve();
        });
        data.on('error', () => {
          writeStream.close();
        })
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function download (url, index) {
  const data = await getDataByUrl(url);
  // console.log(initialState);
  const { videoData } = data;
  const { pages } = videoData;
  const isSingle = pages.length === 1;
  // const aid = videoData.aid;
  const pid = data.p;
  const cid = pages[pid - 1].cid;
  const title = (isSingle ? videoData.title : pages[pid - 1].part).replace(/\s/g, '-');
  const date = new Date(videoData.ctime * 1000);
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const author = argv.author || videoData.owner.name;
  const filename = `${getName(index, title, author, dateString)}.flv`;
  // console.log('aid:', aid);
  // console.log('pid:', pid);
  // console.log('cid:', cid);

  const params = `appkey=iVGUTjsxvpLeuDCf&cid=${cid}&otype=json&qn=112&quality=112&type=`;
  const sign = createHash('md5').update(params + 'aHRmhWMLkdeMuILqORnYZocwMBpMEOdt').digest('hex');
  const playUrl = `https://interface.bilibili.com/v2/playurl?${params}&sign=${sign}`;

  const playResult = await axios.get(playUrl);
  // console.log(playResult);
  const videoDownloadUrl = playResult.data.durl[0].url;
  // console.log(videoDownloadUrl);
  await _download(videoDownloadUrl, filename, index);
  return filename;
}
