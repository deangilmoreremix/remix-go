/**
 * Video Renderer - Production-ready video creation and export system
 * Handles rendering overlays, animations, and exporting final videos
 */

class VideoRenderer {
  constructor(options = {}) {
    this.options = {
      width: 1920,
      height: 1080,
      fps: 30,
      bitrate: '8000k',
      format: 'mp4',
      ...options
    };

    this.canvas = null;
    this.ctx = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.currentFrame = 0;
    this.totalFrames = 0;
    this.onProgress = options.onProgress || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onError = options.onError || (() => {});
  }

  /**
   * Initialize canvas for rendering
   */
  init() {
    // Create offscreen canvas for rendering
    this.canvas = new OffscreenCanvas(this.options.width, this.options.height);
    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    });

    // Set high quality rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  /**
   * Render video with overlays and animations
   */
  async renderVideo(videoElement, overlays = [], duration = null) {
    if (!this.canvas || !this.ctx) {
      this.init();
    }

    try {
      // Calculate video duration
      const videoDuration = duration || videoElement.duration;
      this.totalFrames = Math.ceil(videoDuration * this.options.fps);

      // Set up media recorder for final output
      this.setupMediaRecorder();

      // Start recording
      this.startRecording();

      // Render frame by frame
      for (let frame = 0; frame < this.totalFrames; frame++) {
        await this.renderFrame(videoElement, overlays, frame / this.options.fps);
        this.onProgress(frame / this.totalFrames);
      }

      // Stop recording
      this.stopRecording();

    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  /**
   * Render a single frame
   */
  async renderFrame(videoElement, overlays, currentTime) {
    // Set video to current time
    videoElement.currentTime = currentTime;
    await this.waitForVideoSeek(videoElement);

    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.options.width, this.options.height);

    // Draw video frame
    this.ctx.drawImage(videoElement, 0, 0, this.options.width, this.options.height);

    // Render overlays
    this.renderOverlays(overlays, currentTime);

    // Capture frame for recording
    const frame = await this.canvas.convertToBlob({ type: 'image/png' });
    this.recordedChunks.push(frame);
  }

  /**
   * Render overlays on the current frame
   */
  renderOverlays(overlays, currentTime) {
    overlays.forEach(overlay => {
      if (this.isOverlayVisible(overlay, currentTime)) {
        this.renderOverlay(overlay, currentTime);
      }
    });
  }

  /**
   * Check if overlay should be visible at current time
   */
  isOverlayVisible(overlay, currentTime) {
    const startTime = overlay.startTime || 0;
    const endTime = overlay.endTime || Infinity;
    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * Render individual overlay
   */
  renderOverlay(overlay, currentTime) {
    if (!this.ctx) {
      console.warn('Canvas context not initialized');
      return;
    }

    const { type, content, position, size, style, animation } = overlay;

    // Calculate animation progress
    const progress = animation ? this.calculateAnimationProgress(overlay, currentTime) : 1;

    // Apply transformations
    this.ctx.save();

    // Position overlay
    const x = position.x * this.options.width;
    const y = position.y * this.options.height;
    const width = size.width * this.options.width;
    const height = size.height * this.options.height;

    // Apply animation transformations
    if (animation) {
      this.applyAnimationTransform(animation, progress, x, y, width, height);
    }

    // Render based on type
    switch (type) {
      case 'text':
        this.renderTextOverlay(content, x, y, width, height, style);
        break;
      case 'image':
        this.renderImageOverlay(content, x, y, width, height, style);
        break;
      case 'shape':
        this.renderShapeOverlay(content, x, y, width, height, style);
        break;
      default:
        console.warn(`Unknown overlay type: ${type}`);
    }

    this.ctx.restore();
  }

  /**
   * Render text overlay
   */
  renderTextOverlay(text, x, y, width, height, style = {}) {
    this.ctx.font = `${style.fontSize || 48}px ${style.fontFamily || 'Arial'}`;
    this.ctx.fillStyle = style.color || '#ffffff';
    this.ctx.textAlign = style.textAlign || 'center';
    this.ctx.textBaseline = 'middle';

    // Add text stroke if specified
    if (style.strokeColor) {
      this.ctx.strokeStyle = style.strokeColor;
      this.ctx.lineWidth = style.strokeWidth || 2;
      this.ctx.strokeText(text, x + width / 2, y + height / 2);
    }

    // Add text shadow if specified
    if (style.shadowColor) {
      this.ctx.shadowColor = style.shadowColor;
      this.ctx.shadowBlur = style.shadowBlur || 4;
      this.ctx.shadowOffsetX = style.shadowOffsetX || 2;
      this.ctx.shadowOffsetY = style.shadowOffsetY || 2;
    }

    // Render text
    this.ctx.fillText(text, x + width / 2, y + height / 2);
  }

  /**
   * Render image overlay
   */
  renderImageOverlay(imageSrc, x, y, width, height, style = {}) {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Apply image filters
        if (style.filters) {
          this.applyImageFilters(style.filters);
        }

        // Draw image
        this.ctx.drawImage(img, x, y, width, height);
        resolve();
      };

      img.onerror = reject;
      img.src = imageSrc;
    });
  }

  /**
   * Render shape overlay
   */
  renderShapeOverlay(shape, x, y, width, height, style = {}) {
    this.ctx.fillStyle = style.fillColor || '#ffffff';
    this.ctx.strokeStyle = style.strokeColor || '#000000';
    this.ctx.lineWidth = style.strokeWidth || 1;

    switch (shape.type) {
      case 'rectangle':
        if (style.fillColor) this.ctx.fillRect(x, y, width, height);
        if (style.strokeColor) this.ctx.strokeRect(x, y, width, height);
        break;
      case 'circle':
        const radius = Math.min(width, height) / 2;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        if (style.fillColor) this.ctx.fill();
        if (style.strokeColor) this.ctx.stroke();
        break;
      // Add more shapes as needed
    }
  }

  /**
   * Calculate animation progress
   */
  calculateAnimationProgress(overlay, currentTime) {
    const startTime = overlay.startTime || 0;
    const endTime = overlay.endTime || overlay.startTime + overlay.duration || 1;
    const elapsed = currentTime - startTime;
    const duration = endTime - startTime;

    return Math.max(0, Math.min(1, elapsed / duration));
  }

  /**
   * Apply animation transformations
   */
  applyAnimationTransform(animation, progress, x, y, width, height) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // Apply easing
    const easedProgress = this.applyEasing(animation.easing || 'linear', progress);

    // Apply transformations
    if (animation.translateX) {
      const translateX = animation.translateX * easedProgress;
      this.ctx.translate(translateX, 0);
    }

    if (animation.translateY) {
      const translateY = animation.translateY * easedProgress;
      this.ctx.translate(0, translateY);
    }

    if (animation.scale) {
      const scale = 1 + (animation.scale - 1) * easedProgress;
      this.ctx.translate(centerX, centerY);
      this.ctx.scale(scale, scale);
      this.ctx.translate(-centerX, -centerY);
    }

    if (animation.rotate) {
      const rotation = animation.rotate * easedProgress * Math.PI / 180;
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(rotation);
      this.ctx.translate(-centerX, -centerY);
    }

    if (animation.opacity) {
      this.ctx.globalAlpha = animation.opacity * easedProgress;
    }
  }

  /**
   * Apply easing function
   */
  applyEasing(easing, progress) {
    switch (easing) {
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return progress * (2 - progress);
      case 'ease-in-out':
        return progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      default:
        return progress;
    }
  }

  /**
   * Apply image filters
   */
  applyImageFilters(filters) {
    let filterString = '';

    if (filters.brightness) {
      filterString += `brightness(${filters.brightness}) `;
    }

    if (filters.contrast) {
      filterString += `contrast(${filters.contrast}) `;
    }

    if (filters.saturate) {
      filterString += `saturate(${filters.saturate}) `;
    }

    if (filters.blur) {
      filterString += `blur(${filters.blur}px) `;
    }

    if (filterString) {
      this.ctx.filter = filterString.trim();
    }
  }

  /**
   * Set up MediaRecorder for final video output
   */
  setupMediaRecorder() {
    // Create a video stream from canvas
    const stream = this.canvas.captureStream(this.options.fps);

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: parseInt(this.options.bitrate)
    });

    this.recordedChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.finalizeVideo();
    };

    this.mediaRecorder.onerror = (error) => {
      this.onError(new Error(`MediaRecorder error: ${error.message}`));
    };
  }

  /**
   * Start recording
   */
  startRecording() {
    if (this.mediaRecorder && !this.isRecording) {
      this.mediaRecorder.start();
      this.isRecording = true;
    }
  }

  /**
   * Stop recording
   */
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  /**
   * Finalize video and create downloadable file
   */
  finalizeVideo() {
    try {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      this.onComplete({
        blob,
        url,
        size: blob.size,
        duration: this.totalFrames / this.options.fps
      });
    } catch (error) {
      this.onError(new Error(`Failed to finalize video: ${error.message}`));
    }
  }

  /**
   * Wait for video to seek to specific time
   */
  waitForVideoSeek(videoElement) {
    return new Promise((resolve) => {
      const checkSeeked = () => {
        if (Math.abs(videoElement.currentTime - videoElement.seekedTime) < 0.1) {
          resolve();
        } else {
          requestAnimationFrame(checkSeeked);
        }
      };

      videoElement.seekedTime = videoElement.currentTime;
      requestAnimationFrame(checkSeeked);
    });
  }

  /**
   * Export video with custom options
   */
  exportVideo(options = {}) {
    const exportOptions = { ...this.options, ...options };
    return new VideoRenderer(exportOptions);
  }

  /**
   * Check if value is serializable for localStorage
   */
  isSerializable(value) {
    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }

    if (this.canvas) {
      this.canvas = null;
      this.ctx = null;
    }

    this.recordedChunks = [];
    this.isRecording = false;
  }
}

// Export singleton instance
export const videoRenderer = new VideoRenderer();

// Export class for custom instances
export default VideoRenderer;

// Utility functions
export function createVideoRenderer(options = {}) {
  return new VideoRenderer(options);
}

export function renderVideoWithOverlays(videoElement, overlays, options = {}) {
  const renderer = new VideoRenderer({
    onProgress: options.onProgress,
    onComplete: options.onComplete,
    onError: options.onError,
    ...options
  });

  return renderer.renderVideo(videoElement, overlays, options.duration);
}