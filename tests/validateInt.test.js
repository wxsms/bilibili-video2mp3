import { describe, it, expect } from 'vitest';
import { InvalidArgumentError } from 'commander';

// Replicate validateInt from index.js (it's not exported, and
// importing index.js triggers CLI side effects)
function validateInt(value) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

describe('validateInt', () => {
  it('should parse a valid integer string', () => {
    expect(validateInt('10')).toBe(10);
  });

  it('should parse zero', () => {
    expect(validateInt('0')).toBe(0);
  });

  it('should parse negative numbers', () => {
    expect(validateInt('-5')).toBe(-5);
  });

  it('should truncate decimal part', () => {
    expect(validateInt('3.9')).toBe(3);
  });

  it('should throw for non-numeric string', () => {
    expect(() => validateInt('abc')).toThrow(InvalidArgumentError);
    expect(() => validateInt('abc')).toThrow('Not a number.');
  });

  it('should throw for empty string', () => {
    expect(() => validateInt('')).toThrow(InvalidArgumentError);
  });
});
