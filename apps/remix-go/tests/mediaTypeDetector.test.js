import { describe, it, expect } from 'vitest';

import {
  detectMediaType, getYouTubeId, getVimeoId, extractYouTubeDuration
} from '../src/lib/mediaTypeDetector.js';

describe('mediaTypeDetector', () => {
  describe('detectMediaType', () => {
    it('detects YouTube', () => {
      expect(detectMediaType('https://www.youtube.com/watch?v=abc123')).toBe('YouTube');
      expect(detectMediaType('https://youtu.be/abc123')).toBe('YouTube');
    });
    it('detects Vimeo', () => {
      expect(detectMediaType('https://vimeo.com/123456')).toBe('Vimeo');
    });
    it('detects images', () => {
      expect(detectMediaType('https://example.com/photo.jpg')).toBe('Image');
      expect(detectMediaType('https://example.com/img.png')).toBe('Image');
    });
    it('detects video files', () => {
      expect(detectMediaType('https://example.com/video.mp4')).toBe('Video');
    });
    it('detects audio files', () => {
      expect(detectMediaType('https://example.com/audio.mp3')).toBe('Audio');
    });
    it('falls back to HTML5', () => {
      expect(detectMediaType('https://example.com/page')).toBe('HTML5');
    });
  });

  describe('getYouTubeId', () => {
    it('extracts ID from watch URL', () => {
      expect(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });
    it('extracts ID from short URL', () => {
      expect(getYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });
    it('extracts ID from embed URL', () => {
      expect(getYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });
    it('returns null for invalid', () => {
      expect(getYouTubeId('https://vimeo.com/123')).toBeNull();
    });
  });

  describe('getVimeoId', () => {
    it('extracts ID', () => {
      expect(getVimeoId('https://vimeo.com/12345678')).toBe('12345678');
    });
    it('returns null for invalid', () => {
      expect(getVimeoId('https://youtube.com/watch?v=abc')).toBeNull();
    });
  });

  describe('extractYouTubeDuration', () => {
    it('parses PT1M30S', () => {
      expect(extractYouTubeDuration('PT1M30S')).toBe(90);
    });
    it('parses PT1H', () => {
      expect(extractYouTubeDuration('PT1H')).toBe(3600);
    });
    it('parses PT30S', () => {
      expect(extractYouTubeDuration('PT30S')).toBe(30);
    });
  });
});
