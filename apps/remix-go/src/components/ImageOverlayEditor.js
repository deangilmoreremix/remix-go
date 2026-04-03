export default function ImageOverlayEditor({ data, onSave }) {
  const overlay = data || {
    src: '',
    top: '0',
    left: '0',
    width: '100%',
    start: 0,
    end: 5,
    clickAction: 'none',
    clickHref: '',
  };

  const container = document.createElement('div');
  container.className = 'image-overlay-editor p-4 rounded-xl glass';

  container.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Image Overlay</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Image URL</label>
        <input id="ioe-src" type="url" value="${overlay.src}"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="https://example.com/image.png">
      </div>
      
      <div id="ioe-upload" class="p-4 rounded-lg border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 transition-colors">
        <p class="text-gray-500 text-xs">Or drop image here</p>
        <input type="file" id="ioe-file" accept="image/*" class="hidden">
      </div>
      
      ${overlay.src ? `
        <div class="rounded-lg overflow-hidden border border-white/10">
          <img src="${overlay.src}" class="w-full max-h-32 object-contain bg-black/30" alt="preview">
        </div>
      ` : ''}
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Width</label>
          <input id="ioe-width" type="text" value="${overlay.width}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            placeholder="100% or 200px">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Position</label>
          <select id="ioe-position"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="top-left">Top Left</option>
            <option value="top-center">Top Center</option>
            <option value="center">Center</option>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Start (seconds)</label>
          <input id="ioe-start" type="number" value="${overlay.start}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">End (seconds)</label>
          <input id="ioe-end" type="number" value="${overlay.end}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Click Action</label>
        <select id="ioe-click"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
          <option value="none">None</option>
          <option value="link">Open Link</option>
          <option value="pause">Pause Video</option>
        </select>
      </div>
      
      <button id="ioe-save"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
        Save Image Overlay
      </button>
    </div>
  `;

  const uploadZone = container.querySelector('#ioe-upload');
  const fileInput = container.querySelector('#ioe-file');

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      container.querySelector('#ioe-src').value = URL.createObjectURL(e.dataTransfer.files[0]);
    }
  });
  uploadZone.addEventListener('dragover', (e) => e.preventDefault());

  container.querySelector('#ioe-save')?.addEventListener('click', () => {
    const result = {
      type: 'image',
      src: container.querySelector('#ioe-src').value,
      width: container.querySelector('#ioe-width').value,
      start: parseFloat(container.querySelector('#ioe-start').value),
      end: parseFloat(container.querySelector('#ioe-end').value),
      clickAction: container.querySelector('#ioe-click').value,
    };
    if (onSave) onSave(result);
  });

  return container;
}
