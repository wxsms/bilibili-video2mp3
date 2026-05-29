import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';

vi.mock('child_process', () => ({
  execFile: vi.fn(),
}));

import { execFile } from 'child_process';
import { flv2mp3 } from '../src/convert/flv2mp3.js';

describe('flv2mp3', () => {
  const originalVersion = process.versions.node;

  afterEach(() => {
    vi.mocked(execFile).mockReset();
  });

  describe('node >= 18', () => {
    beforeEach(() => {
      Object.defineProperty(process.versions, 'node', {
        value: '18.0.0',
        configurable: true,
      });
    });

    it('should call ffmpeg with correct arguments', async () => {
      vi.mocked(execFile).mockImplementation((cmd, args, cb) => cb(null));
      await flv2mp3('test.flv');
      expect(execFile).toHaveBeenCalledTimes(1);
      const [cmd, args] = vi.mocked(execFile).mock.calls[0];
      expect(cmd).toBe('ffmpeg');
      expect(args).toContain('-y');
      expect(args).toContain('-i');
      expect(args).toContain('test.flv');
      expect(args).toContain('-q:a');
      expect(args).toContain('0');
      expect(args).toContain('test.mp3');
    });

    it('should include extra ffmpeg options', async () => {
      vi.mocked(execFile).mockImplementation((cmd, args, cb) => cb(null));
      await flv2mp3('test.flv', '-vn -ar 44100');
      const args = vi.mocked(execFile).mock.calls[0][1];
      expect(args).toContain('-vn');
      expect(args).toContain('-ar');
      expect(args).toContain('44100');
    });

    it('should reject on ffmpeg error', async () => {
      vi.mocked(execFile).mockImplementation((cmd, args, cb) =>
        cb(new Error('ffmpeg failed')),
      );
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
      vi.mocked(execFile).mockImplementation((cmd, args, opts, cb) => cb(null));
      await flv2mp3('test.flv', '-vn -ar 44100');
      expect(execFile).toHaveBeenCalledTimes(1);
      const [cmd, args] = vi.mocked(execFile).mock.calls[0];
      expect(cmd).toBe('node');
      expect(args[0]).toContain('_flv2mp3.js');
      expect(args).toContain('test.flv');
      expect(args).toContain('-vn -ar 44100');
    });

    it('should reject on child process error', async () => {
      vi.mocked(execFile).mockImplementation((cmd, args, opts, cb) =>
        cb(new Error('child failed')),
      );
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
