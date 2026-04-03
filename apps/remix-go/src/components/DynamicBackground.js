import { captureScreenshot } from '../lib/pageshot.js';

export default function DynamicBackground({ onBackgroundReady }) {
  let screenshotData = null;

  const container = document.createElement('div');
  container.className = 'dynamic-background p-4 rounded-xl glass';

  container.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Dynamic Background</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Prospect's Website URL</label>
        <input id="bg-url" type="url"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="https://prospect-company.com">
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Width</label>
          <select id="bg-width"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="1920" selected>1920px</option>
            <option value="1280">1280px</option>
            <option value="1080">1080px</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Height</label>
          <select id="bg-height"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="1080" selected>1080px</option>
            <option value="720">720px</option>
            <option value="627">627px (OG)</option>
          </select>
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Effect</label>
        <select id="bg-effect"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
          <option value="blur">Blur (8px)</option>
          <option value="blur-heavy">Heavy Blur (16px)</option>
          <option value="darken">Darken (60%)</option>
          <option value="blur-darken">Blur + Darken</option>
          <option value="none">None (raw)</option>
        </select>
      </div>
      
      <button id="capture-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Screenshot Website
      </button>
    </div>
    
    <div id="bg-preview" class="mt-4 hidden">
      <label class="block text-xs text-gray-500 mb-2">Preview</label>
      <div class="relative rounded-lg overflow-hidden border border-white/10">
        <img id="bg-preview-img" class="w-full" alt="Background preview">
        <div id="bg-effect-overlay" class="absolute inset-0 pointer-events-none"></div>
      </div>
      <div class="flex gap-2 mt-3">
        <button id="bg-download" class="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Download</button>
        <button id="bg-use" class="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-sm text-white font-semibold hover:bg-violet-500 transition-colors">Use as Background</button>
      </div>
    </div>
  `;

  const captureBtn = container.querySelector('#capture-btn');
  const previewDiv = container.querySelector('#bg-preview');
  const previewImg = container.querySelector('#bg-preview-img');
  const effectOverlay = container.querySelector('#bg-effect-overlay');

  function applyEffect(effect) {
    effectOverlay.style.cssText = '';
    switch (effect) {
      case 'blur':
        previewImg.style.filter = 'blur(8px)';
        break;
      case 'blur-heavy':
        previewImg.style.filter = 'blur(16px)';
        break;
      case 'darken':
        effectOverlay.style.background = 'rgba(0,0,0,0.6)';
        previewImg.style.filter = '';
        break;
      case 'blur-darken':
        previewImg.style.filter = 'blur(8px)';
        effectOverlay.style.background = 'rgba(0,0,0,0.4)';
        break;
      default:
        previewImg.style.filter = '';
    }
  }

  container.querySelector('#bg-effect').addEventListener('change', (e) => {
    applyEffect(e.target.value);
  });

  captureBtn.addEventListener('click', async () => {
    const url = container.querySelector('#bg-url').value.trim();
    if (!url) return;

    captureBtn.disabled = true;
    captureBtn.textContent = 'Capturing...';

    try {
      screenshotData = await captureScreenshot(url, {
        width: parseInt(container.querySelector('#bg-width').value, 10),
        height: parseInt(container.querySelector('#bg-height').value, 10),
      });
      previewImg.src = screenshotData;
      previewDiv.classList.remove('hidden');
      applyEffect(container.querySelector('#bg-effect').value);
    } catch (err) {
      console.error('Screenshot failed:', err);
      previewImg.src = '';
      previewDiv.classList.add('hidden');
    }

    captureBtn.disabled = false;
    captureBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg> Screenshot Website';
  });

  container.querySelector('#bg-download')?.addEventListener('click', () => {
    if (!screenshotData) return;
    const a = document.createElement('a');
    a.href = screenshotData;
    a.download = 'background.png';
    a.click();
  });

  container.querySelector('#bg-use')?.addEventListener('click', () => {
    if (onBackgroundReady && screenshotData) {
      onBackgroundReady({
        data: screenshotData,
        effect: container.querySelector('#bg-effect').value,
        url: container.querySelector('#bg-url').value,
      });
    }
  });

  return container;
}
