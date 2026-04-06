export default function Checkpoint({ at, className = '' }) {
  const container = document.createElement('div');
  container.className = `checkpoint thumbnail-container ${className}`;

  let embedWrapper = null;
  let popcornWrapper = null;
  let updateSceneSize = null;

  function initializeCheckpoint() {
    if (popcornWrapper && window.Popcorn) {
      const popcorn = Popcorn(popcornWrapper);
      popcorn.seek(at);

      if (window.videoResizer) {
        updateSceneSize = window.videoResizer(embedWrapper, 2);
      }

      window.addEventListener('resize', sceneResize);
      sceneResize();
    }
  }

  function sceneResize() {
    if (updateSceneSize) {
      updateSceneSize();
    }
  }

  function render() {
    container.innerHTML = `
      <div class="wrapper embed w-full h-full bg-gray-800 rounded-lg overflow-hidden">
        <div id="video-container-${at}" class="construction-container w-full h-full" data-butter="target">
          <div class="popcorn-wrapper w-full h-full"></div>
        </div>
      </div>
    `;

    embedWrapper = container.querySelector('.embed');
    popcornWrapper = container.querySelector('.popcorn-wrapper');

    // Initialize after DOM insertion
    setTimeout(() => {
      initializeCheckpoint();
    }, 100);
  }

  function cleanup() {
    window.removeEventListener('resize', sceneResize);
  }

  render();

  container.addEventListener('remove', cleanup);

  return container;
}
