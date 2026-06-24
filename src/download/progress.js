import * as p from '@clack/prompts';

let bar = null;

export function startProgress(total) {
  bar = p.progress({ max: total, size: 30 });
  bar.start();
}

export function advanceProgress(msg) {
  bar?.advance(1, msg);
}

export function stopProgress() {
  bar?.stop();
}
