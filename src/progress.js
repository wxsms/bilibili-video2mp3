import Progress from 'multi-progress';

const multi = new Progress(process.stderr);

export function createProgressBar (total, filename) {
  return multi.newBar(`downloading [:bar] :percent :etas ${filename}`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: total
  });
}