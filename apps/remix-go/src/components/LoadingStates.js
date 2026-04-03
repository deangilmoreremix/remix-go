export default function LoadingStates() {
  // Skeleton screens for different content types
  this.skeleton = {
    // Text skeleton
    text: (lines = 3, className = '') => {
      const container = document.createElement('div');
      container.className = `space-y-2 ${className}`;

      for (let i = 0; i < lines; i++) {
        const line = document.createElement('div');
        line.className = 'h-4 bg-white/10 rounded animate-pulse';
        line.style.width = `${Math.random() * 40 + 60}%`; // 60-100% width
        container.appendChild(line);
      }

      return container;
    },

    // Card skeleton
    card: (className = '') => {
      const card = document.createElement('div');
      card.className = `bg-white/5 rounded-lg p-4 animate-pulse ${className}`;

      card.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-white/10 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-white/10 rounded w-3/4"></div>
            <div class="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-white/10 rounded"></div>
          <div class="h-3 bg-white/10 rounded w-5/6"></div>
          <div class="h-3 bg-white/10 rounded w-4/6"></div>
        </div>
      `;

      return card;
    },

    // Video thumbnail skeleton
    videoThumbnail: (className = '') => {
      const thumbnail = document.createElement('div');
      thumbnail.className = `bg-white/5 rounded-lg overflow-hidden animate-pulse ${className}`;

      thumbnail.innerHTML = `
        <div class="aspect-video bg-white/10"></div>
        <div class="p-3 space-y-2">
          <div class="h-4 bg-white/10 rounded w-3/4"></div>
          <div class="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
      `;

      return thumbnail;
    },

    // Timeline skeleton
    timeline: (className = '') => {
      const timeline = document.createElement('div');
      timeline.className = `bg-white/5 rounded-lg p-4 animate-pulse ${className}`;

      timeline.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <div class="h-6 bg-white/10 rounded w-32"></div>
          <div class="flex gap-2">
            <div class="w-8 h-8 bg-white/10 rounded"></div>
            <div class="w-8 h-8 bg-white/10 rounded"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-12 bg-white/10 rounded"></div>
          <div class="h-12 bg-white/10 rounded"></div>
          <div class="h-12 bg-white/10 rounded w-3/4"></div>
        </div>
      `;

      return timeline;
    },

    // Form skeleton
    form: (fields = 4, className = '') => {
      const form = document.createElement('div');
      form.className = `space-y-4 ${className}`;

      for (let i = 0; i < fields; i++) {
        const field = document.createElement('div');
        field.className = 'space-y-2';

        const label = document.createElement('div');
        label.className = 'h-4 bg-white/10 rounded w-24 animate-pulse';
        field.appendChild(label);

        const input = document.createElement('div');
        input.className = 'h-10 bg-white/5 rounded animate-pulse';
        field.appendChild(input);

        form.appendChild(field);
      }

      const button = document.createElement('div');
      button.className = 'h-10 bg-violet-600/50 rounded animate-pulse w-full';
      form.appendChild(button);

      return form;
    },
  };

  // Progress indicators
  this.progress = {
    // Circular progress
    circular: (size = 40, className = '') => {
      const container = document.createElement('div');
      container.className = `inline-flex items-center justify-center ${className}`;

      container.innerHTML = `
        <svg class="animate-spin" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
          <circle
            cx="${size/2}" cy="${size/2}" r="${(size/2)-4}"
            stroke="currentColor" stroke-width="3" stroke-linecap="round"
            class="text-white/20"
          />
          <circle
            cx="${size/2}" cy="${size/2}" r="${(size/2)-4}"
            stroke="currentColor" stroke-width="3" stroke-linecap="round"
            class="text-violet-400 animate-pulse"
            stroke-dasharray="${2 * Math.PI * ((size/2)-4)}"
            stroke-dashoffset="${2 * Math.PI * ((size/2)-4) * 0.75}"
          />
        </svg>
      `;

      return container;
    },

    // Linear progress
    linear: (className = '') => {
      const progress = document.createElement('div');
      progress.className = `w-full bg-white/10 rounded-full h-2 overflow-hidden ${className}`;

      progress.innerHTML = `
        <div class="h-full bg-violet-500 rounded-full animate-pulse" style="width: 60%"></div>
      `;

      progress.updateProgress = (percentage) => {
        const bar = progress.querySelector('.bg-violet-500');
        if (bar) {
          bar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
      };

      return progress;
    },

    // Step progress
    steps: (currentStep, totalSteps, className = '') => {
      const container = document.createElement('div');
      container.className = `flex items-center gap-2 ${className}`;

      for (let i = 1; i <= totalSteps; i++) {
        const step = document.createElement('div');
        step.className = `w-2 h-2 rounded-full transition-colors ${
          i <= currentStep ? 'bg-violet-500' : 'bg-white/20'
        }`;
        container.appendChild(step);
      }

      container.updateStep = (step) => {
        const steps = container.querySelectorAll('.w-2');
        steps.forEach((s, index) => {
          s.className = `w-2 h-2 rounded-full transition-colors ${
            index < step ? 'bg-violet-500' : 'bg-white/20'
          }`;
        });
      };

      return container;
    },
  };

  // Loading overlays
  this.overlay = {
    // Page overlay
    page: (message = 'Loading...', className = '') => {
      const overlay = document.createElement('div');
      overlay.className = `fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${className}`;

      overlay.innerHTML = `
        <div class="text-center">
          <div class="inline-flex items-center justify-center mb-4">
            <svg class="animate-spin w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-white text-lg font-medium">${message}</p>
        </div>
      `;

      overlay.show = () => {
        document.body.appendChild(overlay);
      };

      overlay.hide = () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      };

      return overlay;
    },

    // Component overlay
    component: (element, message = 'Loading...', className = '') => {
      const overlay = document.createElement('div');
      overlay.className = `absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg z-10 ${className}`;

      overlay.innerHTML = `
        <div class="text-center">
          <div class="inline-flex items-center justify-center mb-2">
            <svg class="animate-spin w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-white/80 text-sm">${message}</p>
        </div>
      `;

      overlay.show = () => {
        if (!overlay.parentNode) {
          element.style.position = 'relative';
          element.appendChild(overlay);
        }
      };

      overlay.hide = () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      };

      return overlay;
    },
  };

  // Utility functions
  this.showSkeleton = (container, type, ...args) => {
    const skeleton = this.skeleton[type](...args);
    container.innerHTML = '';
    container.appendChild(skeleton);
    return skeleton;
  };

  this.showProgress = (container, type, ...args) => {
    const progress = this.progress[type](...args);
    container.appendChild(progress);
    return progress;
  };

  this.showOverlay = (type, ...args) => {
    const overlay = this.overlay[type](...args);
    overlay.show();
    return overlay;
  };

  // Initialize with some global styles
  this.initStyles = () => {
    if (document.getElementById('loading-styles')) return;

    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: .5;
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
  };

  // Auto-initialize
  if (typeof document !== 'undefined') {
    this.initStyles();
  }

  return this;
}

// Export singleton instance
const loadingStates = new LoadingStates();
export default loadingStates;

// Convenience functions
export const showSkeleton = loadingStates.showSkeleton.bind(loadingStates);
export const showProgress = loadingStates.showProgress.bind(loadingStates);
export const showOverlay = loadingStates.showOverlay.bind(loadingStates);
