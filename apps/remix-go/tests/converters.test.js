import { describe, it, expect } from 'vitest';

import {
  toFloat, toInt, secondsToTime, timeToSeconds, truncate, slugify
} from '../src/lib/converters.js';

describe('converters', () => {
  describe('toFloat', () => {
    it('converts to float', () => {
      expect(toFloat('3.14')).toBe(3.14);
      expect(toFloat('42')).toBe(42);
    });
  });

  describe('toInt', () => {
    it('converts to int', () => {
      expect(toInt('42')).toBe(42);
      expect(toInt('3.14')).toBe(3);
    });
  });

  describe('secondsToTime', () => {
    it('formats minutes:seconds', () => {
      expect(secondsToTime(65)).toBe('1:05');
      expect(secondsToTime(0)).toBe('0:00');
      expect(secondsToTime(125)).toBe('2:05');
    });
    it('formats hours:minutes:seconds', () => {
      expect(secondsToTime(3661)).toBe('1:01:01');
    });
  });

  describe('timeToSeconds', () => {
    it('parses mm:ss', () => {
      expect(timeToSeconds('1:30')).toBe(90);
    });
    it('parses hh:mm:ss', () => {
      expect(timeToSeconds('1:01:01')).toBe(3661);
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('hello world', 8)).toBe('hello...');
    });
    it('passes through short strings', () => {
      expect(truncate('hi', 10)).toBe('hi');
    });
  });

  describe('slugify', () => {
    it('creates URL-safe slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('  My Cool Video  ')).toBe('my-cool-video');
    });
  });
});
