export default function VoiceClone({ onVoiceGenerated }) {
  let audioSample = null;

  const container = document.createElement('div');
  container.className = 'voice-clone p-4 rounded-xl glass';

  container.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Voice Cloning</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Voice Sample (30+ seconds)</label>
        <div id="voice-upload-zone"
          class="p-6 rounded-lg border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 transition-colors">
          <svg class="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
          <p class="text-gray-400 text-sm">Drop audio file or click to upload</p>
          <p class="text-gray-600 text-xs">MP3, WAV, M4A - minimum 30 seconds</p>
          <input type="file" id="voice-file" accept="audio/*" class="hidden">
        </div>
        <p id="voice-file-name" class="text-xs text-gray-500 mt-1 hidden"></p>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Text to Speak</label>
        <textarea id="voice-text" rows="3"
          class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
          placeholder="Hi {{FIRSTNAME}}, I wanted to reach out personally..."></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Model</label>
          <select id="voice-model"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="minimax-voice-clone">MiniMax Voice Clone</option>
            <option value="minimax-speech-2.6-hd">MiniMax Speech 2.6 HD</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Speed</label>
          <select id="voice-speed"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="0.8">Slow</option>
            <option value="1.0" selected>Normal</option>
            <option value="1.2">Fast</option>
          </select>
        </div>
      </div>
      
      <button id="generate-voice-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Generate Cloned Voice
      </button>
    </div>
    
    <div id="voice-result" class="mt-4 hidden">
      <label class="block text-xs text-gray-500 mb-2">Generated Audio</label>
      <audio id="voice-audio" controls class="w-full rounded-lg"></audio>
      <div class="flex gap-2 mt-3">
        <button id="voice-download" class="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Download</button>
        <button id="voice-use" class="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-sm text-white font-semibold hover:bg-violet-500 transition-colors">Use Audio</button>
      </div>
    </div>
  `;

  const uploadZone = container.querySelector('#voice-upload-zone');
  const fileInput = container.querySelector('#voice-file');
  const fileName = container.querySelector('#voice-file-name');
  const generateBtn = container.querySelector('#generate-voice-btn');
  const resultDiv = container.querySelector('#voice-result');
  const audioEl = container.querySelector('#voice-audio');

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
    if (e.dataTransfer.files.length) handleVoiceFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleVoiceFile(fileInput.files[0]);
  });

  function handleVoiceFile(file) {
    audioSample = URL.createObjectURL(file);
    fileName.textContent = file.name;
    fileName.classList.remove('hidden');
  }

  generateBtn.addEventListener('click', () => {
    const text = container.querySelector('#voice-text').value;
    if (!text.trim()) return;

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    setTimeout(() => {
      resultDiv.classList.remove('hidden');
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Cloned Voice';
    }, 2000);
  });

  container.querySelector('#voice-use')?.addEventListener('click', () => {
    if (onVoiceGenerated) {
      onVoiceGenerated({
        audioUrl: audioEl.src,
        text: container.querySelector('#voice-text').value,
        sampleUrl: audioSample,
      });
    }
  });

  return container;
}
