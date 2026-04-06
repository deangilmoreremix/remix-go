export default function VideoSelectionWorkspace({ onVideoSelected, className = '' }) {
  const state = {
    scope: 'library', // 'library' or 'uploads'
    library: {
      hasMore: true,
      elements: [],
      query: '',
      loading: false
    },
    uploads: {
      hasMore: true,
      elements: [],
      query: '',
      loading: false
    },
    currentPlayback: null
  };

  const container = document.createElement('div');
  container.className = `video-selection-workspace ${className}`;

  function loadVideos(scope, query = '', offset = 0) {
    const scopeData = state[scope];
    if (scopeData.loading) return;

    scopeData.loading = true;
    render();

    // Simulate API call
    setTimeout(() => {
      const mockVideos = Array.from({ length: 12 }, (_, i) => ({
        id: `${scope}-${offset + i}`,
        title: `Video ${offset + i + 1}`,
        url: `https://example.com/video-${offset + i}.mp4`,
        thumbnail: `https://images.unsplash.com/photo-${1500000000000 + offset + i}?w=400&h=225&fit=crop`,
        duration: Math.floor(Math.random() * 300) + 30,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));

      const filteredVideos = query ?
        mockVideos.filter(v => v.title.toLowerCase().includes(query.toLowerCase())) :
        mockVideos;

      if (offset === 0) {
        scopeData.elements = filteredVideos;
      } else {
        scopeData.elements = [...scopeData.elements, ...filteredVideos];
      }

      scopeData.hasMore = filteredVideos.length >= 12;
      scopeData.loading = false;
      render();
    }, 1000);
  }

  function onPreview(title, url) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/75';
    modal.innerHTML = `
      <div class="bg-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">${title}</h3>
          <button class="text-gray-400 hover:text-white text-xl" id="close-preview">&times;</button>
        </div>
        <video class="w-full rounded-lg" controls autoplay>
          <source src="${url}" type="video/mp4">
        </video>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#close-preview').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }

  function render() {
    const scopeData = state[state.scope];

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div class="flex bg-gray-800 rounded-lg p-1">
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${state.scope === 'library' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}"
                    data-scope="library">
              Library
            </button>
            <button class="px-4 py-2 rounded text-sm font-medium transition-colors ${state.scope === 'uploads' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}"
                    data-scope="uploads">
              Uploads
            </button>
          </div>
        </div>

        <div class="relative">
          <input type="text" id="search-input"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            placeholder="Search videos...">
          <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
        </div>

        <div class="video-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${scopeData.elements.map((video, idx) => `
            <div class="video-item bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-violet-500 transition-all cursor-pointer group">
              <div class="aspect-video bg-gray-700 relative overflow-hidden">
                <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button class="preview-btn w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                          data-url="${video.url}" data-title="${video.title}">
                    <i class="fa fa-play text-white"></i>
                  </button>
                </div>
                <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  ${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div class="p-3">
                <h4 class="text-sm font-medium text-white truncate">${video.title}</h4>
                <p class="text-xs text-gray-500 mt-1">${new Date(video.createdAt).toLocaleDateString()}</p>
                <div class="flex gap-2 mt-2">
                  <button class="use-btn flex-1 bg-violet-600 text-white text-xs py-1.5 rounded hover:bg-violet-500 transition-colors"
                          data-video-id="${video.id}">
                    Use Video
                  </button>
                  ${state.scope === 'uploads' ? `
                    <input type="text" value="${video.title}" class="rename-input flex-1 px-2 py-1 bg-gray-700 border border-gray-600 text-white text-xs rounded focus:outline-none focus:border-violet-500"
                           data-video-id="${video.id}">
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}

          ${scopeData.hasMore ? `
            <div class="load-more col-span-full flex justify-center py-8">
              <button class="load-more-btn px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors ${scopeData.loading ? 'opacity-50 cursor-not-allowed' : ''}"
                      ${scopeData.loading ? 'disabled' : ''}>
                ${scopeData.loading ? '<i class="fa fa-spinner fa-spin mr-2"></i>Loading...' : '<i class="fa fa-plus mr-2"></i>Load More'}
              </button>
            </div>
          ` : ''}
        </div>

        ${scopeData.elements.length === 0 && !scopeData.loading ? `
          <div class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-video text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No videos found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or upload some videos</p>
          </div>
        ` : ''}
      </div>
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    container.querySelectorAll('[data-scope]').forEach(btn => {
      btn.addEventListener('click', () => {
        const newScope = btn.dataset.scope;
        if (newScope !== state.scope) {
          state.scope = newScope;
          if (state[newScope].elements.length === 0) {
            loadVideos(newScope);
          }
          render();
        }
      });
    });

    const searchInput = container.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        state[state.scope].query = query;
        loadVideos(state.scope, query);
      });
    }

    container.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.dataset.url;
        const title = btn.dataset.title;
        onPreview(title, url);
      });
    });

    container.querySelectorAll('.use-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const videoId = btn.dataset.videoId;
        const video = state[state.scope].elements.find(v => v.id === videoId);
        if (video && onVideoSelected) {
          onVideoSelected(video);
        }
      });
    });

    container.querySelectorAll('.rename-input').forEach(input => {
      input.addEventListener('blur', async (e) => {
        const videoId = input.dataset.videoId;
        const newName = e.target.value;
        // Simulate rename API call
        console.log('Renaming video', videoId, 'to', newName);
      });
    });

    const loadMoreBtn = container.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        loadVideos(state.scope, state[state.scope].query, state[state.scope].elements.length);
      });
    }
  }

  // Initial load
  loadVideos(state.scope);
  render();

  container.api = {
    loadVideos,
    getCurrentScope: () => state.scope,
    getVideos: (scope) => state[scope]?.elements || []
  };

  return container;
}
