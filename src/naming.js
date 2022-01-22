import { program } from 'commander';

export function getName(index, title, author, date) {
  const argv = program.opts();
  return (
    argv.naming
      .replace('INDEX', (argv['index-offset'] || 0) + index)
      .replace('TITLE', title)
      .replace('AUTHOR', author)
      .replace('DATE', date)
      // leading - cause ffmpeg command fail
      .replace(/^-*/, '')
  );
}
