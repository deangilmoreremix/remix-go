import { describe, it, expect } from 'vitest';

import {
  isEmail, isRequired, isNumber, isURL,
  isMinLength, isMaxLength, isPositive, validate,
  isValidEmail, isNonEmpty
} from '../src/lib/validators.js';

describe('validators', () => {
  describe('isEmail', () => {
    it('accepts valid emails', () => {
      expect(isEmail('user@example.com')).toBeNull();
      expect(isEmail('test+tag@domain.co')).toBeNull();
    });
    it('rejects invalid emails', () => {
      expect(isEmail('not-an-email')).toBeTruthy();
      expect(isEmail('@missing.com')).toBeTruthy();
      expect(isEmail('user@')).toBeTruthy();
    });
  });

  describe('isRequired', () => {
    it('accepts non-empty values', () => {
      expect(isRequired('hello')).toBeNull();
      expect(isRequired(0)).toBeNull();
      expect(isRequired(42)).toBeNull();
    });
    it('rejects empty values', () => {
      expect(isRequired('')).toBeTruthy();
      expect(isRequired(null)).toBeTruthy();
      expect(isRequired(undefined)).toBeTruthy();
      expect(isRequired('   ')).toBeTruthy();
    });
  });

  describe('isNumber', () => {
    it('accepts numbers', () => {
      expect(isNumber('42')).toBeNull();
      expect(isNumber('3.14')).toBeNull();
      expect(isNumber('-1')).toBeNull();
    });
    it('rejects non-numbers', () => {
      expect(isNumber('abc')).toBeTruthy();
      expect(isNumber('')).toBeTruthy();
    });
  });

  describe('isURL', () => {
    it('accepts valid URLs', () => {
      expect(isURL('https://example.com')).toBeNull();
      expect(isURL('http://localhost:3000')).toBeNull();
    });
    it('rejects invalid URLs', () => {
      expect(isURL('not-a-url')).toBeTruthy();
      expect(isURL('')).toBeTruthy();
    });
  });

  describe('isMinLength', () => {
    it('checks minimum length', () => {
      expect(isMinLength(3)('hello')).toBeNull();
      expect(isMinLength(3)('hi')).toBeTruthy();
      expect(isMinLength(3)('')).toBeTruthy();
    });
  });

  describe('isMaxLength', () => {
    it('checks maximum length', () => {
      expect(isMaxLength(5)('hello')).toBeNull();
      expect(isMaxLength(5)('hello world')).toBeTruthy();
      expect(isMaxLength(5)('')).toBeNull();
    });
  });

  describe('isPositive', () => {
    it('checks positive numbers', () => {
      expect(isPositive('5')).toBeNull();
      expect(isPositive('0.1')).toBeNull();
      expect(isPositive('0')).toBeTruthy();
      expect(isPositive('-1')).toBeTruthy();
    });
  });

  describe('validate', () => {
    it('returns first error', () => {
      const err = validate('', [isRequired, isEmail]);
      expect(err).toBeTruthy();
      expect(typeof err).toBe('string');
    });
    it('returns null when all pass', () => {
      const err = validate('user@example.com', [isRequired, isEmail]);
      expect(err).toBeNull();
    });
  });

  describe('isValidEmail', () => {
    it('returns boolean', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('bad')).toBe(false);
    });
  });

  describe('isNonEmpty', () => {
    it('returns boolean', () => {
      expect(isNonEmpty('hello')).toBe(true);
      expect(isNonEmpty('')).toBe(false);
      expect(isNonEmpty(null)).toBe(false);
    });
  });
});
