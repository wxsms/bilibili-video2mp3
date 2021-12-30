export const help = `
--url
    required. the video set (or single) url of bilibili.
    can be multi url split by comma (,).
--author
    optional. file downloaded as title-author-date.mp3, default to up's name.
--skip-mp3
    skip the mp3 transform and keep downloaded file as video.
    ffmpeg is not required in this case.
--help
    print this help message.
`.trim();
