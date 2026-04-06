export default function AudioSelectionWorkspace({ onAudioSelected, className = '' }) {
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
    }
  };

  const container = document.createElement('div');
  container.className = `audio-selection-workspace ${className}`;

  function loadAudio(scope, query = '', offset = 0) {
    const scopeData = state[scope];
    if (scopeData.loading) return;

    scopeData.loading = true;
    render();

    // Simulate API call
    setTimeout(() => {
      const mockAudio = Array.from({ length: 12 }, (_, i) => ({
        id: `${scope}-audio-${offset + i}`,
        title: `Audio Track ${offset + i + 1}`,
        url: `https://example.com/audio-${offset + i}.mp3`,
        duration: Math.floor(Math.random() * 300) + 30,
        type: ['music', 'voice', 'effect'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));

      const filteredAudio = query ?
        mockAudio.filter(a => a.title.toLowerCase().includes(query.toLowerCase())) :
        mockAudio;

      if (offset === 0) {
        scopeData.elements = filteredAudio;
      } else {
        scopeData.elements = [...scopeData.elements, ...filteredAudio];
      }

      scopeData.hasMore = filteredAudio.length >= 12;
      scopeData.loading = false;
      render();
    }, 1000);
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
            placeholder="Search audio...">
          <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
        </div>

        <div class="audio-list space-y-2">
          ${scopeData.elements.map((audio, idx) => `
            <div class="audio-item bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-violet-500 transition-all">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <i class="fa fa-music text-gray-400"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-white truncate">${audio.title}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-gray-500">${audio.type}</span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-xs text-gray-500">${Math.floor(audio.duration / 60)}:${(audio.duration % 60).toString().padStart(2, '0')}</span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-xs text-gray-500">${new Date(audio.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <button class="play-btn w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                            data-url="${audio.url}" data-title="${audio.title}">
                      <i class="fa fa-play text-gray-400 text-xs"></i>
                    </button>
                    <div class="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-violet-500 rounded-full" style="width: 0%"></div>
                    </div>
                    <span class="text-xs text-gray-500 w-12 text-right">0:00</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="use-btn px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition-colors"
                          data-audio-id="${audio.id}">
                    Use Audio
                  </button>
                  ${state.scope === 'uploads' ? `
                    <input type="text" value="${audio.title}" class="rename-input px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm rounded focus:outline-none focus:border-violet-500 w-32"
                           data-audio-id="${audio.id}">
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}

          ${scopeData.hasMore ? `
            <div class="load-more flex justify-center py-4">
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
              <i class="fa fa-music text-gray-600 text-2xl"></i>
            </div>
            <h3 class="text-lg text-white font-medium mb-2">No audio found</h3>
            <p class="text-sm text-gray-500">Try adjusting your search or upload some audio files</p>
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
            loadAudio(newScope);
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
        loadAudio(state.scope, query);
      });
    }

    container.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.dataset.url;
        const title = btn.dataset.title;

        // Simple audio preview
        const audio = new Audio(url);
        audio.play();

        // Update button icon
        btn.innerHTML = '<i class="fa fa-pause text-violet-400 text-xs"></i>';
        btn.classList.add('playing');

        audio.onended = () => {
          btn.innerHTML = '<i class="fa fa-play text-gray-400 text-xs"></i>';
          btn.classList.remove('playing');
        };
      });
    });

    container.querySelectorAll('.use-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const audioId = btn.dataset.audioId;
        const audio = state[state.scope].elements.find(a => a.id === audioId);
        if (audio && onAudioSelected) {
          onAudioSelected(audio);
        }
      });
    });

    container.querySelectorAll('.rename-input').forEach(input => {
      input.addEventListener('blur', async (e) => {
        const audioId = input.dataset.audioId;
        const newName = e.target.value;
        // Simulate rename API call
        console.log('Renaming audio', audioId, 'to', newName);
      });
    });

    const loadMoreBtn = container.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        loadAudio(state.scope, state[state.scope].query, state[state.scope].elements.length);
      });
    }
  }

  // Initial load
  loadAudio(state.scope);
  render();

  container.api = {
    loadAudio,
    getCurrentScope: () => state.scope,
    getAudio: (scope) => state[scope]?.elements || []
  };

  return container;
}
