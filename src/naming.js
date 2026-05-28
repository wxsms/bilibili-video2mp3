import { program } from 'commander';

export function getName(index, title, author, date) {
  const argv = program.opts();
  return (
    argv.naming
      .replace(/INDEX|TITLE|AUTHOR|DATE/g, (token) => {
        switch (token) {
          case 'INDEX':
            return index;
          case 'TITLE':
            return title;
          case 'AUTHOR':
            return author;
          case 'DATE':
            return date;
        }
      })
      // leading - cause ffmpeg command fail
      .replace(/^-*/, '')
  );
}
