import Progress from 'multi-progress';

const multi = new Progress(process.stderr);

export function createProgressBar(index, title, total) {
  return multi.newBar(`${index} [:bar] :percent :etas :status ${title}`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: total,
    // renderThrottle: 1000,
  });
}
