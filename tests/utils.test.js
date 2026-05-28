import { describe, it, expect, vi } from 'vitest';
import { sleep } from '../src/utils.js';

describe('sleep', () => {
  it('should resolve after the given time', async () => {
    vi.useFakeTimers();
    const promise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it('should not resolve before the given time', async () => {
    vi.useFakeTimers();
    const promise = sleep(1000);
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });
    vi.advanceTimersByTime(500);
    await Promise.resolve(); // flush microtask queue
    expect(resolved).toBe(false);
    vi.advanceTimersByTime(500);
    await promise;
    expect(resolved).toBe(true);
    vi.useRealTimers();
  });

  it('should work with zero delay', async () => {
    vi.useFakeTimers();
    const promise = sleep(0);
    vi.advanceTimersByTime(0);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});
