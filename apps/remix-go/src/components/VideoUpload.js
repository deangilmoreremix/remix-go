export default function VideoUpload({ onUpload, accept }) {
  const container = document.createElement('div');
  container.className = 'video-upload';

  container.innerHTML = `
    <div id="upload-zone"
      class="p-8 rounded-xl border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-all">
      <svg class="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      <p class="text-gray-400 text-sm mb-1">Drop video file here or click to browse</p>
      <p class="text-gray-600 text-xs">MP4, WebM, MOV up to 500MB</p>
      <input type="file" id="video-file" accept="${accept || 'video/*'}" class="hidden">
    </div>
    <div id="url-input" class="mt-4">
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-2">Or paste URL</label>
      <div class="flex gap-2">
        <input type="url" id="video-url" placeholder="https://example.com/video.mp4"
          class="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        <button id="load-url-btn"
          class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors">
          Load
        </button>
      </div>
    </div>
    <div id="preview-area" class="mt-4 hidden">
      <div class="flex items-center gap-3 p-3 rounded-lg bg-white/5">
        <div id="video-thumb" class="w-24 h-14 rounded bg-black/50 flex items-center justify-center overflow-hidden">
          <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <p id="video-name" class="text-sm text-white truncate">filename.mp4</p>
          <p id="video-info" class="text-xs text-gray-500">--</p>
        </div>
        <button id="remove-video" class="p-1 text-gray-500 hover:text-red-400 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  `;

  const uploadZone = container.querySelector('#upload-zone');
  const fileInput = container.querySelector('#video-file');
  const urlInput = container.querySelector('#video-url');
  const loadUrlBtn = container.querySelector('#load-url-btn');
  const previewArea = container.querySelector('#preview-area');
  const videoName = container.querySelector('#video-name');
  const videoInfo = container.querySelector('#video-info');
  const removeBtn = container.querySelector('#remove-video');

  function showPreview(name, info, url) {
    previewArea.classList.remove('hidden');
    videoName.textContent = name;
    videoInfo.textContent = info;
    if (onUpload) onUpload({ type: 'url', url, name });
  }

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('border-violet-500', 'bg-violet-500/5');
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('border-violet-500', 'bg-violet-500/5');
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('border-violet-500', 'bg-violet-500/5');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    const url = URL.createObjectURL(file);
    const size = (file.size / (1024 * 1024)).toFixed(1);
    showPreview(file.name, `${size} MB`, url);
  }

  loadUrlBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
      const name = url.split('/').pop().split('?')[0];
      showPreview(name, 'URL', url);
    }
  });

  removeBtn.addEventListener('click', () => {
    previewArea.classList.add('hidden');
    fileInput.value = '';
    urlInput.value = '';
  });

  container.getValue = () => {
    if (fileInput.files.length) return URL.createObjectURL(fileInput.files[0]);
    return urlInput.value.trim() || null;
  };

  return container;
}
