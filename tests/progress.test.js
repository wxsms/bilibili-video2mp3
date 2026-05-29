import { describe, it, expect, vi } from 'vitest';

vi.mock('multi-progress', () => {
  const newBar = vi.fn((_fmt, _opts) => ({ tick: vi.fn() }));
  return {
    default: class MockMultiProgress {
      newBar = newBar;
    },
    __newBar: newBar,
  };
});

import { createProgressBar } from '../src/progress.js';
import { __newBar } from 'multi-progress';

describe('createProgressBar', () => {
  it('should create a bar with index, title and total', () => {
    createProgressBar(1, 'MyTitle', 1000);
    expect(__newBar).toHaveBeenCalledTimes(1);
    const [format, opts] = __newBar.mock.calls[0];
    expect(format).toContain('1');
    expect(format).toContain('MyTitle');
    expect(opts.total).toBe(1000);
    expect(opts.complete).toBe('=');
    expect(opts.incomplete).toBe(' ');
    expect(opts.width).toBe(30);
  });

  it('should include :bar, :percent, :etas, :status placeholders', () => {
    createProgressBar(2, 'Another', 500);
    const [format] = __newBar.mock.calls[1];
    expect(format).toContain(':bar');
    expect(format).toContain(':percent');
    expect(format).toContain(':etas');
    expect(format).toContain(':status');
  });
});
