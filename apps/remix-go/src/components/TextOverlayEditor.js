export default function TextOverlayEditor({ data, onSave }) {
  const overlay = data || {
    text: 'Your text here',
    fontSize: 24,
    fontColor: '#ffffff',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textAlign: 'center',
    top: '10%',
    left: '10%',
    width: '80%',
    animation: 'none',
    start: 0,
    end: 5,
  };

  const container = document.createElement('div');
  container.className = 'text-overlay-editor p-4 rounded-xl glass';

  container.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Text Overlay</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Text</label>
        <textarea id="toe-text" rows="2"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500">${overlay.text}</textarea>
        <button id="toe-insert-token" class="mt-1 text-xs text-violet-400 hover:text-violet-300">+ Insert Token</button>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Font Size</label>
          <input id="toe-size" type="number" value="${overlay.fontSize}" min="8" max="120"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Color</label>
          <input id="toe-color" type="color" value="${overlay.fontColor}"
            class="w-full h-9 rounded cursor-pointer">
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Font</label>
          <select id="toe-font"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
            <option value="Impact">Impact</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Weight</label>
          <select id="toe-weight"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Animation</label>
        <select id="toe-animation"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
          <option value="none">None</option>
          <option value="fade-in">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="slide-down">Slide Down</option>
          <option value="typewriter">Typewriter</option>
          <option value="pop">Pop</option>
        </select>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Start (seconds)</label>
          <input id="toe-start" type="number" value="${overlay.start}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">End (seconds)</label>
          <input id="toe-end" type="number" value="${overlay.end}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <button id="toe-save"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
        Save Overlay
      </button>
    </div>
  `;

  container.querySelector('#toe-insert-token')?.addEventListener('click', () => {
    const textarea = container.querySelector('#toe-text');
    const tokens = ['FIRSTNAME', 'LASTNAME', 'EMAIL', 'COMPANY', 'GEOCITY'];
    const token = prompt('Enter token name (e.g., FIRSTNAME):');
    if (token) {
      textarea.value += `{{${token.toUpperCase()}}}`;
    }
  });

  container.querySelector('#toe-save')?.addEventListener('click', () => {
    const result = {
      type: 'text',
      text: container.querySelector('#toe-text').value,
      fontSize: parseInt(container.querySelector('#toe-size').value, 10),
      fontColor: container.querySelector('#toe-color').value,
      fontFamily: container.querySelector('#toe-font').value,
      fontWeight: container.querySelector('#toe-weight').value,
      animation: container.querySelector('#toe-animation').value,
      start: parseFloat(container.querySelector('#toe-start').value),
      end: parseFloat(container.querySelector('#toe-end').value),
      top: overlay.top,
      left: overlay.left,
      width: overlay.width,
    };
    if (onSave) onSave(result);
  });

  return container;
}
