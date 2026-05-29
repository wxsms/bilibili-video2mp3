import { getDataByUrl } from '../bilibili/getDataByUrl.js';
import { getPlayUrl } from '../bilibili/getPlayUrl.js';
import { getName } from '../bilibili/naming.js';
import { downloadStream } from './download.js';
import filenamify from 'filenamify';

export async function download(url, index, { naming }) {
  const data = await getDataByUrl(url);
  const { videoData } = data;
  const { pages } = videoData;
  const isSingle = pages.length === 1;
  const pid = data.p;
  const cid = pages[pid - 1].cid;
  const title = (isSingle ? videoData.title : pages[pid - 1].part).replace(
    /\s/g,
    '-',
  );
  const date = new Date(videoData.ctime * 1000);
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const author = videoData.owner.name;
  const filename = filenamify(
    `${getName(index, title, author, dateString, naming)}.flv`,
  );

  const videoDownloadUrl = await getPlayUrl(cid, videoData.bvid);
  const bar = await downloadStream(videoDownloadUrl, title, filename, index);
  return { filename, bar };
}
