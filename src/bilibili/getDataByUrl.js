import axios from 'axios';

export async function getDataByUrl(url) {
  const { data } = await axios.get(url);
  const match = data.match(/__INITIAL_STATE__=(.*?);\(function\(\)/);
  if (!match) {
    throw new Error('Failed to extract __INITIAL_STATE__ from page');
  }
  return JSON.parse(match[1]);
}
