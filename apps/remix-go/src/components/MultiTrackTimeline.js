export default class MultiTrackTimeline {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      minTrackHeight: 60,
      maxTrackHeight: 120,
      defaultTrackHeight: 80,
      snapToGrid: true,
      gridSize: 0.1, // 100ms
      ...options,
    };

    this.tracks = [];
    this.selectedItems = new Set();
    this.currentTime = 0;
    this.duration = 0;
    this.zoom = 1;
    this.scrollLeft = 0;

    this.dragging = null;
    this.resizing = null;
    this.seekPreview = false;

    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.createDefaultTracks();
  }

  render() {
    this.container.innerHTML = `
      <div class="timeline-header flex items-center justify-between p-3 bg-white/10 border-b border-white/10">
        <div class="timeline-info flex items-center gap-4">
          <span class="text-sm text-white font-medium">Timeline</span>
          <span class="text-xs text-gray-400" id="timeline-duration">0:00.00</span>
        </div>
        <div class="timeline-controls flex items-center gap-2">
          <button id="timeline-play" class="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button id="timeline-pause" class="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </button>
          <div class="w-px h-4 bg-white/20 mx-2"></div>
          <button id="timeline-zoom-in" class="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M10 7v3m0 0v3m0-3h3m-3 0H7"/>
            </svg>
          </button>
          <span id="timeline-zoom-level" class="text-xs text-white min-w-[2.5rem]">100%</span>
          <button id="timeline-zoom-out" class="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M13 10H7"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="timeline-body flex flex-1 overflow-hidden">
        <!-- Track Headers -->
        <div class="tracks-sidebar w-48 bg-white/5 border-r border-white/10 overflow-y-auto">
          <div class="track-headers">
            <!-- Track headers will be inserted here -->
          </div>
          <div class="add-track-section p-2 border-t border-white/10">
            <button id="add-new-track" class="w-full py-2 px-3 rounded bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Track
            </button>
          </div>
        </div>

        <!-- Timeline Content -->
        <div class="timeline-content flex-1 flex flex-col overflow-hidden">
          <!-- Time Ruler -->
          <div class="time-ruler h-8 bg-black/20 border-b border-white/10 relative overflow-hidden">
            <div id="time-marks" class="absolute inset-0"></div>
            <div id="timeline-playhead" class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 shadow-lg"></div>
            <div id="seek-preview-line" class="absolute top-0 bottom-0 w-0.5 bg-blue-400/50 z-10 opacity-0 transition-opacity"></div>
          </div>

          <!-- Tracks Container -->
          <div class="tracks-container flex-1 overflow-y-auto overflow-x-auto relative">
            <div id="tracks-wrapper" class="relative min-w-full">
              <!-- Tracks will be inserted here -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.updateTimeRuler();
  }

  setupEventListeners() {
    // Timeline controls
    this.container.querySelector('#timeline-play').addEventListener('click', () => {
      this.options.onPlay?.();
    });

    this.container.querySelector('#timeline-pause').addEventListener('click', () => {
      this.options.onPause?.();
    });

    this.container.querySelector('#timeline-zoom-in').addEventListener('click', () => {
      this.setZoom(this.zoom * 1.5);
    });

    this.container.querySelector('#timeline-zoom-out').addEventListener('click', () => {
      this.setZoom(this.zoom / 1.5);
    });

    // Add new track
    this.container.querySelector('#add-new-track').addEventListener('click', () => {
      this.addTrack({
        name: `Track ${this.tracks.length + 1}`,
        type: 'overlay',
        items: [],
      });
    });

    // Timeline seeking
    const timeRuler = this.container.querySelector('.time-ruler');
    timeRuler.addEventListener('mousemove', (e) => {
      if (this.seekPreview) {
        const rect = timeRuler.getBoundingClientRect();
        const x = e.clientX - rect.left - 192; // Account for sidebar
        const time = this.pixelsToTime(x);
        this.updateSeekPreview(time);
      }
    });

    timeRuler.addEventListener('click', (e) => {
      const rect = timeRuler.getBoundingClientRect();
      const x = e.clientX - rect.left - 192;
      const time = this.pixelsToTime(x);
      this.options.onSeek?.(time);
    });

    timeRuler.addEventListener('mouseenter', () => {
      this.seekPreview = true;
    });

    timeRuler.addEventListener('mouseleave', () => {
      this.seekPreview = false;
      this.hideSeekPreview();
    });
  }

  createDefaultTracks() {
    // Video track
    this.addTrack({
      id: 'video',
      name: 'Video',
      type: 'video',
      locked: true,
      items: [],
    });

    // Default overlay track
    this.addTrack({
      id: 'overlays-1',
      name: 'Overlays',
      type: 'overlay',
      items: [],
    });
  }

  addTrack(trackData) {
    const track = {
      id: trackData.id || `track-${Date.now()}`,
      name: trackData.name,
      type: trackData.type || 'overlay',
      height: trackData.height || this.options.defaultTrackHeight,
      locked: trackData.locked || false,
      visible: trackData.visible !== false,
      items: trackData.items || [],
      ...trackData,
    };

    this.tracks.push(track);
    this.renderTrack(track);
    this.updateTrackHeaders();
  }

  renderTrack(track) {
    const tracksWrapper = this.container.querySelector('#tracks-wrapper');

    const trackEl = document.createElement('div');
    trackEl.className = `timeline-track ${track.visible ? '' : 'opacity-50'}`;
    trackEl.dataset.trackId = track.id;
    trackEl.style.height = `${track.height}px`;

    trackEl.innerHTML = `
      <div class="track-content relative w-full h-full bg-white/5 border-b border-white/10">
        ${track.type === 'video' ? this.renderVideoTrack(track) : this.renderOverlayTrack(track)}
      </div>
    `;

    tracksWrapper.appendChild(trackEl);

    // Setup track-specific event listeners
    this.setupTrackEventListeners(track, trackEl);
  }

  renderVideoTrack(track) {
    return `
      <div class="video-waveform h-full bg-violet-600/20 mx-1 rounded relative">
        <div class="waveform-bars absolute inset-0 flex items-end px-1">
          ${Array.from({ length: 100 }, (_, i) => {
            const height = Math.random() * 80 + 20;
            return `<div class="flex-1 bg-violet-400/60 mx-px rounded-t" style="height: ${height}%"></div>`;
          }).join('')}
        </div>
        <div class="playhead-indicator absolute top-0 bottom-0 w-0.5 bg-white z-10"></div>
      </div>
    `;
  }

  renderOverlayTrack(track) {
    return `
      <div class="overlay-items relative w-full h-full">
        ${track.items.map(item => this.renderOverlayItem(item)).join('')}
      </div>
    `;
  }

  renderOverlayItem(item) {
    const left = this.timeToPixels(item.start);
    const width = this.timeToPixels(item.end - item.start);

    return `
      <div class="overlay-item absolute top-1 bottom-1 bg-violet-500/40 hover:bg-violet-500/60 rounded border border-violet-500/60 cursor-pointer transition-colors"
           data-item-id="${item.id}"
           style="left: ${left}px; width: ${width}px;">
        <div class="item-content h-full flex items-center justify-center px-2">
          <span class="text-xs text-white font-medium truncate">${item.text || item.type}</span>
        </div>
        <!-- Resize handles -->
        <div class="resize-handle-left absolute left-0 top-0 bottom-0 w-1 bg-violet-400 cursor-ew-resize opacity-0 hover:opacity-100"></div>
        <div class="resize-handle-right absolute right-0 top-0 bottom-0 w-1 bg-violet-400 cursor-ew-resize opacity-0 hover:opacity-100"></div>
      </div>
    `;
  }

  updateTrackHeaders() {
    const headersContainer = this.container.querySelector('.track-headers');
    headersContainer.innerHTML = '';

    this.tracks.forEach(track => {
      const header = document.createElement('div');
      header.className = 'track-header flex items-center justify-between p-3 border-b border-white/10';
      header.dataset.trackId = track.id;
      header.style.height = `${track.height}px`;

      header.innerHTML = `
        <div class="track-info flex items-center gap-2">
          <button class="visibility-toggle p-1 rounded hover:bg-white/10">
            ${track.visible ?
              '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>' :
              '<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/></svg>'
            }
          </button>
          <span class="text-sm text-white font-medium truncate">${track.name}</span>
        </div>
        <div class="track-controls flex items-center gap-1">
          ${!track.locked ? `
            <button class="lock-toggle p-1 rounded hover:bg-white/10">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </button>
          ` : ''}
          <button class="track-menu p-1 rounded hover:bg-white/10">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </button>
        </div>
      `;

      headersContainer.appendChild(header);
    });
  }

  setupTrackEventListeners(track, trackEl) {
    // Visibility toggle
    const visibilityBtn = trackEl.querySelector('.visibility-toggle');
    visibilityBtn?.addEventListener('click', () => {
      track.visible = !track.visible;
      trackEl.classList.toggle('opacity-50', !track.visible);
      this.updateTrackHeaders();
    });

    // Lock toggle
    const lockBtn = trackEl.querySelector('.lock-toggle');
    lockBtn?.addEventListener('click', () => {
      track.locked = !track.locked;
      // Update visual indicator
    });

    // Item interactions
    const items = trackEl.querySelectorAll('.overlay-item');
    items.forEach(item => {
      this.setupItemEventListeners(track, item);
    });
  }

  setupItemEventListeners(track, itemEl) {
    let startX = 0;
    let startTime = 0;
    let isDragging = false;
    let isResizing = false;
    let resizeHandle = null;

    const itemId = itemEl.dataset.itemId;
    const item = track.items.find(i => i.id === itemId);

    if (!item) return;

    // Mouse down on item
    itemEl.addEventListener('mousedown', (e) => {
      e.preventDefault();

      startX = e.clientX;
      startTime = item.start;
      isDragging = true;

      // Check if clicking on resize handle
      if (e.target.classList.contains('resize-handle-left') || e.target.classList.contains('resize-handle-right')) {
        isResizing = true;
        resizeHandle = e.target.classList.contains('resize-handle-left') ? 'left' : 'right';
      }

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaTime = this.pixelsToTime(deltaX);

      if (isResizing) {
        if (resizeHandle === 'left') {
          item.start = Math.max(0, startTime + deltaTime);
        } else {
          item.end = Math.max(item.start + 0.1, startTime + item.end - item.start + deltaTime);
        }
      } else {
        const newStart = Math.max(0, startTime + deltaTime);
        const duration = item.end - item.start;
        item.start = newStart;
        item.end = newStart + duration;
      }

      this.updateTrack(track);
    };

    const handleMouseUp = () => {
      isDragging = false;
      isResizing = false;
      resizeHandle = null;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Snap to grid if enabled
      if (this.options.snapToGrid) {
        item.start = Math.round(item.start / this.options.gridSize) * this.options.gridSize;
        item.end = Math.round(item.end / this.options.gridSize) * this.options.gridSize;
        this.updateTrack(track);
      }

      this.options.onItemChange?.(track.id, item);
    };

    // Click for selection
    itemEl.addEventListener('click', (e) => {
      if (!isDragging) {
        if (!e.shiftKey) {
          this.selectedItems.clear();
        }
        this.selectedItems.add(itemId);
        this.updateSelectionVisuals();
        this.options.onItemSelect?.(item);
      }
    });
  }

  updateSelectionVisuals() {
    this.container.querySelectorAll('.overlay-item').forEach(item => {
      const itemId = item.dataset.itemId;
      if (this.selectedItems.has(itemId)) {
        item.classList.add('ring-2', 'ring-violet-400', 'ring-inset');
      } else {
        item.classList.remove('ring-2', 'ring-violet-400', 'ring-inset');
      }
    });
  }

  updateTimeRuler() {
    const timeMarks = this.container.querySelector('#time-marks');
    if (!timeMarks) return;

    timeMarks.innerHTML = '';

    const rulerWidth = this.container.querySelector('.timeline-content').offsetWidth;
    const pixelsPerSecond = (rulerWidth * this.zoom) / this.duration;

    // Calculate appropriate intervals
    const intervals = [0.1, 0.5, 1, 5, 10, 30, 60];
    let interval = intervals[0];
    for (const i of intervals) {
      if (pixelsPerSecond * i >= 50) { // Minimum 50px between marks
        interval = i;
        break;
      }
    }

    for (let time = 0; time <= this.duration; time += interval) {
      const position = this.timeToPixels(time);

      const mark = document.createElement('div');
      mark.className = 'absolute top-0 text-xs text-white transform -translate-x-1/2 select-none';
      mark.style.left = `${position}px`;

      if (time % (interval * 5) === 0) {
        // Major mark with label
        mark.innerHTML = `
          <div class="w-px h-4 bg-white/50 mb-1"></div>
          <div class="text-center">${this.formatTime(time)}</div>
        `;
      } else {
        // Minor mark
        mark.innerHTML = '<div class="w-px h-2 bg-white/30"></div>';
      }

      timeMarks.appendChild(mark);
    }
  }

  updatePlayhead(time) {
    const playhead = this.container.querySelector('#timeline-playhead');
    if (playhead) {
      const position = this.timeToPixels(time);
      playhead.style.left = `${position}px`;
    }
  }

  updateSeekPreview(time) {
    const previewLine = this.container.querySelector('#seek-preview-line');
    if (previewLine) {
      const position = this.timeToPixels(time);
      previewLine.style.left = `${position}px`;
      previewLine.style.opacity = '1';
    }
  }

  hideSeekPreview() {
    const previewLine = this.container.querySelector('#seek-preview-line');
    if (previewLine) {
      previewLine.style.opacity = '0';
    }
  }

  timeToPixels(time) {
    const rulerWidth = this.container.querySelector('.timeline-content').offsetWidth;
    return (time / this.duration) * rulerWidth;
  }

  pixelsToTime(pixels) {
    const rulerWidth = this.container.querySelector('.timeline-content').offsetWidth;
    return (pixels / rulerWidth) * this.duration;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  setZoom(zoom) {
    this.zoom = Math.max(0.1, Math.min(10, zoom));
    this.updateTimeRuler();
    this.updateZoomDisplay();
    this.options.onZoom?.(this.zoom);
  }

  updateZoomDisplay() {
    const zoomEl = this.container.querySelector('#timeline-zoom-level');
    if (zoomEl) {
      zoomEl.textContent = `${Math.round(this.zoom * 100)}%`;
    }
  }

  setDuration(duration) {
    this.duration = duration;
    this.updateTimeRuler();
    const durationEl = this.container.querySelector('#timeline-duration');
    if (durationEl) {
      durationEl.textContent = this.formatTime(duration);
    }
  }

  setCurrentTime(time) {
    this.currentTime = time;
    this.updatePlayhead(time);
  }

  updateTrack(track) {
    const trackEl = this.container.querySelector(`[data-track-id="${track.id}"]`);
    if (trackEl) {
      const content = track.type === 'video'
        ? this.renderVideoTrack(track)
        : this.renderOverlayTrack(track);
      trackEl.querySelector('.track-content').innerHTML = content;
      this.setupTrackEventListeners(track, trackEl);
    }
  }

  addItem(trackId, item) {
    const track = this.tracks.find(t => t.id === trackId);
    if (track) {
      track.items.push(item);
      this.updateTrack(track);
    }
  }

  removeItem(trackId, itemId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (track) {
      track.items = track.items.filter(i => i.id !== itemId);
      this.updateTrack(track);
    }
  }

  getTracks() {
    return this.tracks;
  }

  getSelectedItems() {
    return Array.from(this.selectedItems);
  }

  destroy() {
    // Cleanup event listeners and DOM
    this.container.innerHTML = '';
  }
}
