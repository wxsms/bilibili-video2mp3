import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('child_process', () => ({
  execFile: vi.fn(),
}));

import { execFile } from 'child_process';
import { flv2mp3 } from '../src/convert/flv2mp3.js';

describe('flv2mp3', () => {
  afterEach(() => {
    vi.mocked(execFile).mockReset();
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
