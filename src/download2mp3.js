import { download } from './download.js';
import { flv2mp3 } from './flv2mp3.js';
import * as fs from 'fs';
import { program } from 'commander';

export async function download2mp3 ({ url, index }) {
  try {
    const argv = program.opts();
    const filename = await download(url, index);
    if (argv.skipMp3) {
      return;
    }
    await flv2mp3(filename);
    await fs.promises.unlink(filename);
  } catch (err) {
    console.error(`${url} error:`);
    console.error(err);
  }
}
