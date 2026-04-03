export default function AlertModal({ type, title, message, onClose, onConfirm }) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  const typeConfig = {
    error: { icon: '❌', color: 'text-red-400', btnClass: 'bg-red-600 hover:bg-red-500' },
    success: { icon: '✅', color: 'text-green-400', btnClass: 'bg-green-600 hover:bg-green-500' },
    warning: { icon: '⚠️', color: 'text-yellow-400', btnClass: 'bg-yellow-600 hover:bg-yellow-500' },
    info: { icon: 'ℹ️', color: 'text-blue-400', btnClass: 'bg-blue-600 hover:bg-blue-500' },
    confirm: { icon: '❓', color: 'text-violet-400', btnClass: 'bg-violet-600 hover:bg-violet-500' },
  };

  const config = typeConfig[type] || typeConfig.info;

  overlay.innerHTML = `
    <div class="glass rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
      <div class="text-4xl mb-3">${config.icon}</div>
      <h3 class="text-lg font-semibold text-white mb-2">${title || 'Alert'}</h3>
      <p class="text-gray-400 text-sm mb-6">${message || ''}</p>
      <div class="flex gap-3 justify-center">
        ${type === 'confirm' ? `
          <button id="alert-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">Cancel</button>
          <button id="alert-confirm" class="px-4 py-2 rounded-lg ${config.btnClass} text-white text-sm font-semibold transition-colors">Confirm</button>
        ` : `
          <button id="alert-ok" class="px-6 py-2 rounded-lg ${config.btnClass} text-white text-sm font-semibold transition-colors">OK</button>
        `}
      </div>
    </div>
  `;

  if (type === 'confirm') {
    overlay.querySelector('#alert-cancel')?.addEventListener('click', () => {
      overlay.remove();
      if (onClose) onClose();
    });
    overlay.querySelector('#alert-confirm')?.addEventListener('click', () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    });
  } else {
    overlay.querySelector('#alert-ok')?.addEventListener('click', () => {
      overlay.remove();
      if (onClose) onClose();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      if (onClose) onClose();
    }
  });

  return overlay;
}
