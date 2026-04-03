export function initPopcorn(videoElement) {
  if (!window.Popcorn) {
    console.warn('Popcorn.js not loaded');
    return null;
  }
  return window.Popcorn(videoElement);
}

export function createPlayer(container, src) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  video.setAttribute('playsinline', '');
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'contain';
  video.src = src;
  container.innerHTML = '';
  container.appendChild(video);

  const p = initPopcorn(video);
  return { video, popcorn: p };
}

export function addTextOverlay(popcorn, options) {
  if (!popcorn) return;
  popcorn.text({
    start: options.start || 0,
    end: options.end || 5,
    text: options.text || '',
    target: options.target || 'overlay-container',
    top: options.top || '10%',
    left: options.left || '10%',
    width: options.width || '80%',
  });
}

export function addFormOverlay(popcorn, options) {
  if (!popcorn) return;
  popcorn.form({
    start: options.start || 0,
    end: options.end || 9999,
    target: options.target || 'overlay-container',
    caption: options.caption || 'Enter your details',
    elements: options.elements || [{ type: 'email', label: 'Email', token: 'EMAIL' }],
    btnText: options.btnText || 'Submit',
    fontFamily: options.fontFamily || 'Arial',
    fontSize: options.fontSize || 100,
    fontColor: options.fontColor || '#ffffff',
    backgroundColor: options.backgroundColor || '#000000',
    webhook: options.webhook || '',
  });
}

export function addImageOverlay(popcorn, options) {
  if (!popcorn) return;
  popcorn.image({
    start: options.start || 0,
    end: options.end || 5,
    src: options.src || '',
    target: options.target || 'overlay-container',
    top: options.top || '0',
    left: options.left || '0',
    width: options.width || '100%',
    click: options.click || {},
  });
}

export function addPopupOverlay(popcorn, options) {
  if (!popcorn) return;
  popcorn.popup({
    start: options.start || 0,
    end: options.end || 5,
    target: options.target || 'overlay-container',
    text: options.text || '',
    link: options.link || '',
    type: options.type || 'default',
  });
}

export default {
  initPopcorn,
  createPlayer,
  addTextOverlay,
  addFormOverlay,
  addImageOverlay,
  addPopupOverlay,
};
