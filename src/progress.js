import Progress from 'multi-progress';

const multi = new Progress(process.stderr);

export function createProgressBar(index, title, total) {
  return multi.newBar(`${index} ${title}\t[:bar] :percent :etas :status`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: total,
  });
}
