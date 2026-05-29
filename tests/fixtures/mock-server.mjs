/**
 * Mock server for e2e-mock tests.
 *
 * Usage: node --import ./tests/fixtures/mock-server.mjs src/index.js --url ...
 *
 * This file is the entry point for the mock system. It:
 * 1. Reads fixture data (HTML page + playUrl API responses) from BILIBILI_MOCK_DIR
 * 2. Registers a custom ESM loader that intercepts axios, download, and convert modules
 *
 * The custom loader (mock-loader.mjs) replaces:
 * - axios.get: returns fixture data instead of hitting bilibili servers
 * - downloadStream: creates a dummy .flv file instead of downloading
 * - flv2mp3: creates a dummy .mp3 file instead of running ffmpeg
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mockDir = process.env.BILIBILI_MOCK_DIR || __dirname;

register(
  pathToFileURL(resolve(__dirname, 'mock-loader.mjs')),
  import.meta.url,
  {
    data: { mockDir },
  },
);
