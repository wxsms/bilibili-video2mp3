import axios from 'axios';

export async function getPlayUrl(cid, bvid) {
  const playUrl = `https://api.bilibili.com/x/player/playurl?fnval=80&cid=${cid}&bvid=${bvid}`;
  const playResult = await axios.get(playUrl);
  return playResult.data.data.dash.audio[0].baseUrl;
}
