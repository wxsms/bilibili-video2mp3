import Progress from 'multi-progress';

let multi = null;

function getMulti() {
  if (!multi) {
    multi = new Progress(process.stderr);
  }
  return multi;
}

export function createProgressBar(index, title, total) {
  return getMulti().newBar(`${index} [:bar] :percent :etas :status ${title}`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: total,
  });
}

export function terminateProgress() {
  if (multi) {
    multi.terminate();
  }
}
