export function getName(index, title, author, date, naming) {
  return (
    naming
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
