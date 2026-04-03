export default function KeyboardShortcutsModal({ onClose }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  const shortcuts = [
    {
      category: 'Playback',
      shortcuts: [
        { keys: ['Space'], description: 'Play/Pause video' },
        { keys: ['←'], description: 'Rewind 5 seconds' },
        { keys: ['→'], description: 'Forward 5 seconds' },
        { keys: ['Home'], description: 'Jump to start' },
        { keys: ['End'], description: 'Jump to end' },
        { keys: ['Ctrl', '+'], description: 'Increase playback speed' },
        { keys: ['Ctrl', '−'], description: 'Decrease playback speed' },
      ],
    },
    {
      category: 'Timeline',
      shortcuts: [
        { keys: ['Mouse Wheel'], description: 'Zoom timeline in/out' },
        { keys: ['Click', '+', 'Drag'], description: 'Pan timeline' },
        { keys: ['Ctrl', '+', 'A'], description: 'Select all overlays' },
        { keys: ['Delete'], description: 'Delete selected overlays' },
        { keys: ['Ctrl', '+', 'C'], description: 'Copy selected overlays' },
        { keys: ['Ctrl', '+', 'V'], description: 'Paste overlays' },
      ],
    },
    {
      category: 'Editing',
      shortcuts: [
        { keys: ['Ctrl', '+', 'Z'], description: 'Undo last action' },
        { keys: ['Ctrl', '+', 'Y'], description: 'Redo last action' },
        { keys: ['Ctrl', '+', 'S'], description: 'Save project' },
        { keys: ['Ctrl', '+', 'N'], description: 'New project' },
        { keys: ['Ctrl', '+', 'O'], description: 'Open project' },
        { keys: ['F2'], description: 'Rename selected item' },
      ],
    },
    {
      category: 'Overlays',
      shortcuts: [
        { keys: ['T'], description: 'Add text overlay' },
        { keys: ['I'], description: 'Add image overlay' },
        { keys: ['F'], description: 'Add form overlay' },
        { keys: ['C'], description: 'Add CTA overlay' },
        { keys: ['P'], description: 'Add popup overlay' },
        { keys: ['Escape'], description: 'Deselect current overlay' },
      ],
    },
    {
      category: 'Navigation',
      shortcuts: [
        { keys: ['Ctrl', '+', '1'], description: 'Switch to Getting Started' },
        { keys: ['Ctrl', '+', '2'], description: 'Switch to Editor' },
        { keys: ['Ctrl', '+', '3'], description: 'Switch to Publisher' },
        { keys: ['Ctrl', '+', '4'], description: 'Switch to Landing Pages' },
        { keys: ['F1'], description: 'Show help' },
        { keys: ['F11'], description: 'Toggle fullscreen' },
      ],
    },
    {
      category: 'Personalization',
      shortcuts: [
        { keys: ['Ctrl', '+', 'P'], description: 'Open personalizer' },
        { keys: ['{{}}'], description: 'Insert token (type {{TOKEN}})' },
        { keys: ['Ctrl', '+', 'Shift', '+', 'P'], description: 'Preview personalization' },
      ],
    },
  ];

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white flex items-center gap-2">
          <svg class="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Keyboard Shortcuts
        </h3>
        <button id="shortcuts-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="mb-4 p-3 bg-violet-600/20 rounded-lg">
        <p class="text-sm text-violet-300 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <strong>Tip:</strong> Enable keyboard shortcuts in Settings for full functionality
        </p>
      </div>

      <div class="space-y-6">
        ${shortcuts.map(category => `
          <div class="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
            <h4 class="text-lg font-semibold text-white mb-3">${category.category}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${category.shortcuts.map(shortcut => `
                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-300">${shortcut.description}</span>
                  <div class="flex gap-1">
                    ${shortcut.keys.map((key, index) => `
                      <kbd class="bg-white/20 text-white text-xs px-2 py-1 rounded font-mono ${
                        index > 0 ? 'ml-1' : ''
                      }">
                        ${key}
                      </kbd>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex gap-3 justify-end mt-8 pt-4 border-t border-white/10">
        <button id="shortcuts-print" class="px-3 py-1.5 rounded bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm">
          Print
        </button>
        <button id="shortcuts-customize" class="px-3 py-1.5 rounded bg-violet-600 text-white hover:bg-violet-500 transition-colors text-sm">
          Customize
        </button>
      </div>
    </div>
  `;

  // Event handlers
  modal.querySelector('#shortcuts-close').addEventListener('click', () => {
    if (onClose) onClose();
    modal.remove();
  });

  modal.querySelector('#shortcuts-print')?.addEventListener('click', () => {
    window.print();
  });

  modal.querySelector('#shortcuts-customize')?.addEventListener('click', () => {
    // Future: Open customization modal
    alert('Keyboard shortcut customization coming soon!');
  });

  // Keyboard shortcuts for the modal itself
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      if (onClose) onClose();
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  modal.addEventListener('remove', () => {
    document.removeEventListener('keydown', handleEscape);
  });

  return modal;
}

// Convenience function to show keyboard shortcuts
export function showKeyboardShortcuts(onClose) {
  const modal = KeyboardShortcutsModal({ onClose });
  document.body.appendChild(modal);
  return modal;
}

// Keyboard shortcut manager
export class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = localStorage.getItem('remix-go-keyboardShortcuts') === 'true';
    this.setupDefaultShortcuts();
    this.bindGlobalShortcuts();
  }

  setupDefaultShortcuts() {
    // Playback shortcuts
    this.addShortcut('Space', () => this.triggerPlayback('toggle'), 'Toggle play/pause');
    this.addShortcut('ArrowLeft', () => this.triggerPlayback('rewind'), 'Rewind 5 seconds');
    this.addShortcut('ArrowRight', () => this.triggerPlayback('forward'), 'Forward 5 seconds');
    this.addShortcut('Home', () => this.triggerPlayback('start'), 'Jump to start');
    this.addShortcut('End', () => this.triggerPlayback('end'), 'Jump to end');

    // Editing shortcuts
    this.addShortcut('Control+z', () => this.triggerAction('undo'), 'Undo');
    this.addShortcut('Control+y', () => this.triggerAction('redo'), 'Redo');
    this.addShortcut('Control+s', (e) => {
      e.preventDefault();
      this.triggerAction('save');
    }, 'Save project');
    this.addShortcut('Delete', () => this.triggerAction('delete'), 'Delete selected');

    // Overlay shortcuts
    this.addShortcut('t', () => this.triggerOverlay('text'), 'Add text overlay');
    this.addShortcut('i', () => this.triggerOverlay('image'), 'Add image overlay');
    this.addShortcut('f', () => this.triggerOverlay('form'), 'Add form overlay');
    this.addShortcut('c', () => this.triggerOverlay('cta'), 'Add CTA overlay');
    this.addShortcut('p', () => this.triggerOverlay('popup'), 'Add popup overlay');

    // Navigation shortcuts
    this.addShortcut('F1', () => showKeyboardShortcuts(), 'Show keyboard shortcuts');
    this.addShortcut('Control+1', () => this.triggerNavigation('getting-started'), 'Go to Getting Started');
    this.addShortcut('Control+2', () => this.triggerNavigation('editor'), 'Go to Editor');
    this.addShortcut('Control+3', () => this.triggerNavigation('publisher'), 'Go to Publisher');
    this.addShortcut('Control+4', () => this.triggerNavigation('landing-page'), 'Go to Landing Pages');
  }

  addShortcut(keys, callback, description) {
    const keyCombo = this.normalizeKeys(keys);
    this.shortcuts.set(keyCombo, { callback, description });
  }

  normalizeKeys(keys) {
    if (typeof keys === 'string') {
      return keys.toLowerCase().replace(/\s*\+\s*/g, '+');
    }
    return keys.join('+').toLowerCase();
  }

  bindGlobalShortcuts() {
    if (!this.enabled) return;

    document.addEventListener('keydown', (e) => {
      if (this.isInputElement(e.target)) return;

      const keys = [];
      if (e.ctrlKey || e.metaKey) keys.push('control');
      if (e.shiftKey) keys.push('shift');
      if (e.altKey) keys.push('alt');
      keys.push(e.key);

      const keyCombo = this.normalizeKeys(keys.join('+'));

      const shortcut = this.shortcuts.get(keyCombo) || this.shortcuts.get(e.key.toLowerCase());
      if (shortcut) {
        e.preventDefault();
        shortcut.callback(e);
      }
    });
  }

  isInputElement(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || tagName === 'select' ||
           element.contentEditable === 'true' || element.hasAttribute('data-gramm');
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('remix-go-keyboardShortcuts', enabled.toString());
  }

  // Placeholder methods - these should be connected to actual app functionality
  triggerPlayback(action) {
    console.log('Playback:', action);
    // TODO: Connect to video player
  }

  triggerAction(action) {
    console.log('Action:', action);
    // TODO: Connect to editor actions
  }

  triggerOverlay(type) {
    console.log('Add overlay:', type);
    // TODO: Connect to overlay creation
  }

  triggerNavigation(page) {
    console.log('Navigate to:', page);
    // TODO: Connect to router
  }

  getShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([keys, info]) => ({
      keys: keys.split('+'),
      description: info.description,
    }));
  }
}

// Global instance
let shortcutManager = null;

export function getShortcutManager() {
  if (!shortcutManager) {
    shortcutManager = new KeyboardShortcutManager();
  }
  return shortcutManager;
}
