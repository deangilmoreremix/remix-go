export default function CTAEditor({ data, onSave }) {
  const cta = data || {
    text: 'Book a Meeting',
    href: '#',
    backgroundColor: '#7c3aed',
    textColor: '#ffffff',
    fontSize: 16,
    borderRadius: 8,
    padding: '12px 24px',
    position: 'bottom-center',
    start: 0,
    end: 999,
  };

  const container = document.createElement('div');
  container.className = 'cta-editor p-4 rounded-xl glass';

  container.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">CTA Button</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Button Text</label>
        <input id="cta-text" type="text" value="${cta.text}"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Link URL</label>
        <input id="cta-href" type="url" value="${cta.href}"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="https://calendly.com/you">
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Background</label>
          <input id="cta-bg" type="color" value="${cta.backgroundColor}" class="w-full h-9 rounded cursor-pointer">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Text Color</label>
          <input id="cta-color" type="color" value="${cta.textColor}" class="w-full h-9 rounded cursor-pointer">
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Font Size</label>
          <input id="cta-size" type="number" value="${cta.fontSize}" min="10" max="48"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Border Radius</label>
          <input id="cta-radius" type="number" value="${cta.borderRadius}" min="0" max="50"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Start (seconds)</label>
          <input id="cta-start" type="number" value="${cta.start}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">End (seconds)</label>
          <input id="cta-end" type="number" value="${cta.end}" min="0" step="0.5"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        </div>
      </div>
      
      <div class="p-3 rounded-lg bg-black/30 text-center">
        <a href="#" style="display:inline-block;padding:${cta.padding};background:${cta.backgroundColor};color:${cta.textColor};font-size:${cta.fontSize}px;border-radius:${cta.borderRadius}px;text-decoration:none;font-weight:bold;">
          ${cta.text}
        </a>
      </div>
      
      <button id="cta-save"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
        Save CTA
      </button>
    </div>
  `;

  container.querySelector('#cta-save')?.addEventListener('click', () => {
    const result = {
      type: 'cta',
      text: container.querySelector('#cta-text').value,
      href: container.querySelector('#cta-href').value,
      backgroundColor: container.querySelector('#cta-bg').value,
      textColor: container.querySelector('#cta-color').value,
      fontSize: parseInt(container.querySelector('#cta-size').value, 10),
      borderRadius: parseInt(container.querySelector('#cta-radius').value, 10),
      start: parseFloat(container.querySelector('#cta-start').value),
      end: parseFloat(container.querySelector('#cta-end').value),
    };
    if (onSave) onSave(result);
  });

  return container;
}
