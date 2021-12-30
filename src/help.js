export const help = `
--url
    required. the video set (or single) url of bilibili.
    multiple url is ok, for example:
    npx bilibili-video2mp3 --url=a --url=b --url=c
--author
    optional. file downloaded as title-author-date.mp3, default to up's name.
--skip-mp3
    skip the mp3 transform and keep downloaded file as video.
    ffmpeg is not required in this case.
--help
    print this help message.
--version
    print version.
`.trim();
