import Progress from 'multi-progress';

const multi = new Progress(process.stderr);

export function createProgressBar(index, filename, total) {
  return multi.newBar(`${index} [:bar] :percent :etas ${filename}`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: total,
  });
}
