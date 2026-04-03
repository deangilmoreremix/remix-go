import { describe, it, expect } from 'vitest';

import {
  replaceTokens, buildPersonalizedURL, buildProviderURL, EMAIL_PROVIDER_TOKENS
} from '../src/lib/tokenReplacer.js';

describe('tokenReplacer', () => {
  describe('replaceTokens', () => {
    it('replaces plain tokens', () => {
      const result = replaceTokens('Hello {{FIRSTNAME}}!', { FIRSTNAME: 'John' });
      expect(result).toBe('Hello John!');
    });

    it('replaces uppercase tokens', () => {
      const result = replaceTokens('{{up CITY}}', { CITY: 'new york' });
      expect(result).toBe('NEW YORK');
    });

    it('replaces fallback tokens with value', () => {
      const result = replaceTokens('{{d NAME "Friend"}}', { NAME: 'John' });
      expect(result).toBe('John');
    });

    it('replaces fallback tokens with default', () => {
      const result = replaceTokens('{{d NAME "Friend"}}', {});
      expect(result).toBe('Friend');
    });

    it('handles mixed tokens', () => {
      const result = replaceTokens(
        'Hi {{FIRSTNAME}}, welcome to {{up GEOCITY}}!',
        { FIRSTNAME: 'John', GEOCITY: 'new york' }
      );
      expect(result).toBe('Hi John, welcome to NEW YORK!');
    });

    it('handles null input', () => {
      expect(replaceTokens(null, {})).toBeNull();
      expect(replaceTokens(undefined, {})).toBeUndefined();
    });

    it('leaves unknown tokens empty', () => {
      const result = replaceTokens('Hello {{UNKNOWN}}!', {});
      expect(result).toBe('Hello !');
    });
  });

  describe('buildPersonalizedURL', () => {
    it('adds token params to URL', () => {
      const url = buildPersonalizedURL('https://example.com/watch?id=1', {
        FIRSTNAME: 'John',
        EMAIL: 'john@test.com',
      });
      expect(url).toContain('FIRSTNAME=John');
      expect(url).toContain('EMAIL=john%40test.com');
    });

    it('skips empty values', () => {
      const url = buildPersonalizedURL('https://example.com/watch', {
        FIRSTNAME: 'John',
        EMAIL: '',
      });
      expect(url).toContain('FIRSTNAME=John');
      expect(url).not.toContain('EMAIL=');
    });
  });

  describe('buildProviderURL', () => {
    it('formats MailChimp merge tags', () => {
      const url = buildProviderURL(
        'https://example.com/watch',
        ['FIRSTNAME'],
        'mailchimp'
      );
      expect(url).toContain('FIRSTNAME=');
      expect(decodeURIComponent(url)).toContain('*|FIRSTNAME|*');
    });

    it('formats AWeber merge tags', () => {
      const url = buildProviderURL(
        'https://example.com/watch',
        ['EMAIL'],
        'aweber'
      );
      expect(url).toContain('EMAIL=');
      expect(decodeURIComponent(url)).toContain('{!email}');
    });

    it('formats custom provider', () => {
      const url = buildProviderURL(
        'https://example.com/watch',
        ['FIRSTNAME'],
        'custom'
      );
      expect(url).toContain('FIRSTNAME=firstname_token');
    });
  });

  describe('EMAIL_PROVIDER_TOKENS', () => {
    it('has all expected providers', () => {
      const providers = Object.keys(EMAIL_PROVIDER_TOKENS);
      expect(providers).toContain('mailchimp');
      expect(providers).toContain('aweber');
      expect(providers).toContain('getresponse');
      expect(providers).toContain('custom');
    });
  });
});
