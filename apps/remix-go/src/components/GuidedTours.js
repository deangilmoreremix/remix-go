export default class GuidedTours {
  constructor() {
    this.tours = new Map();
    this.activeTour = null;
    this.currentStep = 0;
    this.overlay = null;
    this.tooltip = null;
    this.spotlight = null;
    this.listeners = new Map();
  }

  createTour(id, steps, options = {}) {
    const tour = {
      id,
      steps,
      options: {
        showProgress: true,
        allowKeyboard: true,
        exitOnEscape: true,
        exitOnClick: false,
        ...options,
      },
      onComplete: options.onComplete,
      onExit: options.onExit,
    };

    this.tours.set(id, tour);
    return tour;
  }

  startTour(id) {
    const tour = this.tours.get(id);
    if (!tour) return;

    // Stop any active tour
    if (this.activeTour) {
      this.stopTour();
    }

    this.activeTour = tour;
    this.currentStep = 0;

    this.createOverlay();
    this.setupEventListeners();
    this.showStep(0);
  }

  stopTour() {
    if (!this.activeTour) return;

    this.destroyOverlay();
    this.cleanup();

    if (this.activeTour.onExit) {
      this.activeTour.onExit();
    }

    this.activeTour = null;
    this.currentStep = 0;
  }

  nextStep() {
    if (!this.activeTour) return;

    if (this.currentStep < this.activeTour.steps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    } else {
      this.completeTour();
    }
  }

  previousStep() {
    if (!this.activeTour || this.currentStep === 0) return;

    this.currentStep--;
    this.showStep(this.currentStep);
  }

  completeTour() {
    if (!this.activeTour) return;

    this.destroyOverlay();

    if (this.activeTour.onComplete) {
      this.activeTour.onComplete();
    }

    this.activeTour = null;
    this.currentStep = 0;
  }

  createOverlay() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'guided-tour-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-40';
    document.body.appendChild(this.overlay);

    // Create spotlight
    this.spotlight = document.createElement('div');
    this.spotlight.className = 'guided-tour-spotlight absolute z-50 pointer-events-none';
    this.overlay.appendChild(this.spotlight);

    // Create tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'guided-tour-tooltip absolute z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-xl max-w-sm';
    this.overlay.appendChild(this.tooltip);

    this.addStyles();
  }

  destroyOverlay() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
      this.spotlight = null;
      this.tooltip = null;
    }
  }

  addStyles() {
    if (document.getElementById('guided-tour-styles')) return;

    const style = document.createElement('style');
    style.id = 'guided-tour-styles';
    style.textContent = `
      .guided-tour-overlay {
        transition: opacity 0.3s ease;
      }

      .guided-tour-spotlight {
        border-radius: 8px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease;
      }

      .guided-tour-tooltip {
        transform: translateY(10px);
        opacity: 0;
        transition: all 0.3s ease;
      }

      .guided-tour-tooltip.visible {
        transform: translateY(0);
        opacity: 1;
      }

      .tour-progress {
        display: flex;
        gap: 4px;
        margin-bottom: 12px;
      }

      .tour-progress-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transition: background-color 0.3s ease;
      }

      .tour-progress-dot.active {
        background: rgba(139, 92, 246, 0.8);
      }

      .tour-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
      }

      .tour-button {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tour-button.primary {
        background: rgba(139, 92, 246, 0.8);
        color: white;
        border: none;
      }

      .tour-button.primary:hover {
        background: rgba(139, 92, 246, 1);
      }

      .tour-button.secondary {
        background: transparent;
        color: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .tour-button.secondary:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .tour-skip {
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        cursor: pointer;
        text-decoration: underline;
      }

      .tour-skip:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    `;
    document.head.appendChild(style);
  }

  showStep(stepIndex) {
    if (!this.activeTour || !this.spotlight || !this.tooltip) return;

    const step = this.activeTour.steps[stepIndex];
    if (!step) return;

    const targetElement = typeof step.target === 'string'
      ? document.querySelector(step.target)
      : step.target;

    if (!targetElement) {
      console.warn('Tour step target not found:', step.target);
      this.nextStep();
      return;
    }

    // Position spotlight
    this.positionSpotlight(targetElement, step);

    // Create tooltip content
    this.createTooltipContent(step, stepIndex);

    // Position tooltip
    this.positionTooltip(targetElement, step);

    // Scroll target into view if needed
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }

  positionSpotlight(element, step) {
    const rect = element.getBoundingClientRect();
    const padding = step.spotlightPadding || 8;

    this.spotlight.style.left = `${rect.left - padding}px`;
    this.spotlight.style.top = `${rect.top - padding}px`;
    this.spotlight.style.width = `${rect.width + (padding * 2)}px`;
    this.spotlight.style.height = `${rect.height + (padding * 2)}px`;
  }

  createTooltipContent(step, stepIndex) {
    const tour = this.activeTour;

    this.tooltip.innerHTML = `
      ${tour.options.showProgress ? `
        <div class="tour-progress">
          ${tour.steps.map((_, index) => `
            <div class="tour-progress-dot ${index === stepIndex ? 'active' : ''}"></div>
          `).join('')}
        </div>
      ` : ''}

      <div class="tour-content">
        ${step.title ? `<h3 class="text-lg font-semibold text-white mb-2">${step.title}</h3>` : ''}
        <p class="text-gray-300 text-sm leading-relaxed mb-4">${step.content}</p>
      </div>

      <div class="tour-navigation">
        <button class="tour-skip" id="tour-skip">Skip tour</button>
        <div class="flex gap-2">
          ${stepIndex > 0 ? `
            <button class="tour-button secondary" id="tour-prev">Back</button>
          ` : ''}
          <button class="tour-button primary" id="tour-next">
            ${stepIndex === tour.steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    const skipBtn = this.tooltip.querySelector('#tour-skip');
    const prevBtn = this.tooltip.querySelector('#tour-prev');
    const nextBtn = this.tooltip.querySelector('#tour-next');

    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.stopTour());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousStep());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    // Make tooltip visible
    requestAnimationFrame(() => {
      this.tooltip.classList.add('visible');
    });
  }

  positionTooltip(targetElement, step) {
    const rect = targetElement.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const placement = step.placement || 'bottom';

    let top, left;

    switch (placement) {
      case 'top':
        top = rect.top - tooltipRect.height - 16;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = rect.bottom + 16;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left - tooltipRect.width - 16;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + 16;
        break;
      default:
        top = rect.bottom + 16;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    }

    // Keep within viewport
    const margin = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < margin) left = margin;
    if (left + tooltipRect.width > viewportWidth - margin) {
      left = viewportWidth - tooltipRect.width - margin;
    }
    if (top < margin) top = margin;
    if (top + tooltipRect.height > viewportHeight - margin) {
      top = viewportHeight - tooltipRect.height - margin;
    }

    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }

  setupEventListeners() {
    if (!this.activeTour) return;

    const handleKeyDown = (e) => {
      if (this.activeTour.options.allowKeyboard) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextStep();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.previousStep();
        } else if (this.activeTour.options.exitOnEscape && e.key === 'Escape') {
          e.preventDefault();
          this.stopTour();
        }
      }
    };

    const handleClick = (e) => {
      if (this.activeTour.options.exitOnClick && !this.tooltip.contains(e.target)) {
        this.stopTour();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    this.listeners.set('keydown', handleKeyDown);
    this.listeners.set('click', handleClick);
  }

  cleanup() {
    this.listeners.forEach((listener, event) => {
      document.removeEventListener(event, listener);
    });
    this.listeners.clear();
  }

  // Predefined tours
  createWelcomeTour() {
    return this.createTour('welcome', [
      {
        target: '[data-tour="logo"]',
        title: 'Welcome to Remix Go!',
        content: 'This is your video editor dashboard. Let\'s take a quick tour to get you started.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="video-upload"]',
        title: 'Upload Your Video',
        content: 'Start by uploading a video file or pasting a URL to begin editing.',
        placement: 'right',
      },
      {
        target: '[data-tour="timeline"]',
        title: 'Timeline Editor',
        content: 'Use the timeline to add overlays, adjust timing, and create professional videos.',
        placement: 'top',
      },
      {
        target: '[data-tour="overlays-panel"]',
        title: 'Add Overlays',
        content: 'Add text, images, forms, and CTAs to make your videos interactive.',
        placement: 'left',
      },
      {
        target: '[data-tour="personalization"]',
        title: 'Personalization',
        content: 'Use tokens like {{FIRSTNAME}} to personalize videos for each viewer.',
        placement: 'right',
      },
      {
        target: '[data-tour="publish"]',
        title: 'Publish & Share',
        content: 'Export your video and generate embed codes for websites and email campaigns.',
        placement: 'top',
      },
    ], {
      onComplete: () => {
        console.log('Welcome tour completed!');
      },
    });
  }

  createEditorTour() {
    return this.createTour('editor', [
      {
        target: '[data-tour="video-player"]',
        title: 'Video Player',
        content: 'This is your main video player. Use the controls below to play, pause, and scrub through your video.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="timeline-controls"]',
        title: 'Timeline Controls',
        content: 'Zoom in/out, add markers, and control timeline playback from here.',
        placement: 'top',
      },
      {
        target: '[data-tour="track-headers"]',
        title: 'Track Headers',
        content: 'Each track represents a different layer. Click to select and modify track settings.',
        placement: 'right',
      },
      {
        target: '[data-tour="keyframes"]',
        title: 'Keyframe Animation',
        content: 'Create smooth animations by adding keyframes to overlay elements.',
        placement: 'left',
      },
    ]);
  }

  // Utility methods
  hasCompletedTour(tourId) {
    return localStorage.getItem(`remix-go-tour-${tourId}-completed`) === 'true';
  }

  markTourCompleted(tourId) {
    localStorage.setItem(`remix-go-tour-${tourId}-completed`, 'true');
  }

  resetTour(tourId) {
    localStorage.removeItem(`remix-go-tour-${tourId}-completed`);
  }
}

// Global instance
let guidedTours = null;

export function getGuidedTours() {
  if (!guidedTours) {
    guidedTours = new GuidedTours();
  }
  return guidedTours;
}

// Convenience functions
export function createTour(id, steps, options) {
  const tours = getGuidedTours();
  return tours.createTour(id, steps, options);
}

export function startTour(id) {
  const tours = getGuidedTours();
  tours.startTour(id);
}

export function stopTour() {
  const tours = getGuidedTours();
  tours.stopTour();
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    getGuidedTours();
  });
}

export default GuidedTours;
