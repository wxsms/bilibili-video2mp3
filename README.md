# bilibili-video2mp3

[![CI](https://github.com/wxsms/bilibili-video2mp3/actions/workflows/main.yml/badge.svg)](https://github.com/wxsms/bilibili-video2mp3/actions/workflows/main.yml)
[![Coverage](https://codecov.io/gh/wxsms/bilibili-video2mp3/branch/master/graph/badge.svg)](https://codecov.io/gh/wxsms/bilibili-video2mp3)

下载哔哩哔哩视频合集并转换为 MP3 的命令行工具（单个视频也适用）。

需要 Node.js 20+ 环境，系统需安装 [ffmpeg](https://ffmpeg.org/) 并确保在 PATH 中可访问。

## 使用方式

### 交互模式（推荐）

直接运行命令，按步骤操作即可：

```bash
npx bv2mp3
```

流程：输入视频链接 → 选择分集 → 确认下载

确认时会展示默认设置（转 MP3、命名规则、线程数等），如需修改选择对应项即可，无需修改直接确认开始下载。

### 命令行模式

```bash
# 查看帮助
npx bv2mp3 --help

# 下载视频合集
npx bv2mp3 --url=https://www.bilibili.com/video/BV1yZ4y1X7v3

# 下载多个视频
npx bv2mp3 --url=A --url=B

# 自定义文件命名
npx bv2mp3 --naming=INDEX-TITLE-yousa-DATE --url=A --url=B
```

## License

MIT
