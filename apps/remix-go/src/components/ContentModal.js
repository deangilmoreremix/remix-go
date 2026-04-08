export default function ContentModal({ content, title, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">${title || 'Content'}</h3>
        <button id="content-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="content-area text-white">
        ${content || '<p class="text-gray-400">No content available</p>'}
      </div>

      <div class="flex justify-end mt-6">
        <button id="content-ok" class="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors">
          OK
        </button>
      </div>
    </div>
  `;

  // Event listeners
  modal.querySelector('#content-close').addEventListener('click', () => {
    modal.remove();
    onClose?.();
  });

  modal.querySelector('#content-ok').addEventListener('click', () => {
    modal.remove();
    onClose?.();
  });

  return modal;
}