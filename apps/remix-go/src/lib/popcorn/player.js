let playerInstance = null;
let overlays = [];

export function getPlayer() {
  return playerInstance;
}

export function setPlayer(player) {
  playerInstance = player;
}

export function destroyPlayer() {
  if (playerInstance && playerInstance.popcorn) {
    playerInstance.popcorn.destroy();
  }
  playerInstance = null;
  overlays = [];
}

export function getOverlays() {
  return [...overlays];
}

export function addOverlay(overlay) {
  overlays.push(overlay);
  return overlay;
}

export function removeOverlay(id) {
  overlays = overlays.filter(o => o.id !== id);
}

export function updateOverlay(id, updates) {
  overlays = overlays.map(o => o.id === id ? { ...o, ...updates } : o);
}

export function play() {
  if (playerInstance && playerInstance.popcorn) {
    playerInstance.popcorn.play();
  }
}

export function pause() {
  if (playerInstance && playerInstance.popcorn) {
    playerInstance.popcorn.pause();
  }
}

export function seek(time) {
  if (playerInstance && playerInstance.popcorn) {
    playerInstance.popcorn.currentTime(time);
  }
}

export function getCurrentTime() {
  if (playerInstance && playerInstance.popcorn) {
    return playerInstance.popcorn.currentTime();
  }
  return 0;
}

export function getDuration() {
  if (playerInstance && playerInstance.popcorn) {
    return playerInstance.popcorn.duration();
  }
  return 0;
}

export default {
  getPlayer,
  setPlayer,
  destroyPlayer,
  getOverlays,
  addOverlay,
  removeOverlay,
  updateOverlay,
  play,
  pause,
  seek,
  getCurrentTime,
  getDuration,
};
