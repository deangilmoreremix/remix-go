const tracks = [];
let mediaElement = null;
let isPlaying = false;
let currentTimeValue = 0;
let durationValue = 0;

function Popcorn(elementOrId) {
  if (typeof elementOrId === 'string') {
    mediaElement = document.getElementById(elementOrId);
  } else {
    mediaElement = elementOrId;
  }

  if (mediaElement) {
    mediaElement.addEventListener('timeupdate', () => {
      currentTimeValue = mediaElement.currentTime;
      checkTracks();
    });
    mediaElement.addEventListener('loadedmetadata', () => {
      durationValue = mediaElement.duration;
    });
    mediaElement.addEventListener('play', () => { isPlaying = true; });
    mediaElement.addEventListener('pause', () => { isPlaying = false; });
    mediaElement.addEventListener('ended', () => { isPlaying = false; });
  }

  const instance = {
    _tracks: tracks,
    _media: mediaElement,

    plugin(name, factory) {
      if (typeof factory === 'function') {
        Popcorn._plugins[name] = factory;
      }
    },

    text(options) {
      return addTrack({ type: 'text', ...options });
    },

    form(options) {
      return addTrack({ type: 'form', ...options });
    },

    image(options) {
      return addTrack({ type: 'image', ...options });
    },

    popup(options) {
      return addTrack({ type: 'popup', ...options });
    },

    code(options) {
      return addTrack({ type: 'code', ...options });
    },

    footnote(options) {
      return addTrack({ type: 'footnote', ...options });
    },

    play() {
      if (mediaElement) mediaElement.play();
      isPlaying = true;
      return instance;
    },

    pause() {
      if (mediaElement) mediaElement.pause();
      isPlaying = false;
      return instance;
    },

    currentTime(time) {
      if (time !== undefined && mediaElement) {
        mediaElement.currentTime = time;
        currentTimeValue = time;
        return instance;
      }
      return currentTimeValue;
    },

    duration() {
      return durationValue || (mediaElement ? mediaElement.duration : 0);
    },

    emit(eventType, data) {
      const event = new CustomEvent(`popcorn-${eventType}`, { detail: data });
      document.dispatchEvent(event);
      return instance;
    },

    on(eventType, handler) {
      document.addEventListener(`popcorn-${eventType}`, (e) => handler(e.detail));
      return instance;
    },

    off(eventType, handler) {
      document.removeEventListener(`popcorn-${eventType}`, handler);
      return instance;
    },

    interactive: true,

    destroy() {
      tracks.length = 0;
      if (mediaElement) {
        mediaElement.pause();
      }
      mediaElement = null;
    },
  };

  return instance;
}

Popcorn._plugins = {};

Popcorn.plugin = function(name, definition) {
  Popcorn._plugins[name] = definition;
};

Popcorn.dom = {
  find: function(selector) {
    if (typeof selector === 'string') return document.querySelector(selector);
    return selector;
  },
};

function addTrack(track) {
  track.id = 'track-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  track._active = false;
  track._container = null;
  tracks.push(track);
  return track;
}

function checkTracks() {
  tracks.forEach(track => {
    const start = track.start || 0;
    const end = track.end || Infinity;
    const shouldBeActive = currentTimeValue >= start && currentTimeValue < end;

    if (shouldBeActive && !track._active) {
      activateTrack(track);
    } else if (!shouldBeActive && track._active) {
      deactivateTrack(track);
    }
  });
}

function activateTrack(track) {
  track._active = true;

  const target = typeof track.target === 'string'
    ? document.getElementById(track.target) || document.querySelector('#' + track.target)
    : track.target;

  if (!target) return;

  const container = document.createElement('div');
  container.className = 'popcorn-track';
  container.dataset.trackId = track.id;
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '10';

  if (track.type === 'text') {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.top = track.top || '10%';
    el.style.left = track.left || '10%';
    el.style.width = track.width || '80%';
    el.style.color = track.fontColor || '#fff';
    el.style.fontSize = (track.fontSize || 100) + '%';
    el.style.textAlign = track.textAlign || 'center';
    el.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    el.style.pointerEvents = 'auto';
    el.innerHTML = track.text || '';
    container.appendChild(el);
  } else if (track.type === 'image') {
    const el = document.createElement('img');
    el.src = track.src || '';
    el.style.position = 'absolute';
    el.style.top = track.top || '0';
    el.style.left = track.left || '0';
    el.style.width = track.width || '100%';
    el.style.pointerEvents = 'auto';
    if (track.click?.href) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => window.open(track.click.href, '_blank'));
    }
    container.appendChild(el);
  } else if (track.type === 'form') {
    const el = document.createElement('div');
    el.className = 'popcorn-form-overlay';
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.background = 'rgba(0,0,0,0.8)';
    el.style.pointerEvents = 'auto';

    const form = document.createElement('form');
    form.style.cssText = 'background:rgba(30,30,50,0.95);padding:24px;border-radius:12px;max-width:400px;width:90%;display:flex;flex-direction:column;gap:12px;';

    if (track.caption) {
      const caption = document.createElement('p');
      caption.textContent = track.caption;
      caption.style.cssText = 'color:#fff;font-size:16px;margin:0 0 8px;text-align:center;';
      form.appendChild(caption);
    }

    (track.elements || []).forEach(field => {
      const input = document.createElement('input');
      input.type = field.type === 'email' ? 'email' : 'text';
      input.name = field.token || field.label;
      input.placeholder = field.label || 'Enter value';
      input.style.cssText = 'padding:10px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:rgba(255,255,255,0.1);color:#fff;font-size:14px;';
      form.appendChild(input);
    });

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = track.btnText || 'Submit';
    btn.style.cssText = 'padding:12px;border:none;border-radius:6px;background:#7c3aed;color:#fff;font-weight:bold;cursor:pointer;font-size:14px;';
    form.appendChild(btn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      if (track.webhook) {
        fetch(track.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).catch(() => {});
      }

      if (track._context) track._context.play();
      container.style.display = 'none';
    });

    el.appendChild(form);
    container.appendChild(el);

    if (mediaElement) {
      mediaElement.pause();
    }
  }

  track._container = container;
  target.appendChild(container);
}

function deactivateTrack(track) {
  track._active = false;
  if (track._container) {
    track._container.remove();
    track._container = null;
  }
}

if (typeof window !== 'undefined') {
  window.Popcorn = Popcorn;
}

export default Popcorn;
