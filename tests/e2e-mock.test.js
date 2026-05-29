/**
 * Mock-based e2e tests.
 *
 * These tests spawn the real CLI process (`node src/index.js`) with the
 * `--import` flag to inject a mock layer that intercepts bilibili API calls
 * and skips actual download + conversion. This allows testing the full CLI
 * pipeline (page resolution → playUrl retrieval → download task → conversion)
 * without network access.
 *
 * The mock fixtures are real bilibili API responses captured from:
 *   https://www.bilibili.com/video/BV1yZ4y1X7v3 (8-page video)
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { spawn } from 'child_process';
import { readdir, mkdir, rm } from 'fs/promises';
import { resolve as pathResolve } from 'path';
import { pathToFileURL } from 'url';

const ROOT = pathResolve(import.meta.dirname, '..');
const OUTPUT = pathResolve(ROOT, 'e2e-mock-output');
const CLI = pathResolve(ROOT, 'src/index.js');
const MOCK_SERVER = pathToFileURL(
  pathResolve(ROOT, 'tests/fixtures/mock-server.mjs'),
).href;
const URL = 'https://www.bilibili.com/video/BV1yZ4y1X7v3';

function runCli(args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['--import', MOCK_SERVER, CLI, ...args], {
      cwd,
      env: {
        ...process.env,
        BILIBILI_MOCK_DIR: pathResolve(ROOT, 'tests/fixtures'),
      },
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => (stdout += d.toString()));
    proc.stderr.on('data', (d) => (stderr += d.toString()));
    proc.on('close', (code) => {
      if (code === 0) resolve({ code, stdout, stderr });
      else
        reject(new Error(`CLI exited with code ${code}\n${stderr}\n${stdout}`));
    });
    proc.on('error', reject);
  });
}

async function prepareDir(name) {
  const dir = pathResolve(OUTPUT, name);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  return dir;
}

describe('E2E (mock): CLI', () => {
  beforeAll(async () => {
    await mkdir(OUTPUT, { recursive: true });
  });

  it('should download and convert to mp3', async () => {
    const dir = await prepareDir('mp3');
    const result = await runCli(
      ['--url', URL, '--from', '1', '--to', '1', '--naming', 'INDEX'],
      dir,
    );
    console.log('stdout:', result.stdout);
    console.log('stderr:', result.stderr);

    const files = await readdir(dir);
    const mp3Files = files.filter((f) => f.endsWith('.mp3'));
    expect(mp3Files.length).toBeGreaterThanOrEqual(1);
  }, 20000);

  it('should download only with --skip-mp3', async () => {
    const dir = await prepareDir('skip-mp3');
    const result = await runCli(
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
    console.log('stdout:', result.stdout);
    console.log('stderr:', result.stderr);

    const files = await readdir(dir);
    const flvFiles = files.filter((f) => f.endsWith('.flv'));
    expect(flvFiles.length).toBeGreaterThanOrEqual(1);
    const mp3Files = files.filter((f) => f.endsWith('.mp3'));
    expect(mp3Files.length).toBe(0);
  }, 20000);

  it('should download multiple pages', async () => {
    const dir = await prepareDir('multi-page');
    const result = await runCli(
      ['--url', URL, '--from', '1', '--to', '3', '--naming', 'INDEX'],
      dir,
    );
    console.log('stdout:', result.stdout);
    console.log('stderr:', result.stderr);

    const files = await readdir(dir);
    const mp3Files = files.filter((f) => f.endsWith('.mp3'));
    expect(mp3Files.length).toBe(3);
  }, 20000);
});
