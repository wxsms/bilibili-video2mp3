# bilibili-video2mp3

A tool to download all videos and convert to mp3 inside a video set of bilibili (also works for single video, of course).

You will need node.js (recommended 16+) installed.

```bash
# options document
npx bv2mp3 --help

# download from a video set
npx bv2mp3 --url=https://www.bilibili.com/video/BV1yZ4y1X7v3

# download from multiple video set
npx bv2mp3 --url=A --url=B

# download with custom file name
npx bv2mp3 --naming=INDEX-TITLE-yousa-DATE --url=A --url=B
```

Enjoy!

## Caveats

We used to use [@ffmpeg/ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) for video converting, which does not require ffmpeg installed from operating system. However, it does not support Node.js 18+.

Therefore, if you're using Node.js 18+, this lib will switch to os ffmpeg installation automatically, make sure it's in your path! visit [their website](https://ffmpeg.org/) for installation instruction.

## License

MIT