export default function TemplateSystem({ onSelect, onImport }) {
  const state = {
    templates: [
      {
        id: 'welcome-video',
        name: 'Welcome Video',
        category: 'Onboarding',
        thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f1c59?w=400&h=225&fit=crop',
        duration: 30,
        tags: ['intro', 'welcome', 'company'],
        popular: true,
        createdAt: '2024-01-15',
        lastUsed: '2024-03-10'
      },
      {
        id: 'product-demo',
        name: 'Product Demo',
        category: 'Marketing',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
        duration: 90,
        tags: ['demo', 'features', 'showcase'],
        popular: true,
        createdAt: '2024-01-20',
        lastUsed: '2024-03-12'
      },
      {
        id: 'testimonial',
        name: 'Customer Testimonial',
        category: 'Social Proof',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
        duration: 60,
        tags: ['review', 'testimonial', 'feedback'],
        popular: false,
        createdAt: '2024-02-01',
        lastUsed: '2024-03-08'
      },
      {
        id: 'how-to',
        name: 'How-To Guide',
        category: 'Educational',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
        duration: 180,
        tags: ['tutorial', 'guide', 'education'],
        popular: false,
        createdAt: '2024-02-10',
        lastUsed: '2024-03-05'
      },
      {
        id: 'event-invite',
        name: 'Event Invitation',
        category: 'Events',
        thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=225&fit=crop',
        duration: 45,
        tags: ['event', 'invite', 'announcement'],
        popular: true,
        createdAt: '2024-02-15',
        lastUsed: '2024-03-14'
      },
      {
        id: 'sale-promo',
        name: 'Sale Promotion',
        category: 'Marketing',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop',
        duration: 30,
        tags: ['sale', 'promo', 'discount'],
        popular: false,
        createdAt: '2024-02-20',
        lastUsed: '2024-03-01'
      },
      {
        id: 'team-intro',
        name: 'Team Introduction',
        category: 'Onboarding',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f012c7c71?w=400&h=225&fit=crop',
        duration: 120,
        tags: ['team', 'intro', 'culture'],
        popular: false,
        createdAt: '2024-02-25',
        lastUsed: '2024-02-28'
      },
      {
        id: 'announcement',
        name: 'Company Announcement',
        category: 'Internal',
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop',
        duration: 45,
        tags: ['news', 'update', 'announcement'],
        popular: false,
        createdAt: '2024-03-01',
        lastUsed: '2024-03-10'
      }
    ],
    categories: ['All', 'Onboarding', 'Marketing', 'Educational', 'Social Proof', 'Events', 'Internal'],
    selectedCategory: 'All',
    searchQuery: '',
    viewMode: 'grid',
    sortBy: 'name',
    showImportModal: false
  };

  const container = document.createElement('div');
  container.className = 'template-system flex flex-col h-full bg-gray-900';

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  }

  function getFilteredTemplates() {
    let filtered = state.templates;

    if (state.selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === state.selectedCategory);
    }

    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (state.sortBy === 'name') return a.name.localeCompare(b.name);
      if (state.sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      if (state.sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (state.sortBy === 'duration') return a.duration - b.duration;
      return 0;
    });

    return filtered;
  }

  function render() {
    const filtered = getFilteredTemplates();

    container.innerHTML = `
      <div class="template-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Template Library</h2>
            <p class="text-xs text-gray-400">${state.templates.length} templates available</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button id="import-btn" class="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i class="fa fa-upload"></i> Import
          </button>
          <button id="create-btn" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-plus"></i> Create New
          </button>
        </div>
      </div>

      <div class="p-4 border-b border-gray-800 space-y-4">
        <div class="flex items-center gap-4">
          <div class="flex-1 relative">
            <input id="search-input" type="text" value="${state.searchQuery}"
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
              placeholder="Search templates by name, category, or tags...">
            <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          </div>

          <select id="sort-select" class="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
            <option value="name" ${state.sortBy === 'name' ? 'selected' : ''}>Name</option>
            <option value="popular" ${state.sortBy === 'popular' ? 'selected' : ''}>Popularity</option>
            <option value="recent" ${state.sortBy === 'recent' ? 'selected' : ''}>Recently Added</option>
            <option value="duration" ${state.sortBy === 'duration' ? 'selected' : ''}>Duration</option>
          </select>

          <div class="flex border border-gray-700 rounded-lg p-1">
            <button class="view-btn px-3 py-1 rounded ${state.viewMode === 'grid' ? 'bg-violet-500/20 text-violet-400' : 'text-gray-400'} text-sm transition-colors"
                    data-view="grid">
              <i class="fa fa-th-large"></i>
            </button>
            <button class="view-btn px-3 py-1 rounded ${state.viewMode === 'list' ? 'bg-violet-500/20 text-violet-400' : 'text-gray-400'} text-sm transition-colors"
                    data-view="list">
              <i class="fa fa-list"></i>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          ${state.categories.map(cat => `
            <button class="category-btn px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${state.selectedCategory === cat ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}"
                    data-category="${cat}">
              ${cat}
              ${cat !== 'All' ? `<span class="ml-2 text-xs opacity-70">${state.templates.filter(t => t.category === cat).length}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        ${filtered.length === 0 ? `
          <div class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-search text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No templates found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ` : state.viewMode === 'grid' ? `
          <div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            ${filtered.map(template => `
              <div class="template-card group relative rounded-xl bg-gray-800/50 border border-gray-700 hover:border-violet-500 transition-all overflow-hidden cursor-pointer"
                   data-template-id="${template.id}">
                <div class="aspect-video bg-gray-800 relative overflow-hidden">
                  <img src="${template.thumbnail}" alt="${template.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">${formatDuration(template.duration)}</div>
                  ${template.popular ? `
                    <div class="absolute top-2 left-2 px-2 py-1 rounded-full bg-violet-500/90 text-white text-xs flex items-center gap-1">
                      <i class="fa fa-fire"></i> Popular
                    </div>
                  ` : ''}
                  <div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="preview-btn w-10 h-10 rounded-full bg-white/90 text-gray-900 hover:bg-white flex items-center justify-center transition-colors"
                            data-template-id="${template.id}">
                      <i class="fa fa-play"></i>
                    </button>
                  </div>
                </div>
                <div class="p-3">
                  <h3 class="text-sm font-medium text-white truncate">${template.name}</h3>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-xs text-gray-500">${template.category}</span>
                    <span class="text-xs text-gray-500">${new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    ${template.tags.slice(0, 2).map(tag => `
                      <span class="px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 text-xs">${tag}</span>
                    `).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="space-y-2">
            ${filtered.map(template => `
              <div class="template-card flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-violet-500 transition-all cursor-pointer"
                   data-template-id="${template.id}">
                <div class="w-24 aspect-video rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                  <img src="${template.thumbnail}" alt="${template.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-medium text-white">${template.name}</h3>
                    ${template.popular ? `
                      <span class="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                        <i class="fa fa-fire text-[10px]"></i>
                      </span>
                    ` : ''}
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">${template.category}</p>
                  <div class="flex items-center gap-2 mt-1">
                    ${template.tags.slice(0, 3).map(tag => `
                      <span class="px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 text-xs">${tag}</span>
                    `).join('')}
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <div class="text-sm text-white">${formatDuration(template.duration)}</div>
                  <div class="text-xs text-gray-500">${new Date(template.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="apply-btn px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs hover:bg-violet-500 transition-colors"
                          data-template-id="${template.id}">
                    Apply
                  </button>
                  <button class="action-btn w-8 h-8 rounded-lg bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center"
                          data-template-id="${template.id}">
                    <i class="fa fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      ${state.showImportModal ? `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" id="import-modal">
          <div class="w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl">
            <h3 class="text-lg font-semibold text-white mb-4">Import Template</h3>
            <div class="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-violet-500 transition-colors cursor-pointer" id="drop-zone">
              <i class="fa fa-cloud-upload-alt text-4xl text-gray-600 mb-3"></i>
              <p class="text-white font-medium">Drop your template file here</p>
              <p class="text-sm text-gray-500 mt-2">or click to browse</p>
              <input type="file" id="template-file" accept=".json,.remix" class="hidden">
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button id="cancel-import" class="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    const searchInput = container.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        render();
      });
    }

    const sortSelect = container.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        render();
      });
    }

    container.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.viewMode = btn.dataset.view;
        render();
      });
    });

    container.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedCategory = btn.dataset.category;
        render();
      });
    });

    container.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.preview-btn') && !e.target.closest('.apply-btn') && !e.target.closest('.action-btn')) {
          const template = state.templates.find(t => t.id === card.dataset.templateId);
          if (template && onSelect) {
            onSelect(template);
          }
        }
      });
    });

    container.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const template = state.templates.find(t => t.id === btn.dataset.templateId);
        if (template) {
          console.log('Preview template:', template.name);
        }
      });
    });

    container.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const template = state.templates.find(t => t.id === btn.dataset.templateId);
        if (template && onSelect) {
          onSelect(template);
        }
      });
    });

    const importBtn = container.querySelector('#import-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        state.showImportModal = true;
        render();
      });
    }

    const cancelImport = container.querySelector('#cancel-import');
    if (cancelImport) {
      cancelImport.addEventListener('click', () => {
        state.showImportModal = false;
        render();
      });
    }

    const dropZone = container.querySelector('#drop-zone');
    const templateFile = container.querySelector('#template-file');
    if (dropZone && templateFile) {
      dropZone.addEventListener('click', () => templateFile.click());
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-violet-500');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-violet-500');
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-violet-500');
        const files = e.dataTransfer.files;
        if (files.length > 0 && onImport) {
          onImport(files[0]);
          state.showImportModal = false;
          render();
        }
      });
      templateFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0 && onImport) {
          onImport(e.target.files[0]);
          state.showImportModal = false;
          render();
        }
      });
    }

    const importModal = container.querySelector('#import-modal');
    if (importModal) {
      importModal.addEventListener('click', (e) => {
        if (e.target === importModal) {
          state.showImportModal = false;
          render();
        }
      });
    }
  }

  render();

  container.api = {
    getTemplates: () => state.templates,
    addTemplate: (template) => {
      state.templates.push({ ...template, id: Date.now().toString(), createdAt: new Date().toISOString() });
      render();
    },
    removeTemplate: (id) => {
      state.templates = state.templates.filter(t => t.id !== id);
      render();
    }
  };

  return container;
}
