export default class KeyframeAnimationSystem {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      easing: 'ease-in-out',
      defaultDuration: 0.3,
      ...options,
    };

    this.animations = new Map();
    this.keyframes = new Map();
    this.activeAnimations = new Set();

    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="keyframe-system bg-white/5 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Keyframe Animation</h3>
          <div class="flex items-center gap-2">
            <button id="add-animation" class="px-3 py-1.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-sm">
              Add Animation
            </button>
            <button id="play-animations" class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm">
              Play All
            </button>
            <button id="stop-animations" class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm">
              Stop All
            </button>
          </div>
        </div>

        <div id="animations-list" class="space-y-3">
          <!-- Animations will be rendered here -->
        </div>

        <div class="mt-4 p-3 bg-white/5 rounded">
          <h4 class="text-sm font-semibold text-white mb-2">Animation Types</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <button data-type="fade" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white text-left">
              <div class="font-medium">Fade</div>
              <div class="text-gray-400">Opacity changes</div>
            </button>
            <button data-type="slide" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white text-left">
              <div class="font-medium">Slide</div>
              <div class="text-gray-400">Position movement</div>
            </button>
            <button data-type="scale" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white text-left">
              <div class="font-medium">Scale</div>
              <div class="text-gray-400">Size changes</div>
            </button>
            <button data-type="rotate" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white text-left">
              <div class="font-medium">Rotate</div>
              <div class="text-gray-400">Rotation animation</div>
            </button>
          </div>
        </div>
      </div>
    `;

    this.renderAnimations();
  }

  setupEventListeners() {
    // Add new animation
    this.container.querySelector('#add-animation').addEventListener('click', () => {
      this.addAnimation({
        id: `anim-${Date.now()}`,
        name: `Animation ${this.animations.size + 1}`,
        type: 'fade',
        target: null, // Will be set when overlay is selected
        keyframes: [
          { time: 0, properties: { opacity: 0 } },
          { time: 1, properties: { opacity: 1 } },
        ],
        duration: 0.5,
        easing: 'ease-in-out',
        enabled: true,
      });
    });

    // Play/stop all animations
    this.container.querySelector('#play-animations').addEventListener('click', () => {
      this.playAllAnimations();
    });

    this.container.querySelector('#stop-animations').addEventListener('click', () => {
      this.stopAllAnimations();
    });

    // Animation type buttons
    this.container.querySelectorAll('[data-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.createAnimationFromType(type);
      });
    });
  }

  addAnimation(animation) {
    this.animations.set(animation.id, animation);
    this.renderAnimations();
    this.options.onAnimationAdd?.(animation);
  }

  removeAnimation(animationId) {
    const animation = this.animations.get(animationId);
    if (animation) {
      this.stopAnimation(animationId);
      this.animations.delete(animationId);
      this.renderAnimations();
      this.options.onAnimationRemove?.(animation);
    }
  }

  updateAnimation(animationId, updates) {
    const animation = this.animations.get(animationId);
    if (animation) {
      Object.assign(animation, updates);
      this.renderAnimations();
      this.options.onAnimationUpdate?.(animation);
    }
  }

  renderAnimations() {
    const listEl = this.container.querySelector('#animations-list');
    listEl.innerHTML = '';

    if (this.animations.size === 0) {
      listEl.innerHTML = `
        <div class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2"/>
          </svg>
          <p class="text-sm">No animations yet</p>
          <p class="text-xs">Click "Add Animation" to create your first animation</p>
        </div>
      `;
      return;
    }

    this.animations.forEach(animation => {
      const animEl = document.createElement('div');
      animEl.className = 'animation-item bg-white/5 rounded-lg p-3';
      animEl.dataset.animationId = animation.id;

      animEl.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <button class="play-animation p-1 rounded hover:bg-white/10">
              ${this.activeAnimations.has(animation.id) ?
                '<svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' :
                '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
              }
            </button>
            <div>
              <h4 class="text-sm font-medium text-white">${animation.name}</h4>
              <p class="text-xs text-gray-400">${animation.type} • ${animation.keyframes.length} keyframes</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-xs">
              <input type="checkbox" ${animation.enabled ? 'checked' : ''} class="accent-violet-500">
              <span class="text-gray-300">Enabled</span>
            </label>
            <button class="delete-animation p-1 rounded hover:bg-red-600/20 text-red-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="keyframes-timeline relative h-12 bg-black/20 rounded mb-3">
          <div class="keyframes-container absolute inset-0 flex items-center px-2">
            ${animation.keyframes.map((keyframe, index) => `
              <div class="keyframe-marker absolute w-3 h-3 bg-violet-500 rounded-full border-2 border-white cursor-pointer hover:bg-violet-400"
                   style="left: ${keyframe.time * 100}%; top: 50%; transform: translate(-50%, -50%);"
                   data-keyframe-index="${index}"
                   title="Keyframe at ${keyframe.time}s">
              </div>
            `).join('')}
          </div>
          <div class="timeline-progress absolute top-0 bottom-0 bg-violet-500/30 rounded" style="width: 0%;"></div>
        </div>

        <div class="flex items-center gap-4 text-xs text-gray-400">
          <span>Duration: ${animation.duration}s</span>
          <span>Easing: ${animation.easing}</span>
          ${animation.target ? `<span>Target: ${animation.target}</span>` : '<span class="text-yellow-400">No target selected</span>'}
        </div>
      `;

      // Event listeners for this animation
      const playBtn = animEl.querySelector('.play-animation');
      const enabledCheckbox = animEl.querySelector('input[type="checkbox"]');
      const deleteBtn = animEl.querySelector('.delete-animation');

      playBtn.addEventListener('click', () => {
        if (this.activeAnimations.has(animation.id)) {
          this.stopAnimation(animation.id);
        } else {
          this.playAnimation(animation.id);
        }
      });

      enabledCheckbox.addEventListener('change', (e) => {
        this.updateAnimation(animation.id, { enabled: e.target.checked });
      });

      deleteBtn.addEventListener('click', () => {
        this.removeAnimation(animation.id);
      });

      // Keyframe interactions
      animEl.querySelectorAll('.keyframe-marker').forEach(marker => {
        this.setupKeyframeInteractions(animation, marker);
      });

      listEl.appendChild(animEl);
    });
  }

  setupKeyframeInteractions(animation, marker) {
    let isDragging = false;
    let startX = 0;
    let startTime = 0;

    const keyframeIndex = parseInt(marker.dataset.keyframeIndex);

    marker.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
      startX = e.clientX;
      startTime = animation.keyframes[keyframeIndex].time;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const timelineRect = marker.closest('.keyframes-timeline').getBoundingClientRect();
      const deltaX = e.clientX - startX;
      const newTime = Math.max(0, Math.min(1, startTime + (deltaX / timelineRect.width)));

      animation.keyframes[keyframeIndex].time = newTime;
      marker.style.left = `${newTime * 100}%`;

      this.updateAnimation(animation.id, { keyframes: [...animation.keyframes] });
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }

  createAnimationFromType(type) {
    const templates = {
      fade: {
        name: 'Fade Animation',
        type: 'fade',
        keyframes: [
          { time: 0, properties: { opacity: 0 } },
          { time: 1, properties: { opacity: 1 } },
        ],
      },
      slide: {
        name: 'Slide Animation',
        type: 'slide',
        keyframes: [
          { time: 0, properties: { transform: 'translateX(-100%)' } },
          { time: 1, properties: { transform: 'translateX(0)' } },
        ],
      },
      scale: {
        name: 'Scale Animation',
        type: 'scale',
        keyframes: [
          { time: 0, properties: { transform: 'scale(0.5)' } },
          { time: 1, properties: { transform: 'scale(1)' } },
        ],
      },
      rotate: {
        name: 'Rotate Animation',
        type: 'rotate',
        keyframes: [
          { time: 0, properties: { transform: 'rotate(0deg)' } },
          { time: 1, properties: { transform: 'rotate(360deg)' } },
        ],
      },
    };

    const template = templates[type];
    if (template) {
      this.addAnimation({
        id: `anim-${Date.now()}`,
        ...template,
        duration: this.options.defaultDuration,
        easing: this.options.easing,
        enabled: true,
      });
    }
  }

  playAnimation(animationId) {
    const animation = this.animations.get(animationId);
    if (!animation || !animation.enabled) return;

    this.activeAnimations.add(animationId);
    this.renderAnimations();

    const target = animation.target ? document.querySelector(`[data-overlay-id="${animation.target}"]`) : null;
    if (!target) return;

    // Create keyframes for CSS animation
    const keyframes = this.generateCSSKeyframes(animation);

    // Apply animation
    const animationName = `keyframe-anim-${animationId}`;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${animationName} {
        ${keyframes}
      }
    `;
    document.head.appendChild(style);

    target.style.animation = `${animationName} ${animation.duration}s ${animation.easing} forwards`;

    target.addEventListener('animationend', () => {
      this.stopAnimation(animationId);
      document.head.removeChild(style);
    }, { once: true });

    this.options.onAnimationPlay?.(animation);
  }

  stopAnimation(animationId) {
    const animation = this.animations.get(animationId);
    if (!animation) return;

    this.activeAnimations.delete(animationId);
    this.renderAnimations();

    const target = animation.target ? document.querySelector(`[data-overlay-id="${animation.target}"]`) : null;
    if (target) {
      target.style.animation = '';
    }

    this.options.onAnimationStop?.(animation);
  }

  playAllAnimations() {
    this.animations.forEach((animation, id) => {
      if (animation.enabled) {
        this.playAnimation(id);
      }
    });
  }

  stopAllAnimations() {
    this.activeAnimations.forEach(id => {
      this.stopAnimation(id);
    });
  }

  generateCSSKeyframes(animation) {
    return animation.keyframes
      .sort((a, b) => a.time - b.time)
      .map(keyframe => {
        const properties = Object.entries(keyframe.properties)
          .map(([prop, value]) => `${this.camelToKebab(prop)}: ${value}`)
          .join('; ');
        return `${keyframe.time * 100}% { ${properties}; }`;
      })
      .join('\n');
  }

  camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  addKeyframe(animationId, time, properties) {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.keyframes.push({ time, properties });
      animation.keyframes.sort((a, b) => a.time - b.time);
      this.renderAnimations();
    }
  }

  removeKeyframe(animationId, keyframeIndex) {
    const animation = this.animations.get(animationId);
    if (animation && animation.keyframes.length > 2) { // Keep at least 2 keyframes
      animation.keyframes.splice(keyframeIndex, 1);
      this.renderAnimations();
    }
  }

  setAnimationTarget(animationId, targetId) {
    this.updateAnimation(animationId, { target: targetId });
  }

  getAnimations() {
    return Array.from(this.animations.values());
  }

  getActiveAnimations() {
    return Array.from(this.activeAnimations);
  }

  exportAnimations() {
    return {
      animations: this.getAnimations(),
      version: '1.0',
      timestamp: new Date().toISOString(),
    };
  }

  importAnimations(data) {
    if (data.animations && Array.isArray(data.animations)) {
      data.animations.forEach(animation => {
        this.addAnimation(animation);
      });
    }
  }

  destroy() {
    this.stopAllAnimations();
    this.animations.clear();
    this.keyframes.clear();
    this.container.innerHTML = '';
  }
}
