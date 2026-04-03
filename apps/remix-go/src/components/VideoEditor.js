export default function VideoEditor({ src, onOverlayAdd, onTimeUpdate }) {
  const container = document.createElement('div');
  container.className = 'video-editor';

  let video = null;
  let overlayContainer = null;

  container.innerHTML = `
    <div class="video-player-container relative bg-black rounded-lg overflow-hidden">
      <video id="editor-video" class="w-full h-full object-contain" controls playsinline></video>
      <div id="overlay-container" class="absolute inset-0 pointer-events-none" style="z-index: 10;"></div>
      <div id="video-controls" class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3">
        <button id="play-pause-btn" class="text-white hover:text-violet-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <div class="flex-1 flex items-center gap-2">
          <span id="current-time" class="text-xs text-gray-400 w-12">0:00</span>
          <input id="timeline-slider" type="range" min="0" max="100" value="0"
            class="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500">
          <span id="total-time" class="text-xs text-gray-400 w-12">0:00</span>
        </div>
        <button id="volume-btn" class="text-white hover:text-violet-400 transition-colors">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        </button>
      </div>
    </div>
    <div id="timeline-track" class="mt-3 h-16 bg-white/5 rounded-lg relative overflow-hidden">
      <div class="absolute inset-x-0 top-0 h-6 bg-white/5 flex items-center px-2">
        <span class="text-xs text-gray-500">Overlays</span>
      </div>
      <div id="timeline-overlays" class="absolute inset-x-0 top-6 bottom-0 flex items-center px-1 gap-1"></div>
    </div>
  `;

  video = container.querySelector('#editor-video');
  overlayContainer = container.querySelector('#overlay-container');
  const playPauseBtn = container.querySelector('#play-pause-btn');
  const timelineSlider = container.querySelector('#timeline-slider');
  const currentTimeEl = container.querySelector('#current-time');
  const totalTimeEl = container.querySelector('#total-time');
  const timelineOverlays = container.querySelector('#timeline-overlays');

  if (src) video.src = src;

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  video.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(video.duration);
    timelineSlider.max = video.duration;
  });

  video.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(video.currentTime);
    timelineSlider.value = video.currentTime;
    if (onTimeUpdate) onTimeUpdate(video.currentTime);
  });

  let isPlaying = false;
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      video.pause();
      playPauseBtn.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    } else {
      video.play();
      playPauseBtn.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    }
    isPlaying = !isPlaying;
  });

  timelineSlider.addEventListener('input', () => {
    video.currentTime = parseFloat(timelineSlider.value);
  });

  container.setSource = (newSrc) => {
    video.src = newSrc;
  };

  container.addOverlayElement = (overlay) => {
    const el = document.createElement('div');
    el.className = 'overlay-element absolute pointer-events-auto';
    el.style.top = overlay.top || '10%';
    el.style.left = overlay.left || '10%';
    el.style.width = overlay.width || '80%';
    el.dataset.overlayId = overlay.id;

    if (overlay.type === 'text') {
      el.innerHTML = `<p class="text-white text-lg font-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8)">${overlay.text || 'Text'}</p>`;
    } else if (overlay.type === 'image') {
      el.innerHTML = `<img src="${overlay.src}" class="w-full rounded" alt="overlay">`;
    } else if (overlay.type === 'cta') {
      el.innerHTML = `<a href="${overlay.href || '#'}" class="inline-block px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-500">${overlay.text || 'Click Here'}</a>`;
    }

    overlayContainer.appendChild(el);

    const marker = document.createElement('div');
    marker.className = 'h-full rounded bg-violet-500/50 text-white text-xs flex items-center px-1 truncate';
    marker.style.minWidth = '40px';
    marker.style.flex = '1';
    marker.textContent = overlay.type || 'overlay';
    marker.dataset.overlayId = overlay.id;
    timelineOverlays.appendChild(marker);
  };

  container.getVideo = () => video;
  container.getOverlayContainer = () => overlayContainer;

  return container;
}
