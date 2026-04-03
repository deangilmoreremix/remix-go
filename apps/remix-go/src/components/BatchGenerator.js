export default function BatchGenerator({ contacts, onGenerate, onComplete }) {
  let currentContacts = contacts || [];
  let isRunning = false;
  let progress = { current: 0, total: 0, results: [] };

  const container = document.createElement('div');
  container.className = 'batch-generator p-4 rounded-xl glass';

  function render() {
    container.innerHTML = `
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Batch Video Generator</h3>
      
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Contacts (CSV or paste)</label>
          <textarea id="batch-contacts" rows="4"
            class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500 font-mono"
            placeholder="FIRSTNAME,EMAIL,COMPANY
John,john@acme.com,Acme Inc
Jane,jane@widget.co,Widget Co">${currentContacts.map(c => Object.values(c).join(',')).join('\n')}</textarea>
          <p class="text-xs text-gray-600 mt-1">First row is headers. Each subsequent row is a contact.</p>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Video Template</label>
            <select id="batch-template"
              class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
              <option value="intro">AI Intro</option>
              <option value="outreach">Sales Outreach</option>
              <option value="followup">Follow Up</option>
              <option value="demo">Product Demo</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Background</label>
            <select id="batch-bg"
              class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
              <option value="ai">AI Generated</option>
              <option value="website">Prospect Website</option>
              <option value="solid">Solid Color</option>
            </select>
          </div>
        </div>
        
        <button id="parse-contacts-btn"
          class="w-full p-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
          Parse Contacts
        </button>
        
        <div id="batch-parsed" class="hidden">
          <div class="flex items-center justify-between mb-2">
            <span id="batch-count" class="text-sm text-gray-400">0 contacts</span>
            <span id="batch-status" class="text-xs text-gray-600"></span>
          </div>
          <div id="batch-preview" class="max-h-32 overflow-y-auto space-y-1"></div>
        </div>
        
        <button id="batch-start-btn"
          class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          ${currentContacts.length === 0 ? 'disabled' : ''}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Generate ${currentContacts.length} Videos
        </button>
      </div>
      
      ${isRunning || progress.results.length > 0 ? `
        <div class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-500">Progress</span>
            <span class="text-xs text-gray-400">${progress.current}/${progress.total}</span>
          </div>
          <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-violet-500 rounded-full transition-all" style="width: ${progress.total ? (progress.current / progress.total * 100) : 0}%"></div>
          </div>
          
          ${progress.results.length > 0 ? `
            <div class="mt-3 max-h-40 overflow-y-auto space-y-1">
              ${progress.results.map(r => `
                <div class="flex items-center justify-between p-2 rounded bg-white/5 text-xs">
                  <span class="text-gray-400">${r.name}</span>
                  <span class="${r.success ? 'text-green-400' : 'text-red-400'}">${r.success ? '✓ Generated' : '✗ Failed'}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}
    `;

    const parseBtn = container.querySelector('#parse-contacts-btn');
    const startBtn = container.querySelector('#batch-start-btn');
    const textarea = container.querySelector('#batch-contacts');

    parseBtn?.addEventListener('click', () => {
      const lines = textarea.value.trim().split('\n').filter(l => l.trim());
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim().toUpperCase());
      currentContacts = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => { obj[h] = values[i] || ''; });
        return obj;
      });

      const parsedDiv = container.querySelector('#batch-parsed');
      const countEl = container.querySelector('#batch-count');
      const previewEl = container.querySelector('#batch-preview');

      parsedDiv.classList.remove('hidden');
      countEl.textContent = `${currentContacts.length} contacts`;
      previewEl.innerHTML = currentContacts.slice(0, 5).map(c =>
        `<div class="text-xs text-gray-500 p-1 rounded bg-white/5">${c.FIRSTNAME || c.NAME || Object.values(c)[0]} - ${c.EMAIL || ''}</div>`
      ).join('');

      startBtn.disabled = false;
      startBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate ${currentContacts.length} Videos`;
    });

    startBtn?.addEventListener('click', async () => {
      if (!currentContacts.length || isRunning) return;
      isRunning = true;
      progress = { current: 0, total: currentContacts.length, results: [] };
      render();

      for (let i = 0; i < currentContacts.length; i++) {
        const contact = currentContacts[i];
        try {
          if (onGenerate) await onGenerate(contact, i);
          progress.results.push({ name: contact.FIRSTNAME || contact.NAME || `Contact ${i + 1}`, success: true });
        } catch {
          progress.results.push({ name: contact.FIRSTNAME || contact.NAME || `Contact ${i + 1}`, success: false });
        }
        progress.current = i + 1;
        render();
      }

      isRunning = false;
      if (onComplete) onComplete(progress.results);
      render();
    });
  }

  render();
  return container;
}
