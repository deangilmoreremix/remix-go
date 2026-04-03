export function createEditor(containerId) {
  if (!window.grapesjs) {
    console.warn('GrapesJS not loaded');
    return null;
  }
  return window.grapesjs.init({
    container: containerId,
    height: '100vh',
    width: 'auto',
    fromElement: true,

    storageManager: {
      type: 'local',
      autosave: true,
      autoload: true,
      stepsBeforeSave: 1,
      id: 'remix-go-',
    },

    deviceManager: {
      devices: [
        { name: 'Desktop', width: '' },
        { name: 'Tablet', width: '768px' },
        { name: 'Mobile', width: '375px' },
      ],
    },

    panels: { defaults: [] },

    blockManager: {
      appendTo: '#blocks',
    },

    styleManager: {
      appendTo: '#styles',
      sectors: [
        { name: 'Dimension', buildProps: ['width', 'height', 'max-width', 'min-height'] },
        { name: 'Typography', buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'text-align', 'line-height'] },
        { name: 'Decorations', buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'background'] },
        { name: 'Extra', buildProps: ['opacity', 'cursor', 'overflow'] },
      ],
    },

    layerManager: {
      appendTo: '#layers',
    },

    traitManager: {
      appendTo: '#traits',
    },

    selectorManager: {
      appendTo: '#selectors',
    },
  });
}
