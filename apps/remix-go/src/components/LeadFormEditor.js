export default function LeadFormEditor({ onSave, initialData }) {
  const data = initialData || {
    caption: 'Enter your details to continue',
    elements: [
      { type: 'email', label: 'Email', token: 'EMAIL' },
      { type: 'singleline', label: 'Name', token: 'NAME' },
    ],
    btnText: 'Submit',
    fontFamily: 'Arial',
    fontColor: '#ffffff',
    backgroundColor: '#000000',
    buttonBackground: '#7c3aed',
    buttonFontColor: '#ffffff',
    buttonBorderRadius: 4,
    webhook: '',
    webhookEnabled: false,
    privacyDisclaimer: 'By submitting you agree to our privacy policy.',
  };

  const container = document.createElement('div');
  container.className = 'lead-form-editor p-4 rounded-xl glass';

  function render() {
    container.innerHTML = `
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Lead Form Editor</h3>
      
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Caption</label>
          <input id="lf-caption" type="text" value="${data.caption}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-1">Fields</label>
          <div id="lf-fields" class="space-y-1">
            ${data.elements.map((el, i) => `
              <div class="flex gap-2 items-center" data-field-index="${i}">
                <select data-field-type="${i}"
                  class="flex-1 p-1.5 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500">
                  <option value="singleline" ${el.type === 'singleline' ? 'selected' : ''}>Text</option>
                  <option value="email" ${el.type === 'email' ? 'selected' : ''}>Email</option>
                  <option value="number" ${el.type === 'number' ? 'selected' : ''}>Number</option>
                  <option value="multiline" ${el.type === 'multiline' ? 'selected' : ''}>Textarea</option>
                </select>
                <input type="text" data-field-label="${i}" value="${el.label}"
                  class="flex-1 p-1.5 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                  placeholder="Label">
                <button data-remove-field="${i}" class="text-red-400 hover:text-red-300 text-xs px-1">&times;</button>
              </div>
            `).join('')}
          </div>
          <button id="lf-add-field" class="mt-1 text-xs text-violet-400 hover:text-violet-300">+ Add Field</button>
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-1">Button Text</label>
          <input id="lf-btn-text" type="text" value="${data.btnText}"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Background</label>
            <input id="lf-bg-color" type="color" value="${data.backgroundColor}"
              class="w-full h-8 rounded cursor-pointer">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Button Color</label>
            <input id="lf-btn-color" type="color" value="${data.buttonBackground}"
              class="w-full h-8 rounded cursor-pointer">
          </div>
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-1">Font</label>
          <select id="lf-font"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="Arial" ${data.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
            <option value="Helvetica" ${data.fontFamily === 'Helvetica' ? 'selected' : ''}>Helvetica</option>
            <option value="Georgia" ${data.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia</option>
            <option value="Verdana" ${data.fontFamily === 'Verdana' ? 'selected' : ''}>Verdana</option>
            <option value="Anton" ${data.fontFamily === 'Anton' ? 'selected' : ''}>Anton</option>
          </select>
        </div>
        
        <div>
          <label class="flex items-center gap-2 text-xs text-gray-500">
            <input type="checkbox" id="lf-webhook-enabled" ${data.webhookEnabled ? 'checked' : ''} class="accent-violet-500">
            Enable Webhook
          </label>
          <input id="lf-webhook" type="url" value="${data.webhook}" placeholder="https://your-webhook.com/endpoint"
            class="w-full mt-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 ${data.webhookEnabled ? '' : 'hidden'}">
        </div>
        
        <div>
          <label class="block text-xs text-gray-500 mb-1">Privacy Disclaimer</label>
          <textarea id="lf-privacy" rows="2"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500">${data.privacyDisclaimer}</textarea>
        </div>
        
        <button id="lf-save"
          class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
          Save Form
        </button>
      </div>
    `;

    container.querySelectorAll('[data-remove-field]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.removeField, 10);
        data.elements.splice(idx, 1);
        render();
      });
    });

    container.querySelector('#lf-add-field')?.addEventListener('click', () => {
      data.elements.push({ type: 'singleline', label: 'New Field', token: 'NEW_FIELD' });
      render();
    });

    container.querySelector('#lf-webhook-enabled')?.addEventListener('change', (e) => {
      data.webhookEnabled = e.target.checked;
      container.querySelector('#lf-webhook').classList.toggle('hidden', !e.target.checked);
    });

    container.querySelector('#lf-save')?.addEventListener('click', () => {
      data.caption = container.querySelector('#lf-caption').value;
      data.btnText = container.querySelector('#lf-btn-text').value;
      data.backgroundColor = container.querySelector('#lf-bg-color').value;
      data.buttonBackground = container.querySelector('#lf-btn-color').value;
      data.fontFamily = container.querySelector('#lf-font').value;
      data.webhook = container.querySelector('#lf-webhook').value;
      data.privacyDisclaimer = container.querySelector('#lf-privacy').value;

      data.elements.forEach((el, i) => {
        const typeEl = container.querySelector(`[data-field-type="${i}"]`);
        const labelEl = container.querySelector(`[data-field-label="${i}"]`);
        if (typeEl) el.type = typeEl.value;
        if (labelEl) {
          el.label = labelEl.value;
          el.token = labelEl.value.trim().toUpperCase().replace(/\s+/g, '_');
        }
      });

      if (onSave) onSave(data);
    });
  }

  render();
  return container;
}
