const listeners = new Set();
let state = {
  stage: 'VIDEO_CUSTOMISE',
  toolbar: null,
  selectedOverlay: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  project: null,
  isLoading: false,
  error: null,
};

export function getState() {
  return { ...state };
}

export function setState(updates) {
  state = { ...state, ...updates };
  listeners.forEach(fn => fn(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setStage(stage) {
  setState({ stage });
}

export function setSelectedOverlay(overlay) {
  setState({ selectedOverlay: overlay });
}

export function setPlaying(isPlaying) {
  setState({ isPlaying });
}

export function setCurrentTime(currentTime) {
  setState({ currentTime });
}

export function setDuration(duration) {
  setState({ duration });
}

export function setProject(project) {
  setState({ project });
}

export function setLoading(isLoading) {
  setState({ isLoading });
}

export function setError(error) {
  setState({ error });
}

export const STAGE_TYPES = {
  VIDEO_CUSTOMISE: 'VIDEO_CUSTOMISE',
  AUDIO_CUSTOMISE: 'AUDIO_CUSTOMISE',
  CAPTION_CUSTOMISE: 'CAPTION_CUSTOMISE',
};

export default {
  getState,
  setState,
  subscribe,
  setStage,
  setSelectedOverlay,
  setPlaying,
  setCurrentTime,
  setDuration,
  setProject,
  setLoading,
  setError,
  STAGE_TYPES,
};
