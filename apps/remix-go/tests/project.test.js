import { describe, it, expect } from 'vitest';

import {
  createProject, updateProject, addOverlay, removeOverlay, updateOverlay
} from '../src/lib/project.js';

describe('project', () => {
  describe('createProject', () => {
    it('creates with defaults', () => {
      const p = createProject();
      expect(p.id).toBeTruthy();
      expect(p.name).toBe('Untitled Project');
      expect(p.overlays).toEqual([]);
      expect(p.stages.length).toBe(3);
      expect(p.metadata.createdAt).toBeTypeOf('number');
    });

    it('accepts overrides', () => {
      const p = createProject({ name: 'My Video', duration: 30 });
      expect(p.name).toBe('My Video');
      expect(p.metadata.duration).toBe(30);
    });

    it('generates unique IDs', () => {
      const a = createProject();
      const b = createProject();
      expect(a.id).not.toBe(b.id);
    });
  });

  describe('updateProject', () => {
    it('updates fields and timestamp', () => {
      const p = createProject();
      const originalUpdated = p.metadata.updatedAt;
      const updated = updateProject(p, { name: 'Updated' });
      expect(updated.name).toBe('Updated');
      expect(updated.metadata.updatedAt).toBeGreaterThanOrEqual(originalUpdated);
    });

    it('preserves other fields', () => {
      const p = createProject({ name: 'Original' });
      const updated = updateProject(p, { description: 'New desc' });
      expect(updated.name).toBe('Original');
      expect(updated.description).toBe('New desc');
    });
  });

  describe('addOverlay', () => {
    it('adds overlay with generated ID', () => {
      const p = createProject();
      const result = addOverlay(p, { type: 'text', text: 'Hello' });
      expect(result.overlays.length).toBe(1);
      expect(result.overlays[0].type).toBe('text');
      expect(result.overlays[0].id).toBeTruthy();
    });

    it('preserves existing overlays', () => {
      let p = createProject();
      p = addOverlay(p, { type: 'text' });
      p = addOverlay(p, { type: 'image' });
      expect(p.overlays.length).toBe(2);
    });
  });

  describe('removeOverlay', () => {
    it('removes by ID', () => {
      let p = createProject();
      p = addOverlay(p, { type: 'text' });
      const id = p.overlays[0].id;
      p = removeOverlay(p, id);
      expect(p.overlays.length).toBe(0);
    });

    it('does nothing for missing ID', () => {
      let p = createProject();
      p = addOverlay(p, { type: 'text' });
      p = removeOverlay(p, 'nonexistent');
      expect(p.overlays.length).toBe(1);
    });
  });

  describe('updateOverlay', () => {
    it('updates specific overlay', () => {
      let p = createProject();
      p = addOverlay(p, { type: 'text', text: 'Old' });
      const id = p.overlays[0].id;
      p = updateOverlay(p, id, { text: 'New' });
      expect(p.overlays[0].text).toBe('New');
    });
  });
});
