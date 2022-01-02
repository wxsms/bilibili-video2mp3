import argv from './argv.js';

const defaultPattern = 'TITLE-AUTHOR-DATE';

export function getName (title, author, date) {
  const p = argv.naming || defaultPattern;
  return p
    .replace('TITLE', title)
    .replace('AUTHOR', author)
    .replace('DATE', date);
}