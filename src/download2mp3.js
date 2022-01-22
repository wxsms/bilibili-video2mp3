import { download } from './download.js';
import { flv2mp3 } from './flv2mp3.js';
import * as fs from 'fs';
import argv from './argv.js';

export async function download2mp3 ({ url, index }) {
  try {
    const filename = await download(url, index);
    if (argv['skip-mp3']) {
      return;
    }
    await flv2mp3(filename);
    await fs.promises.unlink(filename);
  } catch (err) {
    console.error(`${url} error:`);
    console.error(err);
  }
}
