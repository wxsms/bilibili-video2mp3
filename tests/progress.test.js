import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@clack/prompts', () => ({
  progress: vi.fn(() => ({
    start: vi.fn(),
    advance: vi.fn(),
    stop: vi.fn(),
  })),
}));

import {
  startProgress,
  advanceProgress,
  stopProgress,
} from '../src/download/progress.js';
import { progress as clackProgress } from '@clack/prompts';

describe('progress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a progress bar with total and size', () => {
    startProgress(33);
    expect(clackProgress).toHaveBeenCalledWith({ max: 33, size: 30 });
  });

  it('should start the progress bar', () => {
    startProgress(10);
    const bar = clackProgress.mock.results[0].value;
    expect(bar.start).toHaveBeenCalled();
  });

  it('should advance the progress bar with a message', () => {
    startProgress(10);
    advanceProgress('3/10');
    const bar = clackProgress.mock.results[0].value;
    expect(bar.advance).toHaveBeenCalledWith(1, '3/10');
  });

  it('should stop the progress bar', () => {
    startProgress(10);
    stopProgress();
    const bar = clackProgress.mock.results[0].value;
    expect(bar.stop).toHaveBeenCalled();
  });
});
