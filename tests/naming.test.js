import { describe, it, expect, vi } from 'vitest';

// We need to mock before importing, with a mutable naming so we can change it per test
let namingPattern = 'TITLE-AUTHOR-DATE';

vi.mock('commander', () => ({
  program: {
    opts: () => ({ naming: namingPattern }),
  },
}));

import { getName } from '../src/naming.js';

describe('getName', () => {
  it('should replace TITLE, AUTHOR, DATE with values', () => {
    namingPattern = 'TITLE-AUTHOR-DATE';
    const result = getName(1, 'MySong', 'Artist', '2024-01-01');
    expect(result).toBe('MySong-Artist-2024-01-01');
  });

  it('should replace INDEX with the given index', () => {
    namingPattern = 'INDEX-TITLE';
    const result = getName(3, 'Song', 'Artist', '2024-01-01');
    expect(result).toBe('3-Song');
  });

  it('should support INDEX-only pattern', () => {
    namingPattern = 'INDEX';
    const result = getName(5, 'Song', 'Artist', '2024-01-01');
    expect(result).toBe('5');
  });

  it('should strip leading dashes from result', () => {
    namingPattern = 'TITLE-AUTHOR-DATE';
    const result = getName(1, '', 'Artist', '2024-01-01');
    // empty TITLE => "-Artist-2024-01-01" => stripped to "Artist-2024-01-01"
    expect(result).toBe('Artist-2024-01-01');
  });

  it('should strip multiple leading dashes', () => {
    namingPattern = 'TITLE-AUTHOR-DATE';
    const result = getName(1, '', '', '2024-01-01');
    expect(result).toBe('2024-01-01');
  });

  it('should return empty string if all parts are empty after stripping', () => {
    namingPattern = 'TITLE-AUTHOR-DATE';
    const result = getName(1, '', '', '');
    expect(result).toBe('');
  });
});
