export default function PreviewModal({
  content,
  type = 'video', // video, image, page, embed
  title = 'Preview',
  onClose,
  options = {}
}) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50';

  const previewContent = getPreviewContent(content, type, options);

  modal.innerHTML = `
    <div class="glass rounded-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">${title}</h3>
        <div class="flex items-center gap-3">
          ${getPreviewControls(type, options)}
          <button id="preview-close" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-hidden bg-black/20 rounded-lg">
        ${previewContent}
      </div>

      ${getPreviewFooter(type, options)}
    </div>
  `;

  // Event handlers
  modal.querySelector('#preview-close').addEventListener('click', () => {
    if (onClose) onClose();
    modal.remove();
  });

  // Type-specific event handlers
  setupPreviewHandlers(modal, type, content, options);

  return modal;
}

function getPreviewContent(content, type, options) {
  switch (type) {
    case 'video':
      return `
        <div class="w-full h-full flex items-center justify-center p-4">
          <video id="preview-video" controls class="max-w-full max-h-full rounded" ${options.autoplay ? 'autoplay' : ''}>
            <source src="${content.src || content}" type="${content.type || 'video/mp4'}">
            Your browser does not support the video tag.
          </video>
        </div>
      `;

    case 'image':
      return `
        <div class="w-full h-full flex items-center justify-center p-4">
          <img id="preview-image" src="${content.src || content}" alt="Preview"
            class="max-w-full max-h-full object-contain rounded">
        </div>
      `;

    case 'page':
      return `
        <div class="w-full h-full">
          <iframe id="preview-iframe" src="${content.src || content}"
            class="w-full h-full border-0 rounded" sandbox="allow-scripts allow-same-origin">
          </iframe>
        </div>
      `;

    case 'embed':
      return `
        <div class="w-full h-full flex items-center justify-center p-4">
          <div class="w-full max-w-4xl">
            <div id="embed-preview" class="bg-white rounded-lg overflow-hidden">
              ${content.html || content}
            </div>
          </div>
        </div>
      `;

    default:
      return `
        <div class="w-full h-full flex items-center justify-center p-4">
          <div class="text-center text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p>Preview not available for this content type</p>
          </div>
        </div>
      `;
  }
}

function getPreviewControls(type, options) {
  switch (type) {
    case 'video':
      return `
        <div class="flex items-center gap-2">
          <button id="preview-play" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button id="preview-pause" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          <span class="text-xs text-gray-400 mx-2">|</span>
          <select id="preview-speed" class="bg-white/10 text-white text-xs rounded px-2 py-1">
            <option value="0.5">0.5x</option>
            <option value="1" selected>1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      `;

    case 'image':
      return `
        <div class="flex items-center gap-2">
          <button id="preview-zoom-in" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M10 7v3m0 0v3m0-3h3m-3 0H7"/>
            </svg>
          </button>
          <button id="preview-zoom-out" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M13 10H7"/>
            </svg>
          </button>
          <button id="preview-fit" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5"/>
            </svg>
          </button>
        </div>
      `;

    case 'page':
      return `
        <div class="flex items-center gap-2">
          <select id="preview-device" class="bg-white/10 text-white text-xs rounded px-2 py-1">
            <option value="desktop" selected>Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
          <button id="preview-refresh" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      `;

    default:
      return '';
  }
}

function getPreviewFooter(type, options) {
  const actions = [];

  if (options.downloadable) {
    actions.push(`
      <button id="preview-download" class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Download
      </button>
    `);
  }

  if (options.shareable) {
    actions.push(`
      <button id="preview-share" class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        Share
      </button>
    `);
  }

  if (actions.length > 0) {
    return `
      <div class="flex gap-2 justify-center mt-4 pt-4 border-t border-white/10">
        ${actions.join('')}
      </div>
    `;
  }

  return '';
}

function setupPreviewHandlers(modal, type, content, options) {
  switch (type) {
    case 'video':
      const video = modal.querySelector('#preview-video');
      const playBtn = modal.querySelector('#preview-play');
      const pauseBtn = modal.querySelector('#preview-pause');
      const speedSelect = modal.querySelector('#preview-speed');

      if (playBtn) {
        playBtn.addEventListener('click', () => video.play());
      }
      if (pauseBtn) {
        pauseBtn.addEventListener('click', () => video.pause());
      }
      if (speedSelect) {
        speedSelect.addEventListener('change', (e) => {
          video.playbackRate = parseFloat(e.target.value);
        });
      }
      break;

    case 'image':
      const image = modal.querySelector('#preview-image');
      const zoomInBtn = modal.querySelector('#preview-zoom-in');
      const zoomOutBtn = modal.querySelector('#preview-zoom-out');
      const fitBtn = modal.querySelector('#preview-fit');

      let scale = 1;
      const updateScale = () => {
        image.style.transform = `scale(${scale})`;
      };

      if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
          scale = Math.min(scale * 1.2, 5);
          updateScale();
        });
      }
      if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
          scale = Math.max(scale / 1.2, 0.1);
          updateScale();
        });
      }
      if (fitBtn) {
        fitBtn.addEventListener('click', () => {
          scale = 1;
          updateScale();
        });
      }
      break;

    case 'page':
      const iframe = modal.querySelector('#preview-iframe');
      const deviceSelect = modal.querySelector('#preview-device');
      const refreshBtn = modal.querySelector('#preview-refresh');

      if (deviceSelect) {
        deviceSelect.addEventListener('change', (e) => {
          const device = e.target.value;
          const widths = { desktop: '100%', tablet: '768px', mobile: '375px' };
          iframe.style.width = widths[device] || '100%';
        });
      }
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          iframe.src = iframe.src;
        });
      }
      break;
  }

  // Common handlers
  const downloadBtn = modal.querySelector('#preview-download');
  const shareBtn = modal.querySelector('#preview-share');

  if (downloadBtn && options.downloadable) {
    downloadBtn.addEventListener('click', () => {
      if (type === 'image') {
        const link = document.createElement('a');
        link.href = modal.querySelector('#preview-image').src;
        link.download = 'preview-image.jpg';
        link.click();
      } else if (type === 'video') {
        // For videos, we'd need server-side processing
        alert('Video download not yet implemented');
      }
    });
  }

  if (shareBtn && options.shareable) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: options.shareTitle || 'Preview',
          text: options.shareText || 'Check out this preview',
          url: options.shareUrl || window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(options.shareUrl || window.location.href);
        alert('Link copied to clipboard!');
      }
    });
  }
}

// Convenience functions for different content types
export function previewVideo(src, options = {}) {
  const modal = PreviewModal({
    content: { src },
    type: 'video',
    title: 'Video Preview',
    ...options,
  });
  document.body.appendChild(modal);
  return modal;
}

export function previewImage(src, options = {}) {
  const modal = PreviewModal({
    content: { src },
    type: 'image',
    title: 'Image Preview',
    ...options,
  });
  document.body.appendChild(modal);
  return modal;
}

export function previewPage(url, options = {}) {
  const modal = PreviewModal({
    content: { src: url },
    type: 'page',
    title: 'Page Preview',
    ...options,
  });
  document.body.appendChild(modal);
  return modal;
}

export function previewEmbed(html, options = {}) {
  const modal = PreviewModal({
    content: { html },
    type: 'embed',
    title: 'Embed Preview',
    ...options,
  });
  document.body.appendChild(modal);
  return modal;
}
