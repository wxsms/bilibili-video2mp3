# bilibili-video2mp3

A tool to download all videos and convert to mp3 inside a video set of bilibili (also works for single video, of course).

You will need node.js installed and ffmpeg in system path first.

```
npx bilibili-video2mp3 --url=https://www.bilibili.com/video/BV1yZ4y1X7v3
```

output sample:

```
downloading [================              ] 52% 36.3s 海蓝色-yousa-2021-12-26.flv
downloading [===============               ] 48% 43.0s 元气女孩-yousa-2021-12-26.flv
downloading [===============               ] 51% 38.5s 安稳最好啦-yousa-2021-12-26.flv
downloading [===========                   ] 37% 66.4s 小小-yousa-2021-12-26.flv
downloading [===========                   ] 37% 68.3s 北戴河之歌-yousa-2021-12-26.flv
downloading [===========                   ] 37% 68.5s 口袋的天空-yousa-2021-12-26.flv
downloading [============                  ] 41% 57.4s 日出日落-yousa-2021-12-26.flv
downloading [==========                    ] 34% 78.3s 知否知否-yousa-2021-12-26.flv
```

options:

```
--url
    required. the video set (or single) url of bilibili.
    can be multi url split by comma (,).
--author
    optional. file downloaded as title-author-date.mp3, default to up's name.
```
