import { buildProviderURL, buildPersonalizedURL } from '../lib/tokenReplacer.js';
import { extractTokens } from '../lib/tokenExtractor.js';

export default function PersonalizedLinkGenerator({ projectData, baseURL }) {
  const providers = [
    { id: 'mailchimp', name: 'MailChimp', icon: '📧' },
    { id: 'aweber', name: 'AWeber', icon: '📧' },
    { id: 'interspire', name: 'Interspire', icon: '📧' },
    { id: 'getresponse', name: 'GetResponse', icon: '📧' },
    { id: 'infusionsoft', name: 'Infusionsoft', icon: '📧' },
    { id: 'sendlane', name: 'Sendlane', icon: '📧' },
    { id: 'constantcontact', name: 'Constant Contact', icon: '📧' },
    { id: 'sendreach', name: 'SendReach', icon: '📧' },
    { id: 'custom', name: 'Custom', icon: '⚙️' },
  ];

  let selectedProvider = 'mailchimp';
  let customTokens = {};

  const tokens = extractTokens(projectData || {});
  const url = baseURL || 'https://video.example.com/watch';

  const container = document.createElement('div');
  container.className = 'personalized-link-generator p-4 rounded-xl glass';

  function render() {
    const providerURL = buildProviderURL(url, tokens, selectedProvider);
    const directURL = buildPersonalizedURL(url, customTokens);

    container.innerHTML = `
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Personalized Links</h3>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Email Provider</label>
        <div class="grid grid-cols-3 gap-1">
          ${providers.map(p => `
            <button data-provider="${p.id}"
              class="px-2 py-1.5 rounded text-xs transition-colors ${
                selectedProvider === p.id
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }">
              ${p.name}
            </button>
          `).join('')}
        </div>
      </div>
      
      ${tokens.length > 0 ? `
        <div class="mb-4">
          <label class="block text-xs text-gray-500 mb-2">Detected Tokens</label>
          <div class="flex flex-wrap gap-1">
            ${tokens.map(t => `<span class="px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 text-xs">${t}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Provider Link (merge tags)</label>
        <div class="p-3 rounded-lg bg-black/30 text-xs text-green-400 break-all font-mono">${providerURL}</div>
        <button id="copy-provider" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Direct Link (manual values)</label>
        <div class="space-y-2">
          ${tokens.map(t => `
            <div class="flex gap-2 items-center">
              <span class="text-xs text-gray-500 w-20">${t}</span>
              <input type="text" data-token="${t}" value="${customTokens[t] || ''}" placeholder="Enter ${t.toLowerCase()}"
                class="flex-1 p-1.5 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500">
            </div>
          `).join('')}
        </div>
        <div class="p-3 rounded-lg bg-black/30 text-xs text-blue-400 break-all font-mono mt-2">${directURL}</div>
        <button id="copy-direct" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-2">Embed Script</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-yellow-400 overflow-x-auto font-mono">&lt;iframe id='vr-player' src='${url}'&gt;&lt;/iframe&gt;
&lt;script&gt;
  var params = window.location.search.substring(1);
  document.getElementById('vr-player').src += '&amp;' + params;
&lt;/script&gt;</pre>
        <button id="copy-embed" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy</button>
      </div>
    `;

    container.querySelectorAll('[data-provider]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedProvider = btn.dataset.provider;
        render();
      });
    });

    container.querySelectorAll('[data-token]').forEach(input => {
      input.addEventListener('input', (e) => {
        customTokens[e.target.dataset.token] = e.target.value;
        const directEl = container.querySelector('.mb-4:nth-child(4) .bg-black\\/30');
        if (directEl) directEl.textContent = buildPersonalizedURL(url, customTokens);
      });
    });

    container.querySelector('#copy-provider')?.addEventListener('click', () => {
      navigator.clipboard.writeText(providerURL);
    });
    container.querySelector('#copy-direct')?.addEventListener('click', () => {
      navigator.clipboard.writeText(directURL);
    });
    container.querySelector('#copy-embed')?.addEventListener('click', () => {
      const embedCode = `<iframe id='vr-player' src='${url}'></iframe>\n<script>\n  var params = window.location.search.substring(1);\n  document.getElementById('vr-player').src += '&' + params;\n</script>`;
      navigator.clipboard.writeText(embedCode);
    });
  }

  render();
  return container;
}
