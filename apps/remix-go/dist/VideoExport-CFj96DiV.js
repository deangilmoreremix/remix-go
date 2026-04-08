class b {
  constructor(e = {}) {
    this.options = {
      width: 1920,
      height: 1080,
      fps: 30,
      bitrate: "8000k",
      format: "mp4",
      ...e
    }, this.canvas = null, this.ctx = null, this.mediaRecorder = null, this.recordedChunks = [], this.isRecording = !1, this.currentFrame = 0, this.totalFrames = 0, this.onProgress = e.onProgress || (() => {
    }), this.onComplete = e.onComplete || (() => {
    }), this.onError = e.onError || (() => {
    });
  }
  /**
   * Initialize canvas for rendering
   */
  init() {
    this.canvas = new OffscreenCanvas(this.options.width, this.options.height), this.ctx = this.canvas.getContext("2d", {
      alpha: !1,
      desynchronized: !0,
      willReadFrequently: !1
    }), this.ctx.imageSmoothingEnabled = !0, this.ctx.imageSmoothingQuality = "high";
  }
  /**
   * Render video with overlays and animations
   */
  async renderVideo(e, t = [], s = null) {
    (!this.canvas || !this.ctx) && this.init();
    try {
      const i = s || e.duration;
      this.totalFrames = Math.ceil(i * this.options.fps), this.setupMediaRecorder(), this.startRecording();
      for (let o = 0; o < this.totalFrames; o++)
        await this.renderFrame(e, t, o / this.options.fps), this.onProgress(o / this.totalFrames);
      this.stopRecording();
    } catch (i) {
      throw this.onError(i), i;
    }
  }
  /**
   * Render a single frame
   */
  async renderFrame(e, t, s) {
    e.currentTime = s, await this.waitForVideoSeek(e), this.ctx.fillStyle = "#000000", this.ctx.fillRect(0, 0, this.options.width, this.options.height), this.ctx.drawImage(e, 0, 0, this.options.width, this.options.height), this.renderOverlays(t, s);
    const i = await this.canvas.convertToBlob({ type: "image/png" });
    this.recordedChunks.push(i);
  }
  /**
   * Render overlays on the current frame
   */
  renderOverlays(e, t) {
    e.forEach((s) => {
      this.isOverlayVisible(s, t) && this.renderOverlay(s, t);
    });
  }
  /**
   * Check if overlay should be visible at current time
   */
  isOverlayVisible(e, t) {
    const s = e.startTime || 0, i = e.endTime || 1 / 0;
    return t >= s && t <= i;
  }
  /**
   * Render individual overlay
   */
  renderOverlay(e, t) {
    if (!this.ctx) {
      console.warn("Canvas context not initialized");
      return;
    }
    const { type: s, content: i, position: o, size: r, style: n, animation: h } = e, l = h ? this.calculateAnimationProgress(e, t) : 1;
    this.ctx.save();
    const c = o.x * this.options.width, d = o.y * this.options.height, m = r.width * this.options.width, a = r.height * this.options.height;
    switch (h && this.applyAnimationTransform(h, l, c, d, m, a), s) {
      case "text":
        this.renderTextOverlay(i, c, d, m, a, n);
        break;
      case "image":
        this.renderImageOverlay(i, c, d, m, a, n);
        break;
      case "shape":
        this.renderShapeOverlay(i, c, d, m, a, n);
        break;
      default:
        console.warn(`Unknown overlay type: ${s}`);
    }
    this.ctx.restore();
  }
  /**
   * Render text overlay
   */
  renderTextOverlay(e, t, s, i, o, r = {}) {
    this.ctx.font = `${r.fontSize || 48}px ${r.fontFamily || "Arial"}`, this.ctx.fillStyle = r.color || "#ffffff", this.ctx.textAlign = r.textAlign || "center", this.ctx.textBaseline = "middle", r.strokeColor && (this.ctx.strokeStyle = r.strokeColor, this.ctx.lineWidth = r.strokeWidth || 2, this.ctx.strokeText(e, t + i / 2, s + o / 2)), r.shadowColor && (this.ctx.shadowColor = r.shadowColor, this.ctx.shadowBlur = r.shadowBlur || 4, this.ctx.shadowOffsetX = r.shadowOffsetX || 2, this.ctx.shadowOffsetY = r.shadowOffsetY || 2), this.ctx.fillText(e, t + i / 2, s + o / 2);
  }
  /**
   * Render image overlay
   */
  renderImageOverlay(e, t, s, i, o, r = {}) {
    const n = new Image();
    return n.crossOrigin = "anonymous", new Promise((h, l) => {
      n.onload = () => {
        r.filters && this.applyImageFilters(r.filters), this.ctx.drawImage(n, t, s, i, o), h();
      }, n.onerror = l, n.src = e;
    });
  }
  /**
   * Render shape overlay
   */
  renderShapeOverlay(e, t, s, i, o, r = {}) {
    switch (this.ctx.fillStyle = r.fillColor || "#ffffff", this.ctx.strokeStyle = r.strokeColor || "#000000", this.ctx.lineWidth = r.strokeWidth || 1, e.type) {
      case "rectangle":
        r.fillColor && this.ctx.fillRect(t, s, i, o), r.strokeColor && this.ctx.strokeRect(t, s, i, o);
        break;
      case "circle":
        const n = Math.min(i, o) / 2, h = t + i / 2, l = s + o / 2;
        this.ctx.beginPath(), this.ctx.arc(h, l, n, 0, 2 * Math.PI), r.fillColor && this.ctx.fill(), r.strokeColor && this.ctx.stroke();
        break;
    }
  }
  /**
   * Calculate animation progress
   */
  calculateAnimationProgress(e, t) {
    const s = e.startTime || 0, i = e.endTime || e.startTime + e.duration || 1, o = t - s, r = i - s;
    return Math.max(0, Math.min(1, o / r));
  }
  /**
   * Apply animation transformations
   */
  applyAnimationTransform(e, t, s, i, o, r) {
    const n = s + o / 2, h = i + r / 2, l = this.applyEasing(e.easing || "linear", t);
    if (e.translateX) {
      const c = e.translateX * l;
      this.ctx.translate(c, 0);
    }
    if (e.translateY) {
      const c = e.translateY * l;
      this.ctx.translate(0, c);
    }
    if (e.scale) {
      const c = 1 + (e.scale - 1) * l;
      this.ctx.translate(n, h), this.ctx.scale(c, c), this.ctx.translate(-n, -h);
    }
    if (e.rotate) {
      const c = e.rotate * l * Math.PI / 180;
      this.ctx.translate(n, h), this.ctx.rotate(c), this.ctx.translate(-n, -h);
    }
    e.opacity && (this.ctx.globalAlpha = e.opacity * l);
  }
  /**
   * Apply easing function
   */
  applyEasing(e, t) {
    switch (e) {
      case "ease-in":
        return t * t;
      case "ease-out":
        return t * (2 - t);
      case "ease-in-out":
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t;
    }
  }
  /**
   * Apply image filters
   */
  applyImageFilters(e) {
    let t = "";
    e.brightness && (t += `brightness(${e.brightness}) `), e.contrast && (t += `contrast(${e.contrast}) `), e.saturate && (t += `saturate(${e.saturate}) `), e.blur && (t += `blur(${e.blur}px) `), t && (this.ctx.filter = t.trim());
  }
  /**
   * Set up MediaRecorder for final video output
   */
  setupMediaRecorder() {
    const e = this.canvas.captureStream(this.options.fps);
    this.mediaRecorder = new MediaRecorder(e, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: parseInt(this.options.bitrate)
    }), this.recordedChunks = [], this.mediaRecorder.ondataavailable = (t) => {
      t.data.size > 0 && this.recordedChunks.push(t.data);
    }, this.mediaRecorder.onstop = () => {
      this.finalizeVideo();
    }, this.mediaRecorder.onerror = (t) => {
      this.onError(new Error(`MediaRecorder error: ${t.message}`));
    };
  }
  /**
   * Start recording
   */
  startRecording() {
    this.mediaRecorder && !this.isRecording && (this.mediaRecorder.start(), this.isRecording = !0);
  }
  /**
   * Stop recording
   */
  stopRecording() {
    this.mediaRecorder && this.isRecording && (this.mediaRecorder.stop(), this.isRecording = !1);
  }
  /**
   * Finalize video and create downloadable file
   */
  finalizeVideo() {
    try {
      const e = new Blob(this.recordedChunks, { type: "video/webm" }), t = URL.createObjectURL(e);
      this.onComplete({
        blob: e,
        url: t,
        size: e.size,
        duration: this.totalFrames / this.options.fps
      });
    } catch (e) {
      this.onError(new Error(`Failed to finalize video: ${e.message}`));
    }
  }
  /**
   * Wait for video to seek to specific time
   */
  waitForVideoSeek(e) {
    return new Promise((t) => {
      const s = () => {
        Math.abs(e.currentTime - e.seekedTime) < 0.1 ? t() : requestAnimationFrame(s);
      };
      e.seekedTime = e.currentTime, requestAnimationFrame(s);
    });
  }
  /**
   * Export video with custom options
   */
  exportVideo(e = {}) {
    const t = { ...this.options, ...e };
    return new b(t);
  }
  /**
   * Check if value is serializable for localStorage
   */
  isSerializable(e) {
    try {
      return JSON.stringify(e), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Clean up resources
   */
  dispose() {
    this.mediaRecorder && this.isRecording && (this.mediaRecorder.stop(), this.isRecording = !1), this.canvas && (this.canvas = null, this.ctx = null), this.recordedChunks = [], this.isRecording = !1;
  }
}
const k = new b();
function R({ project: w, onExportComplete: e, onExportError: t }) {
  const s = document.createElement("div");
  s.className = "video-export";
  let i = !1, o = "ready";
  s.innerHTML = `
    <div class="export-container bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Export Video</h3>
        <div id="export-status" class="text-sm text-gray-400">${r()}</div>
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
  function r() {
    switch (o) {
      case "ready":
        return "Ready to export";
      case "exporting":
        return "Exporting...";
      case "complete":
        return "Export complete";
      case "error":
        return "Export failed";
      default:
        return "Unknown status";
    }
  }
  function n(a) {
    o = a;
    const p = s.querySelector("#export-status");
    p && (p.textContent = r(), p.className = `text-sm ${a === "error" ? "text-red-400" : a === "complete" ? "text-green-400" : "text-gray-400"}`);
  }
  function h(a, p = "") {
    const g = s.querySelector("#progress-bar"), f = s.querySelector("#progress-text"), x = s.querySelector("#progress-details");
    g && (g.style.width = `${a * 100}%`), f && (f.textContent = `${Math.round(a * 100)}%`), x && (x.textContent = p);
  }
  function l(a = !0) {
    const p = s.querySelector("#progress-container");
    p && (p.style.display = a ? "block" : "none");
  }
  function c(a = !0, p = null) {
    const g = s.querySelector("#export-result");
    if (g && (g.style.display = a ? "block" : "none", p && a)) {
      const f = s.querySelector("#download-btn"), x = s.querySelector("#share-btn");
      f && (f.onclick = () => {
        const u = document.createElement("a");
        u.href = p.url, u.download = `remix-go-export-${Date.now()}.webm`, document.body.appendChild(u), u.click(), document.body.removeChild(u);
      }), x && (x.onclick = () => {
        var u;
        (u = navigator.share) == null || u.call(navigator, {
          title: "Remix Go Video",
          url: p.url
        });
      });
    }
  }
  const d = s.querySelector("#export-btn"), m = s.querySelector("#preview-btn");
  return d && d.addEventListener("click", async () => {
    if (!i)
      try {
        i = !0, n("exporting"), l(!0), c(!1), d.disabled = !0, d.innerHTML = `
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </span>
        `;
        const a = s.querySelector("#resolution-select").value, p = s.querySelector("#format-select").value, g = s.querySelector("#quality-select").value;
        let f, x;
        switch (a) {
          case "720p":
            f = 1280, x = 720;
            break;
          case "4k":
            f = 3840, x = 2160;
            break;
          default:
            f = 1920, x = 1080;
        }
        let u;
        switch (g) {
          case "low":
            u = "2000k";
            break;
          case "high":
            u = "12000k";
            break;
          default:
            u = "8000k";
        }
        const y = document.querySelector("video");
        if (!y)
          throw new Error("No video element found to export");
        await k.exportVideo({
          width: f,
          height: x,
          fps: 30,
          bitrate: u,
          format: p,
          onProgress: (v) => {
            h(v, `Rendering frame ${Math.round(v * 100)}%`);
          },
          onComplete: (v) => {
            n("complete"), l(!1), c(!0, v), d.disabled = !1, d.innerHTML = `
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export Complete
              </span>
            `, i = !1, e && e(v);
          },
          onError: (v) => {
            n("error"), l(!1), d.disabled = !1, d.innerHTML = `
              <span class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Export Failed
              </span>
            `, i = !1, t && t(v);
          }
        }).renderVideo(y, (w == null ? void 0 : w.overlays) || []);
      } catch (a) {
        console.error("Export failed:", a), n("error"), l(!1), d.disabled = !1, d.innerHTML = `
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Try Again
          </span>
        `, i = !1, t && t(a);
      }
  }), m && m.addEventListener("click", () => {
    alert("Preview functionality coming soon!");
  }), s;
}
export {
  R as default
};
