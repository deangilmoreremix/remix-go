export default function CheckpointsList({ checkpoints = [], onCheckpointSelect }) {
  const container = document.createElement('div');
  container.className = 'checkpoints-list w-full bg-gray-900 border-t border-gray-800';

  function render() {
    container.innerHTML = `
      <div class="thumbnail-canvas w-full">
        <div class="thumbnail-canvas-scroll flex gap-2 p-4 overflow-x-auto">
          ${checkpoints.map((checkpoint, idx) => `
            <div class="thumbnail-wrapper flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                 data-checkpoint="${checkpoint}"
                 data-index="${idx}">
              <div class="w-24 h-16 bg-gray-800 rounded-lg border border-gray-700 hover:border-violet-500 flex items-center justify-center">
                <div class="text-center">
                  <i class="fa fa-play text-gray-400 text-sm mb-1"></i>
                  <div class="text-xs text-gray-400">${formatTime(checkpoint)}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    attachEventListeners();
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function attachEventListeners() {
    container.querySelectorAll('.thumbnail-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const checkpoint = parseFloat(wrapper.dataset.checkpoint);
        if (onCheckpointSelect) {
          onCheckpointSelect(checkpoint);
        }
      });
    });
  }

  render();

  container.api = {
    updateCheckpoints: (newCheckpoints) => {
      checkpoints = newCheckpoints;
      render();
    }
  };

  return container;
}
