export default function FilePickerModal({
  accept = '*',
  multiple = false,
  maxSize = 100 * 1024 * 1024, // 100MB default
  onSelect,
  onClose,
  title = 'Select Files'
}) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  let selectedFiles = [];
  let filteredFiles = [];

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">${title}</h3>
        <button id="filepicker-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Upload Zone -->
      <div id="upload-zone" class="border-2 border-dashed border-white/20 rounded-xl p-8 text-center mb-6 transition-colors hover:border-violet-500">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <p class="text-gray-300 mb-2">Drop files here or click to browse</p>
        <p class="text-gray-500 text-sm">Maximum file size: ${formatFileSize(maxSize)}</p>
        <input type="file" id="file-input" ${multiple ? 'multiple' : ''} accept="${accept}" class="hidden">
      </div>

      <!-- Filters and Search -->
      <div class="flex flex-wrap gap-4 mb-4 items-center">
        <div class="flex-1 min-w-[200px]">
          <input type="text" id="search-input" placeholder="Search files..."
            class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500">
        </div>
        <div class="flex gap-2">
          <select id="type-filter" class="p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
          <select id="sort-select" class="p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="date">Date Modified</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      <!-- File Grid -->
      <div class="flex-1 overflow-y-auto">
        <div id="file-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <!-- Files will be populated here -->
        </div>
      </div>

      <!-- Selected Files Summary -->
      <div id="selection-summary" class="mt-4 p-3 bg-violet-600/20 rounded-lg hidden">
        <div class="flex items-center justify-between">
          <span id="selection-count" class="text-sm text-violet-300">0 files selected</span>
          <span id="selection-size" class="text-sm text-violet-400">0 MB total</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 justify-end mt-6 pt-4 border-t border-white/10">
        <button id="filepicker-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          Cancel
        </button>
        <button id="filepicker-select" class="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          Select Files
        </button>
      </div>
    </div>
  `;

  // State management
  let allFiles = [];
  let currentFilter = '';
  let currentSort = 'name';

  // DOM elements
  const uploadZone = modal.querySelector('#upload-zone');
  const fileInput = modal.querySelector('#file-input');
  const fileGrid = modal.querySelector('#file-grid');
  const searchInput = modal.querySelector('#search-input');
  const typeFilter = modal.querySelector('#type-filter');
  const sortSelect = modal.querySelector('#sort-select');
  const selectBtn = modal.querySelector('#filepicker-select');
  const selectionSummary = modal.querySelector('#selection-summary');

  // Initialize with empty state
  updateFileGrid();

  // Event handlers
  modal.querySelector('#filepicker-close').addEventListener('click', () => {
    if (onClose) onClose();
    modal.remove();
  });

  modal.querySelector('#filepicker-cancel').addEventListener('click', () => {
    if (onClose) onClose();
    modal.remove();
  });

  modal.querySelector('#filepicker-select').addEventListener('click', () => {
    if (onSelect && selectedFiles.length > 0) {
      onSelect(multiple ? selectedFiles : selectedFiles[0]);
    }
    modal.remove();
  });

  // Upload zone interactions
  uploadZone.addEventListener('click', () => fileInput.click());

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('border-violet-500', 'bg-violet-500/10');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('border-violet-500', 'bg-violet-500/10');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('border-violet-500', 'bg-violet-500/10');

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  });

  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files);
    handleFiles(files);
  });

  // Search and filter
  searchInput.addEventListener('input', () => {
    updateFileGrid();
  });

  typeFilter.addEventListener('change', () => {
    currentFilter = typeFilter.value;
    updateFileGrid();
  });

  sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    updateFileGrid();
  });

  // File handling
  function handleFiles(files) {
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        showError(`File "${file.name}" is too large. Maximum size: ${formatFileSize(maxSize)}`);
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const fileInfo = {
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        lastModified: file.lastModified,
        category: getFileCategory(file.type),
      };
      allFiles.push(fileInfo);
    });

    updateFileGrid();
  }

  function updateFileGrid() {
    const searchTerm = searchInput.value.toLowerCase();
    let files = allFiles.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm);
      const matchesFilter = !currentFilter || file.category === currentFilter;
      return matchesSearch && matchesFilter;
    });

    // Sort files
    files.sort((a, b) => {
      switch (currentSort) {
        case 'size':
          return b.size - a.size;
        case 'date':
          return b.lastModified - a.lastModified;
        case 'type':
          return a.category.localeCompare(b.category);
        default: // name
          return a.name.localeCompare(b.name);
      }
    });

    filteredFiles = files;
    renderFileGrid(files);
    updateSelectionSummary();
  }

  function renderFileGrid(files) {
    fileGrid.innerHTML = '';

    if (files.length === 0) {
      fileGrid.innerHTML = `
        <div class="col-span-full text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p>No files found</p>
          <p class="text-sm">Upload files or adjust your search</p>
        </div>
      `;
      return;
    }

    files.forEach(file => {
      const fileEl = document.createElement('div');
      const isSelected = selectedFiles.includes(file);

      fileEl.className = `file-item relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-violet-500 bg-violet-600/20' : 'hover:bg-white/5'
      }`;

      fileEl.innerHTML = `
        <div class="aspect-square bg-white/5 flex items-center justify-center p-2">
          ${getFileIcon(file.category)}
        </div>
        <div class="p-2">
          <p class="text-xs text-white truncate" title="${file.name}">${file.name}</p>
          <p class="text-xs text-gray-500">${formatFileSize(file.size)}</p>
        </div>
        ${isSelected ? `
          <div class="absolute top-1 right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        ` : ''}
      `;

      fileEl.addEventListener('click', () => {
        if (multiple) {
          toggleFileSelection(file);
        } else {
          selectedFiles = [file];
          updateFileGrid();
          updateSelectionSummary();
        }
      });

      fileGrid.appendChild(fileEl);
    });
  }

  function toggleFileSelection(file) {
    const index = selectedFiles.indexOf(file);
    if (index > -1) {
      selectedFiles.splice(index, 1);
    } else {
      selectedFiles.push(file);
    }
    updateFileGrid();
    updateSelectionSummary();
  }

  function updateSelectionSummary() {
    const count = selectedFiles.length;
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

    if (count > 0) {
      selectionSummary.classList.remove('hidden');
      modal.querySelector('#selection-count').textContent =
        `${count} file${count > 1 ? 's' : ''} selected`;
      modal.querySelector('#selection-size').textContent =
        `${formatFileSize(totalSize)} total`;
    } else {
      selectionSummary.classList.add('hidden');
    }

    selectBtn.disabled = count === 0;
  }

  return modal;
}

// Utility functions
function getFileCategory(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}

function getFileIcon(category) {
  const icons = {
    image: `<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>`,
    video: `<svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
    </svg>`,
    audio: `<svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
    </svg>`,
    document: `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>`,
  };

  return icons[category] || icons.document;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function showError(message) {
  // Simple error display - could be enhanced to use a toast system
  const errorEl = document.createElement('div');
  errorEl.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg z-50';
  errorEl.textContent = message;
  document.body.appendChild(errorEl);
  setTimeout(() => errorEl.remove(), 3000);
}

// Convenience functions
export function pickFile(options = {}) {
  return new Promise((resolve, reject) => {
    const modal = FilePickerModal({
      multiple: false,
      ...options,
      onSelect: resolve,
      onClose: () => reject(new Error('User cancelled')),
    });
    document.body.appendChild(modal);
  });
}

export function pickFiles(options = {}) {
  return new Promise((resolve, reject) => {
    const modal = FilePickerModal({
      multiple: true,
      ...options,
      onSelect: resolve,
      onClose: () => reject(new Error('User cancelled')),
    });
    document.body.appendChild(modal);
  });
}
