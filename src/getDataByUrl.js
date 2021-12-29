import fetch from 'node-fetch';

export async function getDataByUrl (url) {
  const htmlPage = await (await fetch(url)).text();
  // console.log(htmlPage);
  const initialStateStr = htmlPage.match(/__INITIAL_STATE__=(.*?);/)[1];
  return JSON.parse(initialStateStr);
}