import EmbedCodeGenerator from '../components/EmbedCodeGenerator.js';
import EmailCampaign from '../components/EmailCampaign.js';
import PersonalizedLinkGenerator from '../components/PersonalizedLinkGenerator.js';
import BatchGenerator from '../components/BatchGenerator.js';

export default function Publisher() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-app-bg';

  const hash = window.location.hash;
  const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  const projectId = params.get('id') || 'demo';

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-white mb-2">Publish & Share</h1>
      <p class="text-gray-400 mb-8">Share your video with the world</p>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="pub-embed"></div>
        <div id="pub-email"></div>
      </div>
      
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="pub-links"></div>
        <div id="pub-batch"></div>
      </div>
      
      <div class="mt-6">
        <a href="#getting-started"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Home
        </a>
      </div>
    </div>
  `;

  const projectURL = `${window.location.origin}${window.location.pathname}#watch?id=${projectId}`;

  container.querySelector('#pub-embed').appendChild(
    EmbedCodeGenerator({ projectURL })
  );

  container.querySelector('#pub-email').appendChild(
    EmailCampaign({ projectData: {}, baseURL: projectURL })
  );

  container.querySelector('#pub-links').appendChild(
    PersonalizedLinkGenerator({ projectData: {}, baseURL: projectURL })
  );

  container.querySelector('#pub-batch').appendChild(
    BatchGenerator({
      contacts: [
        { FIRSTNAME: 'John', EMAIL: 'john@example.com', COMPANY: 'Acme Inc' },
        { FIRSTNAME: 'Jane', EMAIL: 'jane@example.com', COMPANY: 'Widget Co' },
      ],
      onGenerate: async (contact, index) => {
        await new Promise(r => setTimeout(r, 500));
      },
    })
  );

  return container;
}
