import { describe, it, expect } from 'vitest';

import {
  subscribe, getState, setState, setStage, setSelectedOverlay,
  setPlaying, setCurrentTime, setDuration, setProject, STAGE_TYPES
} from '../src/lib/editorState.js';

describe('editorState', () => {
  it('has initial state', () => {
    const state = getState();
    expect(state.stage).toBe('VIDEO_CUSTOMISE');
    expect(state.isPlaying).toBe(false);
    expect(state.currentTime).toBe(0);
  });

  it('updates state', () => {
    setState({ custom: 'value' });
    expect(getState().custom).toBe('value');
  });

  it('notifies subscribers', () => {
    let called = false;
    const unsub = subscribe(() => { called = true; });
    setState({ test: true });
    expect(called).toBe(true);
    unsub();
  });

  it('setStage works', () => {
    setStage(STAGE_TYPES.AUDIO_CUSTOMISE);
    expect(getState().stage).toBe('AUDIO_CUSTOMISE');
  });

  it('setPlaying works', () => {
    setPlaying(true);
    expect(getState().isPlaying).toBe(true);
    setPlaying(false);
    expect(getState().isPlaying).toBe(false);
  });

  it('setCurrentTime works', () => {
    setCurrentTime(42.5);
    expect(getState().currentTime).toBe(42.5);
  });

  it('setSelectedOverlay works', () => {
    setSelectedOverlay({ id: 'test' });
    expect(getState().selectedOverlay.id).toBe('test');
  });
});
