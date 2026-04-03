export default class UndoRedoManager {
  constructor(options = {}) {
    this.options = {
      maxHistorySize: 50,
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds
      onStateChange: null,
      ...options,
    };

    this.history = [];
    this.currentIndex = -1;
    this.autoSaveTimer = null;
    this.isEnabled = true;

    this.init();
  }

  init() {
    if (this.options.autoSave) {
      this.startAutoSave();
    }

    // Listen for keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  // Record a new state
  record(state, description = 'Action') {
    if (!this.isEnabled) return;

    // Remove any history after current index (when user undid and then did something new)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    const timestamp = Date.now();
    this.history.push({
      state: JSON.parse(JSON.stringify(state)), // Deep clone
      description,
      timestamp,
    });

    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.options.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }

    if (this.options.onStateChange) {
      this.options.onStateChange('record', { description, canUndo: this.canUndo(), canRedo: this.canRedo() });
    }
  }

  // Undo last action
  undo() {
    if (!this.canUndo()) return null;

    this.currentIndex--;
    const state = this.history[this.currentIndex];

    if (this.options.onStateChange) {
      this.options.onStateChange('undo', {
        description: state.description,
        canUndo: this.canUndo(),
        canRedo: this.canRedo()
      });
    }

    return state.state;
  }

  // Redo last undone action
  redo() {
    if (!this.canRedo()) return null;

    this.currentIndex++;
    const state = this.history[this.currentIndex];

    if (this.options.onStateChange) {
      this.options.onStateChange('redo', {
        description: state.description,
        canUndo: this.canUndo(),
        canRedo: this.canRedo()
      });
    }

    return state.state;
  }

  // Check if undo is available
  canUndo() {
    return this.currentIndex > 0;
  }

  // Check if redo is available
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  // Get current state
  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex].state;
    }
    return null;
  }

  // Clear history
  clear() {
    this.history = [];
    this.currentIndex = -1;

    if (this.options.onStateChange) {
      this.options.onStateChange('clear', { canUndo: false, canRedo: false });
    }
  }

  // Get history summary
  getHistory() {
    return this.history.map((entry, index) => ({
      index,
      description: entry.description,
      timestamp: entry.timestamp,
      isCurrent: index === this.currentIndex,
    }));
  }

  // Enable/disable undo/redo
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  // Auto-save functionality
  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      const currentState = this.getCurrentState();
      if (currentState) {
        this.saveToStorage(currentState);
      }
    }, this.options.autoSaveInterval);
  }

  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // Load from auto-save
  loadFromStorage(key = 'remix-go-autosave') {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        return data.state;
      }
    } catch (error) {
      console.warn('Failed to load auto-saved state:', error);
    }
    return null;
  }

  // Save to storage
  saveToStorage(state, key = 'remix-go-autosave') {
    try {
      const data = {
        state,
        timestamp: Date.now(),
        version: '1.0',
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to auto-save state:', error);
    }
  }

  // Clear auto-save
  clearStorage(key = 'remix-go-autosave') {
    localStorage.removeItem(key);
  }

  // Handle keyboard shortcuts
  handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
      return; // Don't interfere with input fields
    }

    const isCtrl = e.ctrlKey || e.metaKey;

    if (isCtrl && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      this.undo();
    } else if ((isCtrl && e.key === 'y') || (isCtrl && e.shiftKey && e.key === 'Z')) {
      e.preventDefault();
      this.redo();
    }
  }

  // Create UI controls
  createControls(container) {
    const controls = document.createElement('div');
    controls.className = 'undo-redo-controls flex items-center gap-2 p-2 bg-white/5 rounded-lg';

    controls.innerHTML = `
      <button id="undo-btn" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
        </svg>
      </button>
      <button id="redo-btn" class="p-2 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
        </svg>
      </button>
      <span class="text-xs text-gray-400 ml-2" id="history-status">No actions</span>
    `;

    const undoBtn = controls.querySelector('#undo-btn');
    const redoBtn = controls.querySelector('#redo-btn');
    const statusEl = controls.querySelector('#history-status');

    // Update button states
    const updateButtons = () => {
      undoBtn.disabled = !this.canUndo();
      redoBtn.disabled = !this.canRedo();

      const history = this.getHistory();
      if (history.length === 0) {
        statusEl.textContent = 'No actions';
      } else {
        const current = history.find(h => h.isCurrent);
        statusEl.textContent = current ? current.description : 'No actions';
      }
    };

    // Initial update
    updateButtons();

    // Listen for state changes
    const originalOnStateChange = this.options.onStateChange;
    this.options.onStateChange = (action, data) => {
      updateButtons();
      if (originalOnStateChange) {
        originalOnStateChange(action, data);
      }
    };

    // Button event listeners
    undoBtn.addEventListener('click', () => this.undo());
    redoBtn.addEventListener('click', () => this.redo());

    container.appendChild(controls);
    return controls;
  }

  // Destroy and cleanup
  destroy() {
    this.stopAutoSave();
    document.removeEventListener('keydown', this.handleKeyboard);
    this.clear();
  }
}

// Global instance factory
let undoRedoManager = null;

export function getUndoRedoManager(options = {}) {
  if (!undoRedoManager) {
    undoRedoManager = new UndoRedoManager(options);
  }
  return undoRedoManager;
}

// Convenience functions
export function recordState(state, description) {
  const manager = getUndoRedoManager();
  manager.record(state, description);
}

export function undo() {
  const manager = getUndoRedoManager();
  return manager.undo();
}

export function redo() {
  const manager = getUndoRedoManager();
  return manager.redo();
}

export function canUndo() {
  const manager = getUndoRedoManager();
  return manager.canUndo();
}

export function canRedo() {
  const manager = getUndoRedoManager();
  return manager.canRedo();
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    getUndoRedoManager();
  });
}

export default UndoRedoManager;
