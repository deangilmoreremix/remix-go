export default function ImageUpload({ onUpload, accept }) {
  const container = document.createElement('div');
  container.className = 'image-upload';

  container.innerHTML = `
    <div id="img-upload-zone"
      class="p-6 rounded-xl border-2 border-dashed border-white/10 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-all">
      <svg class="w-10 h-10 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <p class="text-gray-400 text-sm mb-1">Drop image here or click to browse</p>
      <p class="text-gray-600 text-xs">PNG, JPG, SVG, WebP</p>
      <input type="file" id="img-file" accept="${accept || 'image/*'}" class="hidden">
    </div>
    <div id="img-url-input" class="mt-3">
      <div class="flex gap-2">
        <input type="url" id="img-url" placeholder="Or paste image URL..."
          class="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500">
        <button id="img-load-url"
          class="px-3 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors">Load</button>
      </div>
    </div>
    <div id="img-preview" class="mt-3 hidden">
      <div class="relative inline-block">
        <img id="img-preview-src" class="max-h-32 rounded-lg border border-white/10" alt="preview">
        <button id="img-remove" class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-400 transition-colors">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  `;

  const uploadZone = container.querySelector('#img-upload-zone');
  const fileInput = container.querySelector('#img-file');
  const urlInput = container.querySelector('#img-url');
  const loadUrlBtn = container.querySelector('#img-load-url');
  const preview = container.querySelector('#img-preview');
  const previewImg = container.querySelector('#img-preview-src');
  const removeBtn = container.querySelector('#img-remove');

  function showPreview(url) {
    preview.classList.remove('hidden');
    previewImg.src = url;
    if (onUpload) onUpload({ type: 'url', url });
  }

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
      const url = URL.createObjectURL(e.dataTransfer.files[0]);
      showPreview(url);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      showPreview(URL.createObjectURL(fileInput.files[0]));
    }
  });

  loadUrlBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) showPreview(url);
  });

  removeBtn.addEventListener('click', () => {
    preview.classList.add('hidden');
    previewImg.src = '';
    fileInput.value = '';
    urlInput.value = '';
  });

  container.getValue = () => previewImg.src || null;

  return container;
}
