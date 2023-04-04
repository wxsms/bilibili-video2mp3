import fs from 'fs';
import { join } from 'path';

export function debuglog(data) {
  fs.appendFileSync(
    join(process.cwd(), 'bilibili-video2mp3-error.log'),
    data.toString() + '\n'
  );
}
