import { createEditor } from '../lib/grapesjs/config.js';
import { registerCustomBlocks } from '../lib/grapesjs/blocks.js';
import { tokenPlugin } from '../lib/grapesjs/tokenPlugin.js';
import { exportPageWithTokenSupport, exportAsZip } from '../lib/grapesjs/export.js';

export default function LandingPageBuilder() {
  const container = document.createElement('div');
  container.className = 'landing-page-builder min-h-screen bg-app-bg';

  container.innerHTML = `
    <div class="fixed top-0 left-56 right-0 h-12 bg-black/50 backdrop-blur border-b border-white/5 flex items-center px-4 z-30 gap-3">
      <a href="#getting-started" class="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back
      </a>
      <span class="text-white font-semibold">Landing Page Builder</span>
      <div class="flex-1"></div>
      <div id="gjs-devices" class="flex items-center gap-1"></div>
      <button id="gjs-export" class="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors">
        Export HTML
      </button>
      <button id="gjs-preview" class="px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 text-sm hover:text-white hover:bg-white/20 transition-colors">
        Preview
      </button>
    </div>
    
    <div class="flex pt-12" style="height: 100vh;">
      <div id="blocks" class="w-56 overflow-y-auto border-r border-white/5 bg-black/20 p-2 flex-shrink-0"></div>
      
      <div class="flex-1 flex flex-col">
        <div id="gjs-editor" class="flex-1"></div>
      </div>
      
      <div class="w-64 flex flex-col border-l border-white/5 bg-black/20 flex-shrink-0">
        <div class="border-b border-white/5">
          <div class="flex">
            <button class="gjs-tab flex-1 px-3 py-2 text-xs text-gray-400 hover:text-white border-b-2 border-transparent" data-tab="styles">Styles</button>
            <button class="gjs-tab flex-1 px-3 py-2 text-xs text-gray-400 hover:text-white border-b-2 border-transparent" data-tab="traits">Traits</button>
            <button class="gjs-tab flex-1 px-3 py-2 text-xs text-gray-400 hover:text-white border-b-2 border-transparent" data-tab="layers">Layers</button>
          </div>
        </div>
        <div id="styles" class="flex-1 overflow-y-auto p-2"></div>
        <div id="traits" class="flex-1 overflow-y-auto p-2 hidden"></div>
        <div id="layers" class="flex-1 overflow-y-auto p-2 hidden"></div>
        <div id="selectors" class="p-2 border-t border-white/5"></div>
      </div>
    </div>
  `;

  // Tab switching
  container.querySelectorAll('.gjs-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.gjs-tab').forEach(t => {
        t.classList.remove('text-violet-300', 'border-violet-500');
        t.classList.add('text-gray-400', 'border-transparent');
      });
      tab.classList.remove('text-gray-400', 'border-transparent');
      tab.classList.add('text-violet-300', 'border-violet-500');

      ['styles', 'traits', 'layers'].forEach(id => {
        const el = container.querySelector(`#${id}`);
        if (el) el.classList.toggle('hidden', id !== tab.dataset.tab);
      });
    });
  });

  // Initialize after DOM is ready
  requestAnimationFrame(() => {
    try {
      const editor = createEditor('#gjs-editor');
      if (!editor) {
        console.warn('GrapesJS not available, showing placeholder');
        container.querySelector('#gjs-editor').innerHTML = `
          <div class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <p class="text-lg">GrapesJS Editor</p>
              <p class="text-sm mt-2">Install grapesjs: npm install grapesjs</p>
            </div>
          </div>
        `;
        return;
      }

      registerCustomBlocks(editor);
      editor.use(tokenPlugin);

      // Device buttons
      const devicesEl = container.querySelector('#gjs-devices');
      ['Desktop', 'Tablet', 'Mobile'].forEach(device => {
        const btn = document.createElement('button');
        btn.className = `px-2 py-1 rounded text-xs ${device === 'Desktop' ? 'bg-violet-600/30 text-violet-300' : 'text-gray-500 hover:text-white'}`;
        btn.textContent = device;
        btn.addEventListener('click', () => {
          devicesEl.querySelectorAll('button').forEach(b => {
            b.className = 'px-2 py-1 rounded text-xs text-gray-500 hover:text-white';
          });
          btn.className = 'px-2 py-1 rounded text-xs bg-violet-600/30 text-violet-300';
          editor.setDevice(device);
        });
        devicesEl.appendChild(btn);
      });

      // Export
      container.querySelector('#gjs-export')?.addEventListener('click', () => {
        const html = exportAsZip(editor);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'landing-page.html';
        a.click();
        URL.revokeObjectURL(url);
      });

      // Preview
      container.querySelector('#gjs-preview')?.addEventListener('click', () => {
        const { html, css } = exportPageWithTokenSupport(editor);
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}</body></html>`);
        previewWindow.document.close();
      });

      // Activate first tab
      container.querySelector('.gjs-tab')?.click();
    } catch (e) {
      console.error('GrapesJS init error:', e);
    }
  });

  return container;
}
