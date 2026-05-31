import * as p from '@clack/prompts';
import { createRequire } from 'module';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { fetchPages } from './bilibili/fetchPages.js';
import { runDownload } from './download/runDownload.js';
import { validateInt } from './utils/validateInt.js';
import { checkFfmpeg } from './utils/checkFfmpeg.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export async function interactive() {
  p.intro(`🎵 bv2mp3 v${pkg.version}`);

  // Check ffmpeg installation
  const ffmpegOk = await checkFfmpeg();
  if (ffmpegOk) {
    p.log.success('✅ 已检测到 ffmpeg');
  } else {
    p.note(
      [
        '⚠️  未检测到 ffmpeg，MP3 转换将不可用。',
        '',
        '请先安装 ffmpeg：',
        '  🪟 Windows:  winget install ffmpeg',
        '  🍎 macOS:    brew install ffmpeg',
        '  🐧 Linux:    sudo apt install ffmpeg',
        '',
        '或访问 https://ffmpeg.org/ 下载',
      ].join('\n'),
      '❌ ffmpeg 未安装',
    );
    const goOn = await p.confirm({
      message: '不转换 MP3，仅下载视频文件，继续？',
      initialValue: false,
    });
    if (p.isCancel(goOn) || !goOn) {
      p.cancel('已取消');
      process.exit(0);
    }
  }

  // Step 1: Input URLs (one per prompt, empty to finish)
  const BILIBILI_URL_RE = /^https?:\/\/(www\.)?bilibili\.com\/video\//;
  const urls = [];

  const firstUrl = await p.text({
    message: '🔗 请输入想要下载的 bilibili 视频链接',
    placeholder: 'https://www.bilibili.com/video/BV...',
    validate: (v) => {
      if (!v?.trim()) return '请输入一个有效的 bilibili 视频 URL';
      if (!BILIBILI_URL_RE.test(v.trim()))
        return 'URL 格式不正确，需为 bilibili.com/video/ 链接';
    },
  });
  if (p.isCancel(firstUrl)) {
    p.cancel('已取消');
    process.exit(0);
  }
  urls.push(firstUrl.trim());

  while (true) {
    const nextUrl = await p.text({
      message: '🔗 可以输入更多视频链接，或直接回车结束',
      placeholder: '回车结束',
      validate: (v) => {
        if (v?.trim() && !BILIBILI_URL_RE.test(v.trim()))
          return 'URL 格式不正确，需为 bilibili.com/video/ 链接';
      },
    });
    if (p.isCancel(nextUrl)) {
      p.cancel('已取消');
      process.exit(0);
    }
    if (!nextUrl.trim()) break;
    urls.push(nextUrl.trim());
  }

  // Step 2: Fetch video info
  const s = p.spinner();
  s.start('📡 正在获取视频信息...');
  let pages;
  try {
    pages = await fetchPages(urls);
    s.stop(`📺 共找到 ${pages.length} 个分集`);
  } catch (err) {
    s.stop('❌ 获取视频信息失败');
    p.cancel(err.message);
    process.exit(1);
  }

  // Step 3: Select episodes
  if (pages.length > 1) {
    const selected = await p.multiselect({
      message: '📋 选择要下载的分集（空格切换，回车确认）',
      options: pages.map((page) => ({
        value: page.index,
        label: `${page.index}. ${page.title}`,
      })),
      initialValues: pages.map((page) => page.index),
      required: true,
    });
    if (p.isCancel(selected)) {
      p.cancel('已取消');
      process.exit(0);
    }
    const selectedSet = new Set(selected);
    pages = pages.filter((page) => selectedSet.has(page.index));
    // Re-index after filtering
    pages = pages.map((page, i) => ({ ...page, index: i + 1 }));
  }

  // Step 4: Confirm with defaults, allow editing
  let convertMp3 = ffmpegOk;
  let outputDir = resolve(process.cwd());
  let naming = 'TITLE-AUTHOR-DATE';
  let threads = 10;
  let debug = false;

  while (true) {
    p.note(
      [
        `📁 下载目录: ${outputDir}`,
        `📺 分集数: ${pages.length}`,
        `🎵 转 MP3: ${convertMp3 ? '是' : '否'}`,
        `📝 命名规则: ${naming}`,
        `⚡ 线程数: ${threads}`,
        debug ? `🐛 调试模式: 开启` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      '✅ 确认下载信息',
    );

    const action = await p.select({
      message: '请确认',
      options: [
        { value: 'download', label: '🚀 确认下载' },
        { value: 'outputDir', label: `📁 下载目录: ${outputDir}` },
        {
          value: 'mp3',
          label: `🎵 转 MP3: ${convertMp3 ? '是' : '否'}`,
        },
        { value: 'naming', label: `📝 命名规则: ${naming}` },
        { value: 'threads', label: `⚡ 线程数: ${threads}` },
        {
          value: 'debug',
          label: `🐛 调试模式: ${debug ? '开启' : '关闭'}`,
        },
      ],
    });
    if (p.isCancel(action)) {
      p.cancel('已取消');
      process.exit(0);
    }

    if (action === 'download') break;

    if (action === 'outputDir') {
      const v = await p.text({
        message: '📁 下载目录',
        initialValue: outputDir,
      });
      if (!p.isCancel(v) && v.trim()) outputDir = resolve(v.trim());
    } else if (action === 'mp3') {
      const v = await p.confirm({
        message: '🎵 是否转换为 MP3？',
        initialValue: convertMp3,
      });
      if (!p.isCancel(v)) convertMp3 = v;
    } else if (action === 'naming') {
      const v = await p.text({
        message: '📝 文件命名规则（可用: INDEX, TITLE, AUTHOR, DATE）',
        initialValue: naming,
      });
      if (!p.isCancel(v) && v.trim()) naming = v.trim();
    } else if (action === 'threads') {
      const v = await p.text({
        message: '⚡ 下载线程数',
        initialValue: String(threads),
      });
      if (!p.isCancel(v)) {
        const n = validateInt(v);
        if (n) threads = n;
      }
    } else if (action === 'debug') {
      const v = await p.confirm({
        message: '🐛 调试模式',
        initialValue: debug,
      });
      if (!p.isCancel(v)) debug = v;
    }
  }

  p.outro('🚀 开始下载...');

  mkdirSync(outputDir, { recursive: true });
  process.chdir(outputDir);
  await runDownload({
    pages,
    threads,
    naming,
    ffmpeg: '',
    skipMp3: !convertMp3,
    debug,
    indexOffset: 0,
  });
}
