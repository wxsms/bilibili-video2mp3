import argv from './argv.js';

const defaultPattern = 'TITLE-AUTHOR-DATE';

export function getName (index, title, author, date) {
  const p = argv.naming || defaultPattern;
  return p
    .replace('INDEX', index)
    .replace('TITLE', title)
    .replace('AUTHOR', author)
    .replace('DATE', date)
    // leading - cause ffmpeg command fail
    .replace(/^-*/, '');
}
