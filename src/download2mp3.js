import { download2disk } from './download.js';
import { flv2mp3 } from './flv2mp3.js';
import fs from 'fs';

export async function download2mp3 (url) {
  try {
    const filename = await download2disk(url);
    await flv2mp3(filename);
    fs.unlinkSync(filename);
  } catch (err) {
    console.error(`${url} error:`);
    console.error(err);
  }
}
