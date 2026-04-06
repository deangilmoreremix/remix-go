export default function ErrorBoundary({ children, onError }) {
  const container = document.createElement('div');
  container.className = 'error-boundary-wrapper';

  let errorOccurred = false;
  let errorInfo = null;

  function logError(error, info) {
    console.error('Error caught by boundary:', error, info);

    // Send to monitoring service if available
    if (window.monitoring) {
      window.monitoring.trackError(error, {
        componentStack: info.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    }

    // Send to analytics if available
    if (window.analytics) {
      window.analytics.track('Error Boundary Triggered', {
        error: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
      });
    }
  }

  function renderError(error, resetErrorBoundary) {
    container.innerHTML = `
      <div class="error-boundary flex items-center justify-center min-h-[400px] p-8 bg-gray-800 border border-gray-700 rounded-xl m-8" role="alert">
        <div class="error-content text-center max-w-md">
          <div class="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <i class="fa fa-exclamation-triangle text-2xl"></i>
          </div>
          <h2 class="error-title text-xl font-bold text-red-400 mb-3">Something went wrong</h2>
          <p class="error-message text-gray-300 mb-6 leading-relaxed">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>

          <div class="error-actions flex gap-3 justify-center mb-6">
            <button class="retry-button bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    type="button">
              Try Again
            </button>
            <button class="reload-button bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    type="button">
              Reload Page
            </button>
          </div>

          ${window.location.hostname === 'localhost' ? `
            <details class="error-details text-left">
              <summary class="cursor-pointer text-sm text-gray-400 hover:text-gray-300 mb-2">Error Details (Development Only)</summary>
              <pre class="error-stack bg-gray-900 p-3 rounded text-xs text-red-400 overflow-x-auto">${error.stack}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;

    const retryBtn = container.querySelector('.retry-button');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        errorOccurred = false;
        errorInfo = null;
        resetErrorBoundary();
      });
    }

    const reloadBtn = container.querySelector('.reload-button');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }

  function renderChildren() {
    if (typeof children === 'function') {
      try {
        const childElement = children();
        container.innerHTML = '';
        container.appendChild(childElement);
      } catch (error) {
        errorOccurred = true;
        errorInfo = error;
        logError(error, { componentStack: error.stack });
        if (onError) onError(error, { componentStack: error.stack });
        renderError(error, () => renderChildren());
      }
    } else if (children instanceof Node) {
      container.innerHTML = '';
      container.appendChild(children);
    } else {
      container.innerHTML = '<div>Invalid children</div>';
    }
  }

  // Try-catch wrapper for async errors
  window.addEventListener('error', (event) => {
    if (!errorOccurred) {
      errorOccurred = true;
      errorInfo = event.error;
      logError(event.error, {
        componentStack: event.error.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      if (onError) onError(event.error, { componentStack: event.error.stack });
      renderError(event.error, () => {
        errorOccurred = false;
        renderChildren();
      });
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (!errorOccurred) {
      errorOccurred = true;
      const error = event.reason || new Error('Unhandled promise rejection');
      errorInfo = error;
      logError(error, { componentStack: error.stack });
      if (onError) onError(error, { componentStack: error.stack });
      renderError(error, () => {
        errorOccurred = false;
        renderChildren();
      });
    }
  });

  renderChildren();

  container.api = {
    reset: () => {
      errorOccurred = false;
      errorInfo = null;
      renderChildren();
    },
    hasError: () => errorOccurred,
    getError: () => errorInfo
  };

  return container;
}