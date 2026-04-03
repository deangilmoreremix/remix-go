import { videoRenderer } from '../lib/videoRenderer.js';

export default function VideoExport({ project, onExportComplete, onExportError }) {
  const container = document.createElement('div');
  container.className = 'video-export';

  let exportProgress = 0;
  let isExporting = false;
  let exportStatus = 'ready';

  container.innerHTML = `
    <div class="export-container bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Export Video</h3>
        <div id="export-status" class="text-sm text-gray-400">${getStatusText()}</div>
      </div>

      <div class="export-options mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="option-group">
            <label class="block text-sm font-medium text-gray-300 mb-2">Resolution</label>
            <select id="resolution-select" class="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
              <option value="720p">720p HD (1280x720)</option>
              <option value="1080p" selected>1080p Full HD (1920x1080)</option>
              <option value="4k">4K Ultra HD (3840x2160)</option>
            </select>
          </div>

          <div class="option-group">
            <label class="block text-sm font-medium text-gray-300 mb-2">Format</label>
            <select id="format-select" class="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
              <option value="webm" selected>WebM (Universal)</option>
              <option value="mp4">MP4 (H.264)</option>
            </select>
          </div>

          <div class="option-group">
            <label class="block text-sm font-medium text-gray-300 mb-2">Quality</label>
            <select id="quality-select" class="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white">
              <option value="low">Low (Fast)</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High (Slow)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="export-progress mb-6" id="progress-container" style="display: none;">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-300">Exporting video...</span>
          <span id="progress-text" class="text-sm text-white">0%</span>
        </div>
        <div class="w-full bg-white/20 rounded-full h-2">
          <div id="progress-bar" class="bg-violet-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <div class="text-xs text-gray-400 mt-1">
          <span id="progress-details">Preparing export...</span>
        </div>
      </div>

      <div class="export-actions flex gap-3">
        <button id="export-btn" class="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export Video
          </span>
        </button>

        <button id="preview-btn" class="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </button>
      </div>

      <div id="export-result" class="mt-4" style="display: none;">
        <div class="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-400 mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="font-medium">Export Complete!</span>
          </div>
          <p class="text-sm text-green-300 mb-3">Your video has been exported successfully.</p>
          <div class="flex gap-2">
            <button id="download-btn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
              Download Video
            </button>
            <button id="share-btn" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm">
              Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  function getStatusText() {
    switch (exportStatus) {
      case 'ready': return 'Ready to export';
      case 'exporting': return 'Exporting...';
      case 'complete': return 'Export complete';
      case 'error': return 'Export failed';
      default: return 'Unknown status';
    }
  }

  function updateStatus(newStatus) {
    exportStatus = newStatus;
    const statusEl = container.querySelector('#export-status');
    if (statusEl) {
      statusEl.textContent = getStatusText();
      statusEl.className = `text-sm ${
        newStatus === 'error' ? 'text-red-400' :
        newStatus === 'complete' ? 'text-green-400' : 'text-gray-400'
      }`;
    }
  }

  function updateProgress(progress, details = '') {
    exportProgress = progress;
    const progressBar = container.querySelector('#progress-bar');
    const progressText = container.querySelector('#progress-text');
    const progressDetails = container.querySelector('#progress-details');

    if (progressBar) progressBar.style.width = `${progress * 100}%`;
    if (progressText) progressText.textContent = `${Math.round(progress * 100)}%`;
    if (progressDetails) progressDetails.textContent = details;
  }

  function showProgress(show = true) {
    const progressContainer = container.querySelector('#progress-container');
    if (progressContainer) {
      progressContainer.style.display = show ? 'block' : 'none';
    }
  }

  function showResult(show = true, result = null) {
    const resultContainer = container.querySelector('#export-result');
    if (resultContainer) {
      resultContainer.style.display = show ? 'block' : 'none';

      if (result && show) {
        const downloadBtn = container.querySelector('#download-btn');
        const shareBtn = container.querySelector('#share-btn');

        if (downloadBtn) {
          downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = result.url;
            a.download = `remix-go-export-${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        }

        if (shareBtn) {
          shareBtn.onclick = () => {
            // Implement sharing logic
            navigator.share?.({
              title: 'Remix Go Video',
              url: result.url
            });
          };
        }
      }
    }
  }

  // Event listeners
  const exportBtn = container.querySelector('#export-btn');
  const previewBtn = container.querySelector('#preview-btn');

  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      if (isExporting) return;

      try {
        isExporting = true;
        updateStatus('exporting');
        showProgress(true);
        showResult(false);

        exportBtn.disabled = true;
        exportBtn.innerHTML = `
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </span>
        `;

        // Get export options
        const resolution = container.querySelector('#resolution-select').value;
        const format = container.querySelector('#format-select').value;
        const quality = container.querySelector('#quality-select').value;

        // Calculate dimensions
        let width, height;
        switch (resolution) {
          case '720p':
            width = 1280; height = 720;
            break;
          case '4k':
            width = 3840; height = 2160;
            break;
          default: // 1080p
            width = 1920; height = 1080;
        }

        // Calculate bitrate based on quality
        let bitrate;
        switch (quality) {
          case 'low':
            bitrate = '2000k';
            break;
          case 'high':
            bitrate = '12000k';
            break;
          default: // medium
            bitrate = '8000k';
        }

        // Get video element (assuming it's available in the parent context)
        const videoElement = document.querySelector('video');
        if (!videoElement) {
          throw new Error('No video element found to export');
        }

        // Create renderer with options
        const renderer = videoRenderer.exportVideo({
          width,
          height,
          fps: 30,
          bitrate,
          format,
          onProgress: (progress) => {
            updateProgress(progress, `Rendering frame ${Math.round(progress * 100)}%`);
          },
          onComplete: (result) => {
            updateStatus('complete');
            showProgress(false);
            showResult(true, result);
            exportBtn.disabled = false;
            exportBtn.innerHTML = `
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export Complete
              </span>
            `;
            isExporting = false;

            if (onExportComplete) {
              onExportComplete(result);
            }
          },
          onError: (error) => {
            updateStatus('error');
            showProgress(false);
            exportBtn.disabled = false;
            exportBtn.innerHTML = `
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Export Failed
              </span>
            `;
            isExporting = false;

            if (onExportError) {
              onExportError(error);
            }
          }
        });

        // Start export
        await renderer.renderVideo(videoElement, project?.overlays || []);

      } catch (error) {
        console.error('Export failed:', error);
        updateStatus('error');
        showProgress(false);
        exportBtn.disabled = false;
        exportBtn.innerHTML = `
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Try Again
          </span>
        `;
        isExporting = false;

        if (onExportError) {
          onExportError(error);
        }
      }
    });
  }

  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      // Preview functionality - could show a modal with export settings preview
      alert('Preview functionality coming soon!');
    });
  }

  return container;
}