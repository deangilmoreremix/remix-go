import { buildProviderURL } from '../lib/tokenReplacer.js';
import { extractTokens } from '../lib/tokenExtractor.js';

export default function EmailCampaign({ projectData, baseURL }) {
  const providers = [
    { id: 'mailchimp', name: 'MailChimp', mergeTag: '*|FNAME|*' },
    { id: 'aweber', name: 'AWeber', mergeTag: '{!firstname}' },
    { id: 'interspire', name: 'Interspire', mergeTag: '%%First Name%%' },
    { id: 'getresponse', name: 'GetResponse', mergeTag: '[[firstname]]' },
    { id: 'infusionsoft', name: 'Infusionsoft', mergeTag: '~Contact.FirstName~' },
    { id: 'sendlane', name: 'Sendlane', mergeTag: 'VAR_FIRST_NAME' },
    { id: 'constantcontact', name: 'Constant Contact', mergeTag: '{!$Subscriber.Firstname}' },
    { id: 'sendreach', name: 'SendReach', mergeTag: '[FNAME]' },
    { id: 'custom', name: 'Custom', mergeTag: 'firstname_token' },
  ];

  let selectedProvider = 'mailprovider';
  const tokens = extractTokens(projectData || {});
  const url = baseURL || 'https://video.example.com/watch';

  const container = document.createElement('div');
  container.className = 'email-campaign p-4 rounded-xl glass';

  function render() {
    const provider = providers.find(p => p.id === selectedProvider) || providers[0];
    const providerURL = buildProviderURL(url, tokens, selectedProvider);

    container.innerHTML = `
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Email Campaign</h3>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Select Email Provider</label>
        <select id="provider-select"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
          ${providers.map(p => `
            <option value="${p.id}" ${selectedProvider === p.id ? 'selected' : ''}>${p.name}</option>
          `).join('')}
        </select>
      </div>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Available Tokens</label>
        ${tokens.length > 0 ? `
          <div class="flex flex-wrap gap-1 mb-2">
            ${tokens.map(t => `<span class="px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 text-xs font-mono">{{${t}}}</span>`).join('')}
          </div>
          <p class="text-xs text-gray-600">
            In ${provider.name}, use merge tag: <code class="text-violet-400">${provider.mergeTag}</code>
          </p>
        ` : `
          <p class="text-xs text-gray-600">No personalization tokens found in this project. Add tokens like {{FIRSTNAME}} in the editor.</p>
        `}
      </div>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Generated URL</label>
        <div class="p-3 rounded-lg bg-black/30 text-xs text-green-400 break-all font-mono">${providerURL}</div>
        <button id="copy-url" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy URL</button>
      </div>
      
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-2">Email Body Snippet</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-blue-400 overflow-x-auto font-mono">Hi ${provider.mergeTag},

I created this personalized video just for you:

${providerURL}

Click the link above to watch!</pre>
        <button id="copy-snippet" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy Snippet</button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-2">Embed Code for Email</label>
        <pre class="p-3 rounded-lg bg-black/30 text-xs text-yellow-400 overflow-x-auto font-mono">&lt;a href="${providerURL}"&gt;
  &lt;img src="VIDEO_THUMBNAIL_URL" alt="Watch Video" style="max-width:100%;border-radius:8px;"&gt;
&lt;/a&gt;</pre>
        <button id="copy-embed" class="mt-2 px-3 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Copy Embed</button>
      </div>
    `;

    container.querySelector('#provider-select').addEventListener('change', (e) => {
      selectedProvider = e.target.value;
      render();
    });

    container.querySelector('#copy-url')?.addEventListener('click', () => {
      navigator.clipboard.writeText(providerURL);
      container.querySelector('#copy-url').textContent = 'Copied!';
      setTimeout(() => container.querySelector('#copy-url').textContent = 'Copy URL', 2000);
    });

    container.querySelector('#copy-snippet')?.addEventListener('click', () => {
      const snippet = `Hi ${provider.mergeTag},\n\nI created this personalized video just for you:\n\n${providerURL}\n\nClick the link above to watch!`;
      navigator.clipboard.writeText(snippet);
      container.querySelector('#copy-snippet').textContent = 'Copied!';
      setTimeout(() => container.querySelector('#copy-snippet').textContent = 'Copy Snippet', 2000);
    });

    container.querySelector('#copy-embed')?.addEventListener('click', () => {
      const embed = `<a href="${providerURL}">\n  <img src="VIDEO_THUMBNAIL_URL" alt="Watch Video" style="max-width:100%;border-radius:8px;">\n</a>`;
      navigator.clipboard.writeText(embed);
      container.querySelector('#copy-embed').textContent = 'Copied!';
      setTimeout(() => container.querySelector('#copy-embed').textContent = 'Copy Embed', 2000);
    });
  }

  render();
  return container;
}
