export default function ConstructionScene({ onPopcornInitialize }) {
  const container = document.createElement('div');
  container.className = 'construction-scene w-full h-full bg-gray-900';

  let embedWrapper = null;
  let popcornWrapper = null;
  let updateSceneSize = null;

  function initializePopcorn() {
    if (popcornWrapper && onPopcornInitialize) {
      onPopcornInitialize(popcornWrapper);
    }
  }

  function sceneResize() {
    if (updateSceneSize) {
      updateSceneSize();
    }
  }

  function render() {
    container.innerHTML = `
      <div class="embed-wrapper w-full h-full relative">
        <div id="video-container-scene" class="construction-container w-full h-full" data-butter="target">
          <div class="popcorn-wrapper w-full h-full"></div>
        </div>
      </div>
    `;

    embedWrapper = container.querySelector('.embed-wrapper');
    popcornWrapper = container.querySelector('.popcorn-wrapper');

    // Initialize after DOM insertion
    setTimeout(() => {
      initializePopcorn();
      if (window.videoResizer) {
        updateSceneSize = window.videoResizer(embedWrapper);
      }
      window.addEventListener('resize', sceneResize);
      sceneResize();
    }, 100);
  }

  function cleanup() {
    window.removeEventListener('resize', sceneResize);
  }

  render();

  container.addEventListener('remove', cleanup);

  container.api = {
    sceneResize,
    getPopcornWrapper: () => popcornWrapper,
    getEmbedWrapper: () => embedWrapper
  };

  return container;
}
