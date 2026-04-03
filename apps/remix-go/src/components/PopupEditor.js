export default function PopupEditor({ data, onSave }) {
  const popup = data || {
    title: 'Special Offer!',
    message: 'Don\'t miss this opportunity to transform your business.',
    buttonText: 'Learn More',
    buttonHref: '#',
    type: 'info',
    position: 'center',
    start: 5,
    end: 10,
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
  };

  const container = document.createElement('div');
  container.className = 'popup-editor p-4 rounded-xl glass';

  container.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popup Overlay</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Title</label>
        <input id="pop-title" type="text" value="${popup.title}"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Message</label>
        <textarea id="pop-message" rows="3"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500">${popup.message}</textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Button Text</label>
          <input id="pop-btn-text" type="text" value="${popup.buttonText}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Button Link</label>
          <input id="pop-btn-href" type="url" value="${popup.buttonHref}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Type</label>
          <select id="pop-type"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="offer">Special Offer</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Position</label>
          <select id="pop-position"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Start (seconds)</label>
          <input id="pop-start" type="number" value="${popup.start}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">End (seconds)</label>
          <input id="pop-end" type="number" value="${popup.end}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <button id="pop-save"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
        Save Popup
      </button>
    </div>
  `;

  container.querySelector('#pop-save')?.addEventListener('click', () => {
    const result = {
      type: 'popup',
      title: container.querySelector('#pop-title').value,
      message: container.querySelector('#pop-message').value,
      buttonText: container.querySelector('#pop-btn-text').value,
      buttonHref: container.querySelector('#pop-btn-href').value,
      popupType: container.querySelector('#pop-type').value,
      position: container.querySelector('#pop-position').value,
      start: parseFloat(container.querySelector('#pop-start').value),
      end: parseFloat(container.querySelector('#pop-end').value),
    };
    if (onSave) onSave(result);
  });

  return container;
}
