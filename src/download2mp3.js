import { download2disk } from './download.js';
import { flv2mp3 } from './flv2mp3.js';
import fs from 'fs';
import argv from './argv.js';

export async function download2mp3 ({ url, index }) {
  try {
    const filename = await download2disk(url, index);
    if (argv['skip-mp3']) {
      return;
    }
    await flv2mp3(filename);
    fs.unlinkSync(filename);
  } catch (err) {
    console.error(`${url} error:`);
    console.error(err);
  }
}
