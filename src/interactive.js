import * as p from '@clack/prompts';
import { createRequire } from 'module';
import { fetchPages } from './bilibili/fetchPages.js';
import { runDownload } from './download/runDownload.js';
import { validateInt } from './utils/validateInt.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export async function interactive() {
  p.intro(`bv2mp3 v${pkg.version}`);

  // Step 1: Input URLs
  const urlInput = await p.text({
    message: '请输入 bilibili 视频 URL（多个用逗号分隔）',
    placeholder: 'https://www.bilibili.com/video/BV...',
  });
  if (p.isCancel(urlInput)) {
    p.cancel('已取消');
    process.exit(0);
  }
  const urls = urlInput
    .split(/[,，\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (urls.length === 0) {
    p.cancel('未输入有效 URL');
    process.exit(1);
  }

  // Step 2: Fetch video info
  const s = p.spinner();
  s.start('正在获取视频信息...');
  let pages;
  try {
    pages = await fetchPages(urls);
    s.stop(`共找到 ${pages.length} 个分集`);
  } catch (err) {
    s.stop('获取视频信息失败');
    p.cancel(err.message);
    process.exit(1);
  }

  // Step 3: Select episodes
  if (pages.length > 1) {
    const selected = await p.multiselect({
      message: '选择要下载的分集（空格切换，回车确认）',
      options: pages.map((page) => ({
        value: page.index,
        label: `${page.index}. ${page.title}`,
      })),
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

  // Step 4: Convert to MP3?
  const convertMp3 = await p.confirm({
    message: '是否转换为 MP3？',
    initialValue: true,
  });
  if (p.isCancel(convertMp3)) {
    p.cancel('已取消');
    process.exit(0);
  }

  // Step 5: Naming pattern
  const naming = await p.text({
    message: '文件命名规则（可用: INDEX, TITLE, AUTHOR, DATE）',
    placeholder: 'TITLE-AUTHOR-DATE',
    initialValue: 'TITLE-AUTHOR-DATE',
  });
  if (p.isCancel(naming)) {
    p.cancel('已取消');
    process.exit(0);
  }

  // Step 6: Additional options
  const extras = await p.multiselect({
    message: '附加选项',
    options: [{ value: 'debug', label: '调试模式' }],
    required: false,
  });
  if (p.isCancel(extras)) {
    p.cancel('已取消');
    process.exit(0);
  }
  const debug = extras.includes('debug');

  // Step 7: Thread count
  const threadsInput = await p.text({
    message: '下载线程数',
    placeholder: '10',
    initialValue: '10',
  });
  if (p.isCancel(threadsInput)) {
    p.cancel('已取消');
    process.exit(0);
  }
  const threads = validateInt(threadsInput) || 10;

  // Step 8: Summary & confirm
  p.note(
    [
      `分集数: ${pages.length}`,
      `转 MP3: ${convertMp3 ? '是' : '否'}`,
      `命名规则: ${naming}`,
      `线程数: ${threads}`,
      debug ? `调试模式: 开启` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    '确认下载信息',
  );

  const confirmed = await p.confirm({
    message: `准备下载 ${pages.length} 个分集，确认？`,
    initialValue: true,
  });
  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel('已取消');
    process.exit(0);
  }

  p.outro('开始下载...');

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
