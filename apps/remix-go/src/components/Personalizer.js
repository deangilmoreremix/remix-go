import { getAvailableTokens, formatToken } from '../lib/tokenExtractor.js';

export default function Personalizer({ onTokenChosen }) {
  const tokens = getAvailableTokens();
  const modes = [
    { id: 'plain', label: 'Plain', description: '{{TOKEN}}' },
    { id: 'uppercase', label: 'Uppercase', description: '{{up TOKEN}}' },
    { id: 'fallback', label: 'Fallback', description: '{{d TOKEN "default"}}' },
  ];

  let selectedToken = tokens[0].key;
  let selectedMode = 'plain';
  let fallbackValue = '';

  const container = document.createElement('div');
  container.className = 'personalizer p-4 rounded-xl glass max-w-md';

  function render() {
    container.innerHTML = `
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Insert Token</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-2">Select Token</label>
          <div class="space-y-1 max-h-48 overflow-y-auto">
            ${tokens.map(t => `
              <button data-token="${t.key}"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedToken === t.key
                    ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }">
                <span class="font-medium">${t.label}</span>
                ${t.example ? `<span class="text-xs text-gray-600 ml-1">(${t.example})</span>` : ''}
              </button>
            `).join('')}
          </div>
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-2">Mode</label>
          <div class="space-y-1">
            ${modes.map(m => `
              <button data-mode="${m.id}"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedMode === m.id
                    ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }">
                <span class="font-medium">${m.label}</span>
                <span class="block text-xs text-gray-600">${m.description}</span>
              </button>
            `).join('')}
          </div>
          
          ${selectedMode === 'fallback' ? `
            <div class="mt-3">
              <label class="block text-xs text-gray-500 mb-1">Default Value</label>
              <input type="text" id="fallback-input" value="${fallbackValue}"
                class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                placeholder="Friend">
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="mt-4 p-3 rounded-lg bg-black/30 text-center">
        <code class="text-violet-400 text-sm">${formatToken(selectedToken, selectedMode, fallbackValue)}</code>
      </div>
      
      <button id="add-token-btn"
        class="mt-3 w-full p-2.5 rounded-lg bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 transition-colors">
        Add Token
      </button>
    `;

    container.querySelectorAll('[data-token]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedToken = btn.dataset.token;
        render();
      });
    });

    container.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedMode = btn.dataset.mode;
        render();
      });
    });

    const fallbackInput = container.querySelector('#fallback-input');
    if (fallbackInput) {
      fallbackInput.addEventListener('input', (e) => {
        fallbackValue = e.target.value;
      });
    }

    container.querySelector('#add-token-btn').addEventListener('click', () => {
      const tokenStr = formatToken(selectedToken, selectedMode, fallbackValue);
      if (onTokenChosen) onTokenChosen(tokenStr, selectedToken, selectedMode);
    });
  }

  render();
  return container;
}
