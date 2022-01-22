import Progress from 'multi-progress';
import { program } from 'commander';

const multi = new Progress(process.stderr);

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let prevIndex = -1;

export async function createProgressBar(index, filename, total) {
  const argv = program.opts();
  const baseIndex = argv.from || 1;
  if (index !== baseIndex) {
    while (index !== prevIndex + 1) {
      await sleep(100);
    }
  }
  prevIndex = index;

  return multi.newBar(`${index} [:bar] :percent :etas ${filename}`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: total,
  });
}
