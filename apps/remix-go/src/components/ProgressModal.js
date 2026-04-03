export default function ProgressModal({ title, message, progress, onCancel }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  const progressPercent = progress || 0;
  const progressWidth = `${Math.min(100, Math.max(0, progressPercent))}%`;

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-md w-full mx-4 text-center">
      <div class="text-4xl mb-4">⏳</div>
      <h3 class="text-lg font-semibold text-white mb-2">${title || 'Processing...'}</h3>
      <p class="text-gray-400 text-sm mb-6">${message || 'Please wait while we process your request.'}</p>

      <div class="mb-6">
        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div class="h-full bg-violet-500 rounded-full transition-all duration-300 ease-out"
               style="width: ${progressWidth}"></div>
        </div>
        <div class="text-xs text-gray-500 mt-2">${progressPercent.toFixed(0)}% complete</div>
      </div>

      ${onCancel ? `
        <button id="progress-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          Cancel
        </button>
      ` : ''}
    </div>
  `;

  // Auto-remove when progress reaches 100%
  if (progressPercent >= 100) {
    setTimeout(() => {
      if (modal.parentNode) modal.remove();
    }, 1000);
  }

  // Handle cancel
  if (onCancel) {
    modal.querySelector('#progress-cancel')?.addEventListener('click', () => {
      onCancel();
      modal.remove();
    });
  }

  // Allow clicking outside to close (if no cancel callback)
  if (!onCancel) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // Update progress method
  modal.updateProgress = (newProgress, newMessage) => {
    const progressBar = modal.querySelector('.bg-violet-500');
    const percentText = modal.querySelector('.text-xs');
    const messageEl = modal.querySelector('p');

    if (progressBar && newProgress !== undefined) {
      const percent = Math.min(100, Math.max(0, newProgress));
      progressBar.style.width = `${percent}%`;
      if (percentText) percentText.textContent = `${percent.toFixed(0)}% complete`;

      if (percent >= 100) {
        setTimeout(() => {
          if (modal.parentNode) modal.remove();
        }, 1000);
      }
    }

    if (messageEl && newMessage) {
      messageEl.textContent = newMessage;
    }
  };

  return modal;
}
