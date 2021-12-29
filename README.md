# bilibili-video2mp3

A tool to download all videos and convert to mp3 inside a video set of bilibili.

You will need node.js installed and ffmpeg in system path first.

```
npx bilibili-video2mp3 --url=https://www.bilibili.com/video/BV1yZ4y1X7v3?p=1
```

output sample:

```
# ......
北戴河之歌-yousa-2021-12-26.flv: 90.00%
口袋的天空-yousa-2021-12-26.flv: 90.00%
日出日落-yousa-2021-12-26.mp3 converted
知否知否-yousa-2021-12-26.flv: 90.00%
小小-yousa-2021-12-26.flv: 100.00%
小小-yousa-2021-12-26.flv: download finished
北戴河之歌-yousa-2021-12-26.flv: 100.00%
北戴河之歌-yousa-2021-12-26.flv: download finished
口袋的天空-yousa-2021-12-26.flv: 100.00%
口袋的天空-yousa-2021-12-26.flv: download finished
小小-yousa-2021-12-26.mp3 converted
北戴河之歌-yousa-2021-12-26.mp3 converted
口袋的天空-yousa-2021-12-26.mp3 converted
知否知否-yousa-2021-12-26.flv: 100.00%
知否知否-yousa-2021-12-26.flv: download finished
知否知否-yousa-2021-12-26.mp3 converted
```

options:

```
--url
    required. the video set url of bilibili. the p=1 doesn't matter.
--author
    optional. file downloaded as title-author-date.mp3, default to 'yousa'.
```