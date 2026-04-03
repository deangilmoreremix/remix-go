import { describe, it, expect } from 'vitest';

import {
  extractTokens, extractTokenDetails, getAvailableTokens, formatToken
} from '../src/lib/tokenExtractor.js';

describe('tokenExtractor', () => {
  describe('extractTokens', () => {
    it('extracts plain tokens', () => {
      const tokens = extractTokens('Hello {{FIRSTNAME}}, welcome to {{GEOCITY}}!');
      expect(tokens).toContain('FIRSTNAME');
      expect(tokens).toContain('GEOCITY');
    });

    it('extracts uppercase tokens', () => {
      const tokens = extractTokens('{{up FIRSTNAME}}');
      expect(tokens).toContain('FIRSTNAME');
    });

    it('extracts fallback tokens', () => {
      const tokens = extractTokens('{{d EMAIL "none"}}');
      expect(tokens).toContain('EMAIL');
    });

    it('scans nested objects', () => {
      const tokens = extractTokens({
        text: '{{NAME}}',
        nested: { content: '{{COMPANY}}' },
      });
      expect(tokens).toContain('NAME');
      expect(tokens).toContain('COMPANY');
    });

    it('returns empty for no tokens', () => {
      expect(extractTokens('no tokens here')).toEqual([]);
      expect(extractTokens(null)).toEqual([]);
    });
  });

  describe('formatToken', () => {
    it('formats plain token', () => {
      expect(formatToken('FIRSTNAME')).toBe('{{FIRSTNAME}}');
    });
    it('formats uppercase token', () => {
      expect(formatToken('FIRSTNAME', 'uppercase')).toBe('{{up FIRSTNAME}}');
    });
    it('formats fallback token', () => {
      expect(formatToken('FIRSTNAME', 'fallback', 'Friend')).toBe('{{d FIRSTNAME "Friend"}}');
    });
  });

  describe('getAvailableTokens', () => {
    it('returns array of tokens', () => {
      const tokens = getAvailableTokens();
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0]).toHaveProperty('key');
      expect(tokens[0]).toHaveProperty('label');
    });
  });
});
