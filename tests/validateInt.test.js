import { describe, it, expect } from 'vitest';
import { InvalidArgumentError } from 'commander';
import { validateInt } from '../src/utils/validateInt.js';

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
