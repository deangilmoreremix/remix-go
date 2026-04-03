// Dynamic import for VideoExport to avoid circular dependencies
const loadVideoExport = () => import('./VideoExport.js');

export default function EnhancedVideoEditor({ src, onOverlayAdd, onTimeUpdate, project }) {
  const container = document.createElement('div');
  container.className = 'enhanced-video-editor flex flex-col h-full';

  // Editor state
  let video = null;
  let overlayContainer = null;
  let popcornInstance = null;
  let currentTime = 0;
  let duration = 0;
  let isPlaying = false;
  let playbackRate = 1;
  let zoomLevel = 1;
  let selectedOverlays = new Set();
  let overlays = project?.overlays || [];

  // Timeline state
  let timelineScrollLeft = 0;
  let timelineZoom = 1;
  let dragging = null;
  let resizing = null;
  let seekPreview = false;

  container.innerHTML = `
    <!-- Video Player Section -->
    <div class="video-player-section flex-1 flex flex-col bg-black rounded-lg overflow-hidden mb-4">
      <!-- Video Display -->
      <div class="video-display flex-1 relative bg-black">
        <video id="editor-video" class="w-full h-full object-contain" playsinline></video>
        <div id="overlay-container" class="absolute inset-0 pointer-events-none" style="z-index: 10;"></div>

        <!-- Video Controls Overlay -->
        <div id="video-overlay-controls" class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div class="flex items-center gap-4">
            <!-- Play/Pause -->
            <button id="play-pause-btn" class="text-white hover:text-violet-400 transition-colors">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>

            <!-- Timeline -->
            <div class="flex-1 flex items-center gap-2">
              <span id="current-time" class="text-sm text-white font-mono w-16">0:00.00</span>
              <div class="flex-1 relative">
                <input id="timeline-slider" type="range" min="0" max="100" value="0" step="0.01"
                  class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500">
                <div id="seek-preview" class="absolute top-0 left-0 h-2 bg-violet-400/50 rounded-lg pointer-events-none opacity-0 transition-opacity"></div>
              </div>
              <span id="total-time" class="text-sm text-white font-mono w-16">0:00.00</span>
            </div>

            <!-- Volume -->
            <div class="flex items-center gap-2">
              <button id="volume-btn" class="text-white hover:text-violet-400 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
              </button>
              <input id="volume-slider" type="range" min="0" max="1" value="0.8" step="0.1"
                class="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500">
            </div>

            <!-- Speed -->
            <select id="speed-select" class="bg-white/20 text-white text-sm rounded px-2 py-1">
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1" selected>1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline Section -->
    <div class="timeline-section bg-white/5 rounded-lg p-4">
      <!-- Timeline Controls -->
      <div class="timeline-controls flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <!-- Zoom Controls -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">Zoom:</span>
            <button id="zoom-out" class="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            <span id="zoom-level" class="text-sm text-white min-w-[3rem] text-center">100%</span>
            <button id="zoom-in" class="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
            <button id="zoom-fit" class="ml-2 px-2 py-1 text-xs rounded bg-violet-600 hover:bg-violet-500 text-white">Fit</button>
          </div>

          <!-- View Options -->
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-sm">
              <input id="show-keyframes" type="checkbox" checked class="accent-violet-500">
              <span class="text-gray-300">Keyframes</span>
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input id="show-markers" type="checkbox" checked class="accent-violet-500">
              <span class="text-gray-300">Markers</span>
            </label>
          </div>
        </div>

        <!-- Timeline Actions -->
        <div class="flex items-center gap-2">
          <button id="add-marker" class="px-3 py-1 text-sm rounded bg-white/10 hover:bg-white/20 text-white">
            Add Marker
          </button>
          <button id="clear-selection" class="px-3 py-1 text-sm rounded bg-white/10 hover:bg-white/20 text-white">
            Clear Selection
          </button>
        </div>
      </div>

      <!-- Timeline Tracks -->
      <div class="timeline-tracks relative">
        <!-- Time Ruler -->
        <div id="time-ruler" class="h-8 bg-black/20 rounded-t border-b border-white/10 relative overflow-hidden">
          <div id="ruler-marks" class="absolute inset-0"></div>
          <div id="playhead" class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"></div>
        </div>

        <!-- Track Container -->
        <div id="tracks-container" class="relative overflow-x-auto overflow-y-auto max-h-96">
          <div id="tracks-wrapper" class="relative min-w-full">
            <!-- Video Track -->
            <div class="track video-track h-16 bg-black/10 border-b border-white/5 relative">
              <div class="track-header absolute left-0 top-0 bottom-0 w-32 bg-black/20 flex items-center px-3 border-r border-white/10">
                <span class="text-sm text-white font-medium">Video</span>
              </div>
              <div id="video-track-content" class="absolute left-32 right-0 top-0 bottom-0">
                <div id="video-waveform" class="h-full bg-violet-600/20 rounded mx-2 my-1 relative">
                  <div id="video-playhead" class="absolute top-0 bottom-0 w-0.5 bg-white z-10"></div>
                </div>
              </div>
            </div>

            <!-- Overlay Tracks -->
            <div id="overlay-tracks" class="relative">
              <!-- Tracks will be dynamically added here -->
            </div>

            <!-- Add Track Button -->
            <div class="track add-track h-12 bg-white/5 border-b border-white/5 flex items-center justify-center">
              <button id="add-track-btn" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add Track
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Section -->
      <div class="mt-6">
        <div id="export-container" class="export-section">
          <!-- VideoExport component will be inserted here -->
        </div>
      </div>
    </div>
  `;

  // Initialize video
  video = container.querySelector('#editor-video');
  overlayContainer = container.querySelector('#overlay-container');

  if (src) {
    video.src = src;
  }

  // Timeline elements
  const timelineSlider = container.querySelector('#timeline-slider');
  const currentTimeEl = container.querySelector('#current-time');
  const totalTimeEl = container.querySelector('#total-time');
  const playhead = container.querySelector('#playhead');
  const videoPlayhead = container.querySelector('#video-playhead');
  const tracksWrapper = container.querySelector('#tracks-wrapper');
  const timeRuler = container.querySelector('#time-ruler');

  // Initialize timeline
  initializeTimeline();
  setupVideoControls();
  setupTimelineControls();
  renderOverlayTracks();

  // Initialize VideoExport
  initializeVideoExport();

  // Video event listeners
  video.addEventListener('loadedmetadata', () => {
    duration = video.duration;
    totalTimeEl.textContent = formatTime(duration);
    timelineSlider.max = duration;
    updateTimeRuler();
    updatePlayhead();
  });

  video.addEventListener('timeupdate', () => {
    if (!dragging) {
      currentTime = video.currentTime;
      currentTimeEl.textContent = formatTime(currentTime);
      timelineSlider.value = currentTime;
      updatePlayhead();
    }
    if (onTimeUpdate) onTimeUpdate(currentTime);
  });

  video.addEventListener('play', () => {
    isPlaying = true;
    updatePlayPauseButton();
  });

  video.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayPauseButton();
  });

  video.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayPauseButton();
  });

  function formatTime(s) {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = Math.floor(s % 60);
    const milliseconds = Math.floor((s % 1) * 100);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  }

  function updatePlayPauseButton() {
    const btn = container.querySelector('#play-pause-btn');
    if (isPlaying) {
      btn.innerHTML = '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    } else {
      btn.innerHTML = '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    }
  }

  function updatePlayhead() {
    if (!timeRuler) return;

    const rulerWidth = timeRuler.offsetWidth - 128; // Account for track header
    const progress = currentTime / duration;
    const position = 128 + (progress * rulerWidth);

    playhead.style.left = `${position}px`;
    videoPlayhead.style.left = `${progress * 100}%`;
  }

  function initializeTimeline() {
    updateTimeRuler();
  }

  function updateTimeRuler() {
    const rulerMarks = container.querySelector('#ruler-marks');
    if (!rulerMarks) return;

    rulerMarks.innerHTML = '';

    // Calculate marks based on zoom and duration
    const rulerWidth = timeRuler.offsetWidth - 128;
    const pixelsPerSecond = (rulerWidth * timelineZoom) / duration;

    // Major marks (every 10 seconds at normal zoom)
    const majorInterval = Math.max(1, Math.floor(10 / timelineZoom));
    const minorInterval = majorInterval / 10;

    for (let time = 0; time <= duration; time += minorInterval) {
      const position = 128 + (time / duration) * rulerWidth;

      if (time % majorInterval === 0) {
        // Major mark
        const mark = document.createElement('div');
        mark.className = 'absolute top-0 bottom-0 w-px bg-white/30';
        mark.style.left = `${position}px`;

        const label = document.createElement('div');
        label.className = 'absolute top-0 text-xs text-white transform -translate-x-1/2';
        label.style.left = `${position}px`;
        label.textContent = formatTime(time).split('.')[0]; // Remove milliseconds

        rulerMarks.appendChild(mark);
        rulerMarks.appendChild(label);
      } else {
        // Minor mark
        const mark = document.createElement('div');
        mark.className = 'absolute top-2 bottom-2 w-px bg-white/10';
        mark.style.left = `${position}px`;
        rulerMarks.appendChild(mark);
      }
    }
  }

  function setupVideoControls() {
    const playPauseBtn = container.querySelector('#play-pause-btn');
    const volumeSlider = container.querySelector('#volume-slider');
    const speedSelect = container.querySelector('#speed-select');

    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    });

    timelineSlider.addEventListener('input', (e) => {
      const time = parseFloat(e.target.value);
      video.currentTime = time;
      currentTime = time;
      currentTimeEl.textContent = formatTime(time);
      updatePlayhead();
    });

    timelineSlider.addEventListener('mousedown', () => {
      dragging = true;
    });

    timelineSlider.addEventListener('mouseup', () => {
      dragging = false;
    });

    volumeSlider.addEventListener('input', (e) => {
      video.volume = parseFloat(e.target.value);
    });

    speedSelect.addEventListener('change', (e) => {
      playbackRate = parseFloat(e.target.value);
      video.playbackRate = playbackRate;
    });
  }

  function setupTimelineControls() {
    const zoomInBtn = container.querySelector('#zoom-in');
    const zoomOutBtn = container.querySelector('#zoom-out');
    const zoomFitBtn = container.querySelector('#zoom-fit');
    const zoomLevelEl = container.querySelector('#zoom-level');

    zoomInBtn.addEventListener('click', () => {
      timelineZoom = Math.min(timelineZoom * 1.5, 10);
      updateZoom();
    });

    zoomOutBtn.addEventListener('click', () => {
      timelineZoom = Math.max(timelineZoom / 1.5, 0.1);
      updateZoom();
    });

    zoomFitBtn.addEventListener('click', () => {
      timelineZoom = 1;
      updateZoom();
    });

    function updateZoom() {
      zoomLevelEl.textContent = `${Math.round(timelineZoom * 100)}%`;
      updateTimeRuler();
      renderOverlayTracks();
    }

    // Timeline scrolling
    const tracksContainer = container.querySelector('#tracks-container');
    tracksContainer.addEventListener('scroll', () => {
      timelineScrollLeft = tracksContainer.scrollLeft;
    });
  }

  function renderOverlayTracks() {
    const overlayTracks = container.querySelector('#overlay-tracks');
    overlayTracks.innerHTML = '';

    overlays.forEach((overlay, index) => {
      const track = document.createElement('div');
      track.className = 'track overlay-track h-16 bg-white/5 border-b border-white/5 relative';
      track.dataset.overlayId = overlay.id;

      track.innerHTML = `
        <div class="track-header absolute left-0 top-0 bottom-0 w-32 bg-white/10 flex items-center px-3 border-r border-white/10">
          <span class="text-sm text-white font-medium">${overlay.type || 'Overlay'} ${index + 1}</span>
        </div>
        <div class="overlay-track-content absolute left-32 right-0 top-0 bottom-0 relative">
          <div class="overlay-segment absolute top-2 bottom-2 bg-violet-500/30 rounded border border-violet-500/50 cursor-pointer hover:bg-violet-500/40"
               style="left: ${(overlay.start / duration) * 100}%; width: ${((overlay.end - overlay.start) / duration) * 100}%">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs text-white font-medium truncate px-2">${overlay.text || overlay.type}</span>
            </div>
            <!-- Resize handles -->
            <div class="resize-handle left-0 top-0 bottom-0 w-2 bg-violet-400 cursor-ew-resize absolute"></div>
            <div class="resize-handle right-0 top-0 bottom-0 w-2 bg-violet-400 cursor-ew-resize absolute"></div>
          </div>
        </div>
      `;

      // Add event listeners for overlay manipulation
      const segment = track.querySelector('.overlay-segment');

      segment.addEventListener('click', (e) => {
        if (!e.shiftKey) {
          selectedOverlays.clear();
        }
        selectedOverlays.add(overlay.id);
        updateSelectionVisuals();
      });

      // Drag functionality would be implemented here
      // Resize functionality would be implemented here

      overlayTracks.appendChild(track);
    });
  }

  function updateSelectionVisuals() {
    container.querySelectorAll('.overlay-segment').forEach(segment => {
      const overlayId = segment.closest('.track').dataset.overlayId;
      if (selectedOverlays.has(overlayId)) {
        segment.classList.add('ring-2', 'ring-violet-400');
      } else {
        segment.classList.remove('ring-2', 'ring-violet-400');
      }
    });
  }

  // Public API
  container.setSource = (newSrc) => {
    if (video) {
      video.src = newSrc;
      isPlaying = false;
      currentTime = 0;
      updatePlayPauseButton();
      updatePlayhead();
    }
  };

  container.addOverlay = (overlay) => {
    overlays.push(overlay);
    renderOverlayTracks();
    if (onOverlayAdd) onOverlayAdd(overlay);
  };

  container.removeOverlay = (overlayId) => {
    overlays = overlays.filter(o => o.id !== overlayId);
    renderOverlayTracks();
  };

  container.updateOverlay = (overlayId, updates) => {
    const index = overlays.findIndex(o => o.id === overlayId);
    if (index > -1) {
      overlays[index] = { ...overlays[index], ...updates };
      renderOverlayTracks();
    }
  };

  // Initialize VideoExport component
  async function initializeVideoExport() {
    try {
      const exportContainer = container.querySelector('#export-container');
      if (exportContainer) {
        const VideoExportModule = await loadVideoExport();
        const VideoExportComponent = VideoExportModule.default;

        const exportComponent = VideoExportComponent({
          project,
          onExportComplete: (result) => {
            console.log('Video export completed:', result);
            // Handle successful export
          },
          onExportError: (error) => {
            console.error('Video export failed:', error);
            // Handle export error
          }
        });

        exportContainer.appendChild(exportComponent);
      }
    } catch (error) {
      console.error('Failed to initialize video export:', error);
    }
  }

  container.getCurrentTime = () => currentTime;
  container.getDuration = () => duration;
  container.getVideo = () => video;
  container.getOverlayContainer = () => overlayContainer;

  return container;
}
