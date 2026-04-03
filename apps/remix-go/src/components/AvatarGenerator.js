export default function AvatarGenerator({ onAvatarReady }) {
  const container = document.createElement('div');
  container.className = 'avatar-generator p-4 rounded-xl glass';

  container.innerHTML = `
    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Talking Avatar</h3>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Photo of Person</label>
        <div id="avatar-upload-zone"
          class="p-6 rounded-lg border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 transition-colors">
          <svg class="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <p class="text-gray-400 text-sm">Drop photo or click to upload</p>
          <p class="text-gray-600 text-xs">Clear face photo, PNG/JPG</p>
          <input type="file" id="avatar-file" accept="image/*" class="hidden">
        </div>
        <div id="avatar-preview" class="mt-2 hidden">
          <img id="avatar-preview-img" class="w-20 h-20 rounded-full object-cover mx-auto border-2 border-violet-500/50">
        </div>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Audio Source</label>
        <div class="flex gap-2">
          <input id="avatar-audio-url" type="url"
            class="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            placeholder="Audio URL or upload voice sample">
          <button id="avatar-upload-audio"
            class="px-3 py-2 rounded-lg bg-white/10 text-gray-400 text-sm hover:text-white hover:bg-white/20 transition-colors">
            Upload
          </button>
        </div>
        <input type="file" id="avatar-audio-file" accept="audio/*" class="hidden">
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">Or Enter Text (TTS)</label>
        <textarea id="avatar-text" rows="2"
          class="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
          placeholder="Hi, I'm excited to show you..."></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Model</label>
          <select id="avatar-model"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="kling-v2-avatar-pro">Kling Avatar Pro</option>
            <option value="wan2.2-speech-to-video">Wan 2.2 Speech→Video</option>
            <option value="infinitetalk-image-to-video">InfiniteTalk</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Duration</label>
          <select id="avatar-duration"
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="5">5 seconds</option>
            <option value="10" selected>10 seconds</option>
            <option value="15">15 seconds</option>
          </select>
        </div>
      </div>
      
      <button id="generate-avatar-btn"
        class="w-full p-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Generate Talking Avatar
      </button>
    </div>
    
    <div id="avatar-result" class="mt-4 hidden">
      <label class="block text-xs text-gray-500 mb-2">Generated Avatar Video</label>
      <video id="avatar-video" controls class="w-full rounded-lg border border-white/10"></video>
      <div class="flex gap-2 mt-3">
        <button id="avatar-download" class="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/20 transition-colors">Download</button>
        <button id="avatar-use" class="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-sm text-white font-semibold hover:bg-violet-500 transition-colors">Use in Editor</button>
      </div>
    </div>
  `;

  const uploadZone = container.querySelector('#avatar-upload-zone');
  const fileInput = container.querySelector('#avatar-file');
  const previewDiv = container.querySelector('#avatar-preview');
  const previewImg = container.querySelector('#avatar-preview-img');
  const audioFileInput = container.querySelector('#avatar-audio-file');
  const audioUrlInput = container.querySelector('#avatar-audio-url');
  const uploadAudioBtn = container.querySelector('#avatar-upload-audio');
  const generateBtn = container.querySelector('#generate-avatar-btn');
  const resultDiv = container.querySelector('#avatar-result');
  const videoEl = container.querySelector('#avatar-video');

  let photoFile = null;

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => e.preventDefault());
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handlePhoto(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handlePhoto(fileInput.files[0]);
  });

  function handlePhoto(file) {
    photoFile = file;
    previewImg.src = URL.createObjectURL(file);
    previewDiv.classList.remove('hidden');
  }

  uploadAudioBtn.addEventListener('click', () => audioFileInput.click());
  audioFileInput.addEventListener('change', () => {
    if (audioFileInput.files.length) {
      audioUrlInput.value = URL.createObjectURL(audioFileInput.files[0]);
    }
  });

  generateBtn.addEventListener('click', () => {
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    setTimeout(() => {
      resultDiv.classList.remove('hidden');
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Generate Talking Avatar';
    }, 3000);
  });

  container.querySelector('#avatar-use')?.addEventListener('click', () => {
    if (onAvatarReady) {
      onAvatarReady({
        videoUrl: videoEl.src,
        photoUrl: previewImg.src,
        audioUrl: audioUrlInput.value,
        text: container.querySelector('#avatar-text').value,
      });
    }
  });

  return container;
}
