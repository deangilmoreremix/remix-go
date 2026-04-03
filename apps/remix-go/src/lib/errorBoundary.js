export function createErrorBoundary(fn) {
  return function wrapped(...args) {
    try {
      return fn(...args);
    } catch (err) {
      console.error('[ErrorBoundary]', err);
      return renderErrorView(err);
    }
  };
}

export function renderErrorView(err) {
  const el = document.createElement('div');
  el.className = 'min-h-[50vh] flex items-center justify-center';
  el.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-md text-center">
      <div class="text-4xl mb-4">⚠️</div>
      <h2 class="text-xl font-bold text-white mb-2">Something went wrong</h2>
      <p class="text-gray-400 text-sm mb-4">${escapeHtml(err?.message || 'Unknown error')}</p>
      <div class="flex gap-3 justify-center">
        <button id="err-reload" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors">
          Reload Page
        </button>
        <button id="err-home" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 text-sm hover:text-white hover:bg-white/20 transition-colors">
          Go Home
        </button>
      </div>
      <details class="mt-4 text-left">
        <summary class="text-xs text-gray-600 cursor-pointer">Error details</summary>
        <pre class="mt-2 p-2 rounded bg-black/30 text-xs text-red-400 overflow-auto max-h-40">${escapeHtml(err?.stack || err?.message || String(err))}</pre>
      </details>
    </div>
  `;

  el.querySelector('#err-reload')?.addEventListener('click', () => window.location.reload());
  el.querySelector('#err-home')?.addEventListener('click', () => { window.location.hash = '#getting-started'; });

  return el;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export async function safeAsync(promise, fallback = null) {
  try {
    return await promise;
  } catch (err) {
    console.error('[safeAsync]', err);
    return fallback;
  }
}

export function wrapComponent(renderFn) {
  return function safeRender(props) {
    try {
      const el = renderFn(props);
      if (el instanceof HTMLElement) return el;
      throw new Error('Component must return an HTMLElement');
    } catch (err) {
      console.error(`[ComponentError] ${renderFn.name}:`, err);
      return renderErrorView(err);
    }
  };
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('[UnhandledRejection]', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('[GlobalError]', event.error || event.message);
});

export default {
  createErrorBoundary,
  renderErrorView,
  safeAsync,
  wrapComponent,
};
