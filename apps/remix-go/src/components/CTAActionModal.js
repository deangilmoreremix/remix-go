export default function CTAActionModal({ modalId, title, content, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">${title || 'CTA Modal'}</h3>
        <button id="cta-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="text-white mb-6">
        <p class="mb-4">Modal ID: <code class="bg-black/30 px-2 py-1 rounded text-violet-300">${modalId || 'modal-1'}</code></p>
        <div class="content-area">
          ${content || '<p class="text-gray-400">CTA modal content would be displayed here</p>'}
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button id="cta-secondary" class="px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors">
          Secondary Action
        </button>
        <button id="cta-primary" class="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors">
          Primary Action
        </button>
      </div>
    </div>
  `;

  // Event listeners
  modal.querySelector('#cta-close').addEventListener('click', () => {
    modal.remove();
    onClose?.();
  });

  modal.querySelector('#cta-secondary').addEventListener('click', () => {
    modal.remove();
    onClose?.('secondary');
  });

  modal.querySelector('#cta-primary').addEventListener('click', () => {
    modal.remove();
    onClose?.('primary');
  });

  return modal;
}