import { describe, it, expect } from 'vitest';

import { getName } from '../src/naming.js';

describe('getName', () => {
  it('should replace TITLE, AUTHOR, DATE with values', () => {
    const result = getName(
      1,
      'MySong',
      'Artist',
      '2024-01-01',
      'TITLE-AUTHOR-DATE',
    );
    expect(result).toBe('MySong-Artist-2024-01-01');
  });

  it('should replace INDEX with the given index', () => {
    const result = getName(3, 'Song', 'Artist', '2024-01-01', 'INDEX-TITLE');
    expect(result).toBe('3-Song');
  });

  it('should support INDEX-only pattern', () => {
    const result = getName(5, 'Song', 'Artist', '2024-01-01', 'INDEX');
    expect(result).toBe('5');
  });

  it('should strip leading dashes from result', () => {
    const result = getName(1, '', 'Artist', '2024-01-01', 'TITLE-AUTHOR-DATE');
    // empty TITLE => "-Artist-2024-01-01" => stripped to "Artist-2024-01-01"
    expect(result).toBe('Artist-2024-01-01');
  });

  it('should strip multiple leading dashes', () => {
    const result = getName(1, '', '', '2024-01-01', 'TITLE-AUTHOR-DATE');
    expect(result).toBe('2024-01-01');
  });

  it('should return empty string if all parts are empty after stripping', () => {
    const result = getName(1, '', '', '', 'TITLE-AUTHOR-DATE');
    expect(result).toBe('');
  });

  it('should not double-replace when a value contains a placeholder keyword', () => {
    // If TITLE is "INDEX-3", sequential .replace would turn "INDEX-INDEX-3" into "3-3"
    // Single-pass replacement should produce "3-INDEX-3"
    const result = getName(3, 'INDEX-3', 'Author', '2024-01-01', 'INDEX-TITLE');
    expect(result).toBe('3-INDEX-3');
  });
});
