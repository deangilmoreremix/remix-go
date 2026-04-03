export default function ConfirmationModal({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel
}) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  const typeConfig = {
    warning: { icon: '⚠️', color: 'text-yellow-400', btnColor: 'bg-yellow-600 hover:bg-yellow-500' },
    danger: { icon: '🚨', color: 'text-red-400', btnColor: 'bg-red-600 hover:bg-red-500' },
    info: { icon: 'ℹ️', color: 'text-blue-400', btnColor: 'bg-blue-600 hover:bg-blue-500' },
    success: { icon: '✅', color: 'text-green-400', btnColor: 'bg-green-600 hover:bg-green-500' },
  };

  const config = typeConfig[type] || typeConfig.warning;

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
      <div class="text-4xl mb-4 ${config.color}">${config.icon}</div>
      <h3 class="text-lg font-semibold text-white mb-2">${title || 'Are you sure?'}</h3>
      <p class="text-gray-400 text-sm mb-6">${message || 'This action cannot be undone.'}</p>

      <div class="flex gap-3 justify-center">
        <button id="confirm-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          ${cancelText}
        </button>
        <button id="confirm-ok" class="px-4 py-2 rounded-lg ${config.btnColor} text-white font-semibold transition-colors">
          ${confirmText}
        </button>
      </div>
    </div>
  `;

  modal.querySelector('#confirm-cancel').addEventListener('click', () => {
    if (onCancel) onCancel();
    modal.remove();
  });

  modal.querySelector('#confirm-ok').addEventListener('click', () => {
    if (onConfirm) onConfirm();
    modal.remove();
  });

  // Allow escape key to cancel
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      if (onCancel) onCancel();
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Remove event listener when modal is removed
  modal.addEventListener('remove', () => {
    document.removeEventListener('keydown', handleEscape);
  });

  return modal;
}

// Convenience methods for common confirmations
export function confirmDelete(itemName, onConfirm, onCancel) {
  const modal = ConfirmationModal({
    title: 'Delete Item',
    message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    confirmText: 'Delete',
    type: 'danger',
    onConfirm,
    onCancel,
  });
  document.body.appendChild(modal);
  return modal;
}

export function confirmSave(onConfirm, onCancel) {
  const modal = ConfirmationModal({
    title: 'Save Changes',
    message: 'Do you want to save your changes?',
    confirmText: 'Save',
    type: 'info',
    onConfirm,
    onCancel,
  });
  document.body.appendChild(modal);
  return modal;
}

export function confirmExit(onConfirm, onCancel) {
  const modal = ConfirmationModal({
    title: 'Exit Without Saving',
    message: 'You have unsaved changes. Are you sure you want to exit?',
    confirmText: 'Exit',
    cancelText: 'Stay',
    type: 'warning',
    onConfirm,
    onCancel,
  });
  document.body.appendChild(modal);
  return modal;
}
