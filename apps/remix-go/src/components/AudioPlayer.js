export default function AudioPlayer({ src, onTimeUpdate }) {
  const container = document.createElement('div');
  container.className = 'audio-player p-3 rounded-lg bg-white/5 border border-white/10';

  container.innerHTML = `
    <div class="flex items-center gap-3">
      <button id="audio-play-btn" class="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white hover:bg-violet-500 transition-colors flex-shrink-0">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <div class="flex-1">
        <input id="audio-progress" type="range" min="0" max="100" value="0"
          class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500">
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span id="audio-current">0:00</span>
          <span id="audio-duration">0:00</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>
        <input id="audio-volume" type="range" min="0" max="100" value="80"
          class="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500">
      </div>
    </div>
  `;

  const audio = new Audio(src || '');
  const playBtn = container.querySelector('#audio-play-btn');
  const progress = container.querySelector('#audio-progress');
  const currentEl = container.querySelector('#audio-current');
  const durationEl = container.querySelector('#audio-duration');
  const volumeEl = container.querySelector('#audio-volume');

  function formatTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  let isPlaying = false;

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
    progress.max = audio.duration;
  });

  audio.addEventListener('timeupdate', () => {
    currentEl.textContent = formatTime(audio.currentTime);
    if (!progress.dragging) progress.value = audio.currentTime;
    if (onTimeUpdate) onTimeUpdate(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  });

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    } else {
      audio.play();
      playBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    }
    isPlaying = !isPlaying;
  });

  progress.addEventListener('input', () => {
    audio.currentTime = parseFloat(progress.value);
  });

  volumeEl.addEventListener('input', () => {
    audio.volume = parseInt(volumeEl.value, 10) / 100;
  });

  container.setSource = (newSrc) => {
    audio.src = newSrc;
    isPlaying = false;
    playBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  };

  container.getAudio = () => audio;

  return container;
}
