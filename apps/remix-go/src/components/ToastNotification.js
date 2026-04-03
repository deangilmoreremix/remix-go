export default function ToastNotification({ type = 'info', title, message, duration = 3000, onClose }) {
  const toast = document.createElement('div');
  toast.className = `fixed z-50 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 transform translate-x-full`;

  const typeConfig = {
    success: { icon: '✅', bg: 'bg-green-600/90', border: 'border-green-500/50' },
    error: { icon: '❌', bg: 'bg-red-600/90', border: 'border-red-500/50' },
    warning: { icon: '⚠️', bg: 'bg-yellow-600/90', border: 'border-yellow-500/50' },
    info: { icon: 'ℹ️', bg: 'bg-blue-600/90', border: 'border-blue-500/50' },
    loading: { icon: '⏳', bg: 'bg-violet-600/90', border: 'border-violet-500/50' },
  };

  const config = typeConfig[type] || typeConfig.info;

  toast.classList.add(config.bg, `border`, config.border);
  toast.style.cssText += `right: 1rem; top: 1rem; min-width: 300px; max-width: 500px;`;

  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 text-xl">${config.icon}</div>
      <div class="flex-1 min-w-0">
        ${title ? `<h4 class="font-semibold text-white text-sm mb-1">${title}</h4>` : ''}
        <p class="text-white/90 text-sm leading-relaxed">${message}</p>
      </div>
      <button class="flex-shrink-0 text-white/70 hover:text-white transition-colors" id="toast-close">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    ${type === 'loading' ? `
      <div class="mt-3">
        <div class="w-full bg-white/20 rounded-full h-1">
          <div class="bg-white h-1 rounded-full animate-pulse" style="width: 60%"></div>
        </div>
      </div>
    ` : ''}
  `;

  // Add to DOM
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full');
  });

  // Auto-dismiss (unless loading type)
  let dismissTimeout;
  if (type !== 'loading' && duration > 0) {
    dismissTimeout = setTimeout(() => {
      dismiss();
    }, duration);
  }

  // Event handlers
  const closeBtn = toast.querySelector('#toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      clearTimeout(dismissTimeout);
      dismiss();
    });
  }

  // Click to dismiss
  toast.addEventListener('click', (e) => {
    if (e.target === toast || e.target.closest('#toast-close')) return;
    clearTimeout(dismissTimeout);
    dismiss();
  });

  function dismiss() {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      if (onClose) onClose();
    }, 300);
  }

  // Public API
  toast.updateMessage = (newMessage) => {
    const messageEl = toast.querySelector('p');
    if (messageEl) messageEl.textContent = newMessage;
  };

  toast.updateProgress = (progress) => {
    const progressBar = toast.querySelector('.bg-white');
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  toast.dismiss = dismiss;

  return toast;
}

// Global toast manager
class ToastManager {
  constructor() {
    this.toasts = new Set();
    this.container = null;
    this.maxToasts = 5;
  }

  init() {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed top-4 right-4 z-50 space-y-2 pointer-events-none';
      document.body.appendChild(this.container);
    }
  }

  show(options) {
    this.init();

    // Limit number of toasts
    if (this.toasts.size >= this.maxToasts) {
      const oldestToast = this.toasts.values().next().value;
      oldestToast.dismiss();
      this.toasts.delete(oldestToast);
    }

    const toast = ToastNotification(options);
    this.container.appendChild(toast);
    this.toasts.add(toast);

    // Auto-cleanup when toast is removed
    const originalDismiss = toast.dismiss;
    toast.dismiss = () => {
      this.toasts.delete(toast);
      originalDismiss();
    };

    return toast;
  }

  success(message, title = 'Success', options = {}) {
    return this.show({ type: 'success', title, message, ...options });
  }

  error(message, title = 'Error', options = {}) {
    return this.show({ type: 'error', title, message, ...options });
  }

  warning(message, title = 'Warning', options = {}) {
    return this.show({ type: 'warning', title, message, ...options });
  }

  info(message, title = 'Info', options = {}) {
    return this.show({ type: 'info', title, message, ...options });
  }

  loading(message, title = 'Loading', options = {}) {
    return this.show({ type: 'loading', title, message, duration: 0, ...options });
  }

  dismissAll() {
    this.toasts.forEach(toast => toast.dismiss());
    this.toasts.clear();
  }
}

// Global instance
let toastManager = null;

export function getToastManager() {
  if (!toastManager) {
    toastManager = new ToastManager();
  }
  return toastManager;
}

// Convenience functions
export function showToast(options) {
  return getToastManager().show(options);
}

export function showSuccessToast(message, title) {
  return getToastManager().success(message, title);
}

export function showErrorToast(message, title) {
  return getToastManager().error(message, title);
}

export function showWarningToast(message, title) {
  return getToastManager().warning(message, title);
}

export function showInfoToast(message, title) {
  return getToastManager().info(message, title);
}

export function showLoadingToast(message, title) {
  return getToastManager().loading(message, title);
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    getToastManager().init();
  });
}
