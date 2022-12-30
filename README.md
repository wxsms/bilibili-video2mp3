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

# Local
npm install

node --no-experimental-fetch index.js --url=xxx

## License

MIT
