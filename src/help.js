export const help = `
--url
    required. the video set (or single) url of bilibili.
    multiple url is ok, for example:
    npx bilibili-video2mp3 --url=a --url=b --url=c
--from
    optional, limit to page download from, 1-based.
--to
    optional, limit to page download to, 1-based.
--threads
    optional, how many download threads. default to 5.
--author
    optional. file downloaded as TITLE-AUTHOR-DATE.mp3, default to up's name.
--naming
    optional. change the downloaded files' naming pattern. default to TITLE-AUTHOR-DATE.
    available: INDEX, TITLE, AUTHOR, DATE
--index-offset
    offset added to INDEX while saved.
--skip-mp3
    skip the mp3 transform and keep downloaded file as video.
    ffmpeg is not required in this case.
--help
    print this help message.
--version
    print version.
`.trim();
