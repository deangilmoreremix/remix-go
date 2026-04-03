export default function ModelSelector({ onSelect, selectedModel }) {
  const models = [
    { id: 'kling-v3', name: 'Kling v3.0', type: 'text-to-video', provider: 'Kuaishou', speed: 'fast', quality: 'high' },
    { id: 'kling-v2', name: 'Kling v2.0', type: 'text-to-video', provider: 'Kuaishou', speed: 'medium', quality: 'high' },
    { id: 'sora', name: 'Sora', type: 'text-to-video', provider: 'OpenAI', speed: 'slow', quality: 'very-high' },
    { id: 'veo-3', name: 'Veo 3', type: 'text-to-video', provider: 'Google', speed: 'medium', quality: 'very-high' },
    { id: 'wan-2.2', name: 'Wan 2.2', type: 'text-to-video', provider: 'Alibaba', speed: 'fast', quality: 'high' },
    { id: 'seedance', name: 'Seedance', type: 'text-to-video', provider: 'ByteDance', speed: 'fast', quality: 'medium' },
    { id: 'flux-pulid', name: 'Flux PuLID', type: 'face-clone', provider: 'Flux', speed: 'medium', quality: 'high' },
    { id: 'minimax-voice-clone', name: 'MiniMax Voice Clone', type: 'voice-clone', provider: 'MiniMax', speed: 'fast', quality: 'high' },
    { id: 'kling-v2-avatar-pro', name: 'Kling Avatar Pro', type: 'avatar', provider: 'Kuaishou', speed: 'medium', quality: 'high' },
    { id: 'ltx-2.3-lipsync', name: 'LTX Lip Sync', type: 'lip-sync', provider: 'Lightricks', speed: 'fast', quality: 'high' },
  ];

  const container = document.createElement('div');
  container.className = 'model-selector';

  container.innerHTML = `
    <div class="space-y-2">
      <label class="block text-xs text-gray-500 uppercase tracking-wider">Select AI Model</label>
      <div class="model-list space-y-1 max-h-80 overflow-y-auto"></div>
    </div>
  `;

  const listEl = container.querySelector('.model-list');

  models.forEach(model => {
    const item = document.createElement('div');
    const isSelected = selectedModel === model.id;
    item.className = `p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
      isSelected ? 'bg-violet-600/30 border border-violet-500/50' : 'bg-white/5 border border-transparent hover:bg-white/10'
    }`;
    item.dataset.modelId = model.id;

    const qualityColors = { 'medium': 'text-yellow-400', 'high': 'text-green-400', 'very-high': 'text-emerald-400' };
    const speedIcons = { 'fast': '⚡', 'medium': '⏱', 'slow': '🐢' };

    item.innerHTML = `
      <div>
        <div class="text-sm font-medium text-white">${model.name}</div>
        <div class="text-xs text-gray-500">${model.provider} · ${model.type.replace(/-/g, ' ')}</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs ${qualityColors[model.quality] || 'text-gray-400'}">${model.quality}</span>
        <span class="text-xs">${speedIcons[model.speed] || ''}</span>
      </div>
    `;

    item.addEventListener('click', () => {
      listEl.querySelectorAll('.model-selector-item-active').forEach(el => {
        el.classList.remove('model-selector-item-active');
        el.className = el.className.replace('bg-violet-600/30 border border-violet-500/50', 'bg-white/5 border border-transparent hover:bg-white/10');
      });
      item.className = item.className.replace('bg-white/5 border border-transparent hover:bg-white/10', 'bg-violet-600/30 border border-violet-500/50');
      item.classList.add('model-selector-item-active');
      if (onSelect) onSelect(model);
    });

    if (isSelected) item.classList.add('model-selector-item-active');

    listEl.appendChild(item);
  });

  return container;
}
