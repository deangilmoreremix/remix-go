export default function ConstructionWorkspace({ onElementSelect, onElementUpdate, onSeek }) {
  const state = {
    popcorn: null,
    activeElement: null,
    currentCheckpoint: null
  };

  const container = document.createElement('div');
  container.className = 'construction-workspace w-full h-full bg-gray-900 relative';

  function initializePopcorn(wrapper) {
    // Initialize Popcorn.js video editor
    if (window.Popcorn) {
      const popcorn = Popcorn(wrapper);
      popcorn.main = true;

      popcorn.on('elementSelected', (event) => {
        const { element } = event;
        state.activeElement = element;
        if (onElementSelect) {
          onElementSelect(element);
        }
      });

      popcorn.on('elementUpdated', (event) => {
        const { element, options } = event;
        if (onElementUpdate) {
          onElementUpdate(element, options);
        }
      });

      state.popcorn = popcorn;
      return popcorn;
    } else {
      console.warn('Popcorn.js not loaded');
      return null;
    }
  }

  function seekToCheckpoint(checkpoint) {
    if (state.popcorn) {
      state.popcorn.seek(checkpoint);
      state.currentCheckpoint = checkpoint;
      if (onSeek) {
        onSeek(checkpoint);
      }
    }
  }

  function resignActiveElement() {
    state.activeElement = null;
    if (state.popcorn) {
      state.popcorn.emit('elementSelected', { element: null });
    }
  }

  function render() {
    container.innerHTML = `
      <div class="video-canvas-container w-full h-full bg-gray-800 relative">
        <div id="popcorn-wrapper" class="w-full h-full">
          <div class="flex items-center justify-center h-full">
            <div class="text-center text-gray-400">
              <i class="fa fa-video-camera text-4xl mb-4"></i>
              <p>Video Editor Canvas</p>
              <p class="text-sm">Initialize Popcorn.js for video editing</p>
            </div>
          </div>
        </div>
        <div class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          <i class="fa fa-clock mr-1"></i>
          Current: ${state.currentCheckpoint || '00:00'}
        </div>
      </div>

      <div class="checkpoints-panel absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
        <div class="flex items-center gap-2 mb-2">
          <i class="fa fa-film text-gray-400"></i>
          <span class="text-sm font-medium text-white">Checkpoints</span>
        </div>
        <div class="checkpoints-list flex gap-2 overflow-x-auto">
          <div class="checkpoint-item flex-shrink-0 w-20 h-16 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-violet-500"
               data-time="00:00">
            <div class="w-full h-full rounded-t-lg bg-gray-700 flex items-center justify-center">
              <i class="fa fa-play text-gray-400 text-xs"></i>
            </div>
            <div class="text-xs text-gray-400 text-center mt-1">00:00</div>
          </div>
        </div>
      </div>
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    const wrapper = container.querySelector('#popcorn-wrapper');
    if (wrapper) {
      // Initialize Popcorn when component mounts
      setTimeout(() => {
        const popcorn = initializePopcorn(wrapper);
        if (popcorn) {
          // Add video editing controls
          popcorn.on('timeupdate', () => {
            // Update current time display
          });
        }
      }, 100);
    }

    container.addEventListener('click', (e) => {
      if (e.target === container) {
        resignActiveElement();
      }
    });

    container.querySelectorAll('.checkpoint-item').forEach(item => {
      item.addEventListener('click', () => {
        const time = item.dataset.time;
        seekToCheckpoint(time);
      });
    });
  }

  render();

  container.api = {
    seekToCheckpoint,
    resignActiveElement,
    getActiveElement: () => state.activeElement,
    getCurrentCheckpoint: () => state.currentCheckpoint,
    getPopcorn: () => state.popcorn
  };

  return container;
}
