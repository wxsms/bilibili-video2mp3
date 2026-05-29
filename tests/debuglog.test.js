import { describe, it, expect, vi, afterEach } from 'vitest';
import { join } from 'path';

vi.mock('fs', () => {
  const appendFileSync = vi.fn();
  return {
    default: { appendFileSync },
    appendFileSync,
  };
});

import fs from 'fs';
import { debuglog } from '../src/debuglog.js';

describe('debuglog', () => {
  afterEach(() => {
    fs.appendFileSync.mockClear();
  });

  it('should write data to bilibili-video2mp3-error.log', () => {
    debuglog('test error message');
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      join(process.cwd(), 'bilibili-video2mp3-error.log'),
      'test error message\n',
    );
  });

  it('should convert non-string data to string before writing', () => {
    debuglog(new Error('oops'));
    expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
    const written = fs.appendFileSync.mock.calls[0][1];
    expect(written).toContain('Error: oops');
    expect(written).toMatch(/\n$/);
  });

  it('should append newline to the data', () => {
    debuglog('no newline');
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.any(String),
      'no newline\n',
    );
  });
});
