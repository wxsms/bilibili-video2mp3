import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';

vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

vi.mock('commander', () => ({
  program: {
    opts: () => ({ ffmpeg: '-vn -ar 44100' }),
  },
}));

import { exec } from 'child_process';
import { flv2mp3 } from '../src/flv2mp3.js';

describe('flv2mp3', () => {
  const originalVersion = process.versions.node;

  afterEach(() => {
    vi.mocked(exec).mockReset();
  });

  describe('node >= 18', () => {
    beforeEach(() => {
      Object.defineProperty(process.versions, 'node', {
        value: '18.0.0',
        configurable: true,
      });
    });

    it('should call ffmpeg with correct arguments', async () => {
      vi.mocked(exec).mockImplementation((cmd, cb) => cb(null));
      await flv2mp3('test.flv');
      expect(exec).toHaveBeenCalledTimes(1);
      const cmd = vi.mocked(exec).mock.calls[0][0];
      expect(cmd).toContain('ffmpeg');
      expect(cmd).toContain('-i "test.flv"');
      expect(cmd).toContain('"test.mp3"');
      expect(cmd).toContain('-q:a 0');
    });

    it('should include extra ffmpeg options from argv', async () => {
      vi.mocked(exec).mockImplementation((cmd, cb) => cb(null));
      await flv2mp3('test.flv');
      const cmd = vi.mocked(exec).mock.calls[0][0];
      expect(cmd).toContain('-vn');
      expect(cmd).toContain('-ar');
      expect(cmd).toContain('44100');
    });

    it('should reject on ffmpeg error', async () => {
      vi.mocked(exec).mockImplementation((cmd, cb) => cb(new Error('ffmpeg failed')));
      await expect(flv2mp3('test.flv')).rejects.toThrow('ffmpeg failed');
    });
  });

  describe('node < 18', () => {
    beforeEach(() => {
      Object.defineProperty(process.versions, 'node', {
        value: '16.0.0',
        configurable: true,
      });
    });

    it('should spawn _flv2mp3.js child process', async () => {
      vi.mocked(exec).mockImplementation((cmd, opts, cb) => cb(null));
      await flv2mp3('test.flv');
      expect(exec).toHaveBeenCalledTimes(1);
      const cmd = vi.mocked(exec).mock.calls[0][0];
      expect(cmd).toContain('_flv2mp3.js');
      expect(cmd).toContain('"test.flv"');
    });

    it('should reject on child process error', async () => {
      vi.mocked(exec).mockImplementation((cmd, opts, cb) => cb(new Error('child failed')));
      await expect(flv2mp3('test.flv')).rejects.toThrow('child failed');
    });
  });

  afterAll(() => {
    Object.defineProperty(process.versions, 'node', {
      value: originalVersion,
      configurable: true,
    });
  });
});
