export default function TemplatePreviewModal({ template, onClose, onSelect }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">${template?.name || 'Template Preview'}</h3>
        <button id="template-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="template-preview bg-black/20 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
        <div class="text-center text-white">
          <svg class="w-16 h-16 mx-auto mb-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h4 class="text-lg font-medium mb-2">${template?.name || 'Template Name'}</h4>
          <p class="text-gray-400 mb-4">${template?.description || 'Template description and preview would be displayed here'}</p>
          <div class="bg-black/30 rounded p-4 text-left">
            <p class="text-sm text-gray-300">Category: ${template?.category || 'General'}</p>
            <p class="text-sm text-gray-300">Tags: ${template?.tags?.join(', ') || 'video, template'}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-400">
          Template ID: ${template?.id || 'template-1'}
        </div>
        <div class="flex gap-3">
          <button id="template-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors">
            Cancel
          </button>
          <button id="template-select" class="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors">
            Use Template
          </button>
        </div>
      </div>
    </div>
  `;

  // Event listeners
  modal.querySelector('#template-close').addEventListener('click', () => {
    modal.remove();
    onClose?.();
  });

  modal.querySelector('#template-cancel').addEventListener('click', () => {
    modal.remove();
    onClose?.();
  });

  modal.querySelector('#template-select').addEventListener('click', () => {
    onSelect?.(template);
    modal.remove();
  });

  return modal;
}