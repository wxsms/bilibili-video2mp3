import { describe, it, expect, beforeAll } from 'vitest';
import { spawn } from 'child_process';
import { readdir, mkdir, rm } from 'fs/promises';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const OUTPUT = resolve(ROOT, 'e2e-output');
const CLI = resolve(ROOT, 'index.js');
const URL = 'https://www.bilibili.com/video/BV1yZ4y1X7v3';

function runCli(args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [CLI, ...args], { cwd });
    let stderr = '';
    proc.stderr.on('data', (d) => (stderr += d.toString()));
    proc.on('close', (code) => {
      if (code === 0) resolve({ code, stderr });
      else reject(new Error(`CLI exited with code ${code}\n${stderr}`));
    });
    proc.on('error', reject);
  });
}

async function prepareDir(name) {
  const dir = resolve(OUTPUT, name);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  return dir;
}

describe('E2E: CLI', () => {
  beforeAll(async () => {
    await mkdir(OUTPUT, { recursive: true });
  });

  it('should download and convert to mp3', { timeout: 120000 }, async () => {
    const dir = await prepareDir('mp3');
    await runCli(
      ['--url', URL, '--from', '1', '--to', '1', '--naming', 'INDEX'],
      dir,
    );

    const files = await readdir(dir);
    const mp3Files = files.filter((f) => f.endsWith('.mp3'));
    expect(mp3Files.length).toBeGreaterThanOrEqual(1);
  });

  it('should download only with --skip-mp3', { timeout: 120000 }, async () => {
    const dir = await prepareDir('skip-mp3');
    await runCli(
      [
        '--url',
        URL,
        '--from',
        '1',
        '--to',
        '1',
        '--skip-mp3',
        '--naming',
        'INDEX',
      ],
      dir,
    );

    const files = await readdir(dir);
    const flvFiles = files.filter((f) => f.endsWith('.flv'));
    expect(flvFiles.length).toBeGreaterThanOrEqual(1);
  });

  it('should download multiple pages', { timeout: 120000 }, async () => {
    const dir = await prepareDir('multi-page');
    await runCli(
      ['--url', URL, '--from', '1', '--to', '3', '--naming', 'INDEX'],
      dir,
    );

    const files = await readdir(dir);
    const mp3Files = files.filter((f) => f.endsWith('.mp3'));
    expect(mp3Files.length).toBe(3);
  });
});
