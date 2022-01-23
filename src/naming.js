import { program } from 'commander';

export function getName(index, title, author, date) {
  const argv = program.opts();
  return (
    argv.naming
      .replace('INDEX', index)
      .replace('TITLE', title)
      .replace('AUTHOR', author)
      .replace('DATE', date)
      // leading - cause ffmpeg command fail
      .replace(/^-*/, '')
  );
}
