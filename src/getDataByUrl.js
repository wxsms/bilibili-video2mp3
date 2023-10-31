import agent from './agent.js';

export async function getDataByUrl(url) {
  const { data } = await agent.get(url);
  // console.log('--------data------------');
  // console.log(data);
  // console.log('--------------------');
  const initialStateStr = data.match(
    /__INITIAL_STATE__=(.*?);\(function\(\)/,
  )[1];
  // console.log('--------initialStateStr------------');
  // console.log(initialStateStr);
  // console.log('--------------------');
  return JSON.parse(initialStateStr);
}
