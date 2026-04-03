export default function AIGeneratePanel({ onGenerate }) {
  const panel = document.createElement('div');
  panel.className = 'ai-generate-panel p-4 space-y-4';

  panel.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">AI Video Generation</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Describe your video</label>
        <textarea id="ai-prompt" rows="3"
          class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
          placeholder="A professional product demo showing..."></textarea>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Negative prompt (optional)</label>
        <input id="ai-negative" type="text"
          class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          placeholder="blurry, low quality, watermark">
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Model</label>
          <select id="ai-model"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="kling-v3">Kling v3.0</option>
            <option value="kling-v2">Kling v2.0</option>
            <option value="sora">Sora</option>
            <option value="veo-3">Veo 3</option>
            <option value="wan-2.2">Wan 2.2</option>
            <option value="seedance">Seedance</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Duration</label>
          <select id="ai-duration"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
            <option value="15" selected>15 seconds</option>
            <option value="30">30 seconds</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Aspect Ratio</label>
          <select id="ai-aspect"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="16:9" selected>16:9 Landscape</option>
            <option value="9:16">9:16 Portrait</option>
            <option value="1:1">1:1 Square</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Quality</label>
          <select id="ai-quality"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="standard">Standard</option>
            <option value="hd" selected>HD</option>
            <option value="4k">4K</option>
          </select>
        </div>
      </div>
      
      <button id="ai-generate-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Generate Video
      </button>
    </div>
    
    <hr class="border-white/10">
    
    <div class="space-y-3">
      <h4 class="text-xs font-semibold text-gray-500 uppercase">Image to Video</h4>
      <div id="i2v-upload-zone"
        class="p-4 rounded-lg border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 transition-colors">
        <p class="text-gray-500 text-sm">Drop image or click to upload</p>
        <input type="file" id="i2v-file" accept="image/*" class="hidden">
      </div>
      <button id="ai-i2v-btn"
        class="w-full p-3 rounded-lg bg-violet-600/50 text-white font-semibold hover:bg-violet-600 transition-colors">
        Animate Image
      </button>
    </div>
    
    <hr class="border-white/10">
    
    <div class="space-y-3">
      <h4 class="text-xs font-semibold text-gray-500 uppercase">AI Music</h4>
      <textarea id="ai-music-prompt" rows="2"
        class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
        placeholder="Upbeat corporate background music..."></textarea>
      <button id="ai-music-btn"
        class="w-full p-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">
        Generate Music
      </button>
    </div>
  `;

  const generateBtn = panel.querySelector('#ai-generate-btn');
  const i2vBtn = panel.querySelector('#ai-i2v-btn');
  const musicBtn = panel.querySelector('#ai-music-btn');
  const uploadZone = panel.querySelector('#i2v-upload-zone');
  const fileInput = panel.querySelector('#i2v-file');

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('border-violet-500');
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('border-violet-500');
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('border-violet-500');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      uploadZone.querySelector('p').textContent = e.dataTransfer.files[0].name;
    }
  });

  generateBtn.addEventListener('click', () => {
    if (onGenerate) {
      onGenerate({
        type: 'text-to-video',
        prompt: panel.querySelector('#ai-prompt').value,
        negativePrompt: panel.querySelector('#ai-negative').value,
        model: panel.querySelector('#ai-model').value,
        duration: parseInt(panel.querySelector('#ai-duration').value, 10),
        aspectRatio: panel.querySelector('#ai-aspect').value,
        quality: panel.querySelector('#ai-quality').value,
      });
    }
  });

  i2vBtn.addEventListener('click', () => {
    if (onGenerate) {
      onGenerate({
        type: 'image-to-video',
        file: fileInput.files[0] || null,
        prompt: panel.querySelector('#ai-prompt').value,
        model: panel.querySelector('#ai-model').value,
        duration: parseInt(panel.querySelector('#ai-duration').value, 10),
      });
    }
  });

  musicBtn.addEventListener('click', () => {
    if (onGenerate) {
      onGenerate({
        type: 'music',
        prompt: panel.querySelector('#ai-music-prompt').value,
      });
    }
  });

  return panel;
}
