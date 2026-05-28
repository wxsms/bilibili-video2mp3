import axios from 'axios';

export async function getDataByUrl(url) {
  const { data } = await axios.get(url);
  // console.log('--------data------------');
  // console.log(data);
  // console.log('--------------------');
  // end by this:
  // ;(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script>
  const match = data.match(
    /__INITIAL_STATE__=(.*?);\(function\(\)/,
  );
  if (!match) {
    throw new Error('Failed to extract __INITIAL_STATE__ from page');
  }
  const initialStateStr = match[1];
  // console.log('--------initialStateStr------------');
  // console.log(initialStateStr);
  // console.log('--------------------');
  return JSON.parse(initialStateStr);
}
