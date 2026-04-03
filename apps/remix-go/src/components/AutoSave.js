export default class AutoSave {
  constructor(options = {}) {
    this.options = {
      interval: 30000, // 30 seconds
      maxVersions: 10,
      storageKey: 'remix-go-autosave',
      onAutoSave: null,
      enabled: true,
      ...options,
    };

    this.timer = null;
    this.lastSave = null;
    this.versions = [];
    this.currentData = null;

    this.init();
  }

  init() {
    if (this.options.enabled) {
      this.loadSavedVersions();
      this.start();
    }
  }

  start() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      this.save();
    }, this.options.interval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  save(data = null, force = false) {
    if (!this.options.enabled) return;

    const saveData = data || this.currentData;
    if (!saveData) return;

    const now = Date.now();

    // Don't save if data hasn't changed (unless forced)
    if (!force && this.lastSave && JSON.stringify(saveData) === JSON.stringify(this.lastSave.data)) {
      return;
    }

    const version = {
      id: `save-${now}`,
      timestamp: now,
      data: JSON.parse(JSON.stringify(saveData)), // Deep clone
      size: this.calculateSize(saveData),
    };

    // Add to versions
    this.versions.unshift(version);

    // Limit versions
    if (this.versions.length > this.options.maxVersions) {
      this.versions = this.versions.slice(0, this.options.maxVersions);
    }

    this.lastSave = version;
    this.saveToStorage();

    if (this.options.onAutoSave) {
      this.options.onAutoSave(version);
    }

    // Show toast notification
    if (window.getToastManager) {
      const toastManager = window.getToastManager();
      toastManager.info('Project auto-saved', 'Auto-save');
    }
  }

  loadSavedVersions() {
    try {
      const saved = localStorage.getItem(this.options.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        this.versions = data.versions || [];
        this.lastSave = data.lastSave || null;

        // Clean up old versions
        const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
        this.versions = this.versions.filter(v => v.timestamp > cutoff);
      }
    } catch (error) {
      console.warn('Failed to load auto-save data:', error);
      this.versions = [];
      this.lastSave = null;
    }
  }

  saveToStorage() {
    try {
      const data = {
        versions: this.versions,
        lastSave: this.lastSave,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.options.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save auto-save data:', error);
      // If storage is full, clear old versions
      this.versions = this.versions.slice(0, 3);
      this.saveToStorage();
    }
  }

  setData(data) {
    this.currentData = data;
  }

  getLastSave() {
    return this.lastSave;
  }

  getVersions() {
    return [...this.versions];
  }

  restoreVersion(versionId) {
    const version = this.versions.find(v => v.id === versionId);
    if (version) {
      this.currentData = version.data;
      return version.data;
    }
    return null;
  }

  deleteVersion(versionId) {
    this.versions = this.versions.filter(v => v.id !== versionId);
    this.saveToStorage();
  }

  clearAll() {
    this.versions = [];
    this.lastSave = null;
    this.currentData = null;
    localStorage.removeItem(this.options.storageKey);
  }

  calculateSize(data) {
    return new Blob([JSON.stringify(data)]).size;
  }

  getStorageUsage() {
    const totalSize = this.versions.reduce((sum, v) => sum + v.size, 0);
    return {
      totalVersions: this.versions.length,
      totalSize,
      formattedSize: this.formatBytes(totalSize),
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  setEnabled(enabled) {
    this.options.enabled = enabled;
    if (enabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  // Create UI for version management
  createVersionManager(container) {
    const manager = document.createElement('div');
    manager.className = 'auto-save-manager p-4 bg-white/5 rounded-lg';

    manager.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Auto-Save Versions</h3>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400" id="save-status">
            ${this.lastSave ? `Last saved ${this.formatTimeAgo(this.lastSave.timestamp)}` : 'Not saved yet'}
          </span>
          <button id="manual-save" class="px-3 py-1 text-xs rounded bg-violet-600 hover:bg-violet-500 text-white">
            Save Now
          </button>
        </div>
      </div>

      <div class="space-y-2 mb-4" id="versions-list">
        <!-- Versions will be populated here -->
      </div>

      <div class="flex items-center justify-between text-xs text-gray-400">
        <span id="storage-info">${this.getStorageUsage().formattedSize} used</span>
        <div class="flex gap-2">
          <button id="clear-versions" class="hover:text-red-400 transition-colors">Clear All</button>
          <button id="export-versions" class="hover:text-blue-400 transition-colors">Export</button>
        </div>
      </div>
    `;

    this.renderVersions(manager);

    // Event listeners
    manager.querySelector('#manual-save').addEventListener('click', () => {
      this.save(this.currentData, true);
      this.updateStatus(manager);
    });

    manager.querySelector('#clear-versions').addEventListener('click', () => {
      if (confirm('Clear all auto-save versions? This cannot be undone.')) {
        this.clearAll();
        this.renderVersions(manager);
        this.updateStatus(manager);
      }
    });

    manager.querySelector('#export-versions').addEventListener('click', () => {
      this.exportVersions();
    });

    container.appendChild(manager);
    return manager;
  }

  renderVersions(container) {
    const listEl = container.querySelector('#versions-list');

    if (this.versions.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-4 text-gray-400">
          <p class="text-sm">No saved versions yet</p>
          <p class="text-xs">Auto-save will create versions as you work</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.versions.map(version => `
      <div class="version-item flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full ${version === this.lastSave ? 'bg-green-400' : 'bg-gray-400'}"></div>
          <div>
            <p class="text-sm text-white">${this.formatTimeAgo(version.timestamp)}</p>
            <p class="text-xs text-gray-400">${this.formatBytes(version.size)}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="restore-version px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white"
                  data-version-id="${version.id}">
            Restore
          </button>
          <button class="delete-version px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-500 text-white"
                  data-version-id="${version.id}">
            Delete
          </button>
        </div>
      </div>
    `).join('');

    // Add event listeners
    container.querySelectorAll('.restore-version').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const versionId = e.target.dataset.versionId;
        const data = this.restoreVersion(versionId);
        if (data && this.options.onRestore) {
          this.options.onRestore(data);
        }
      });
    });

    container.querySelectorAll('.delete-version').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const versionId = e.target.dataset.versionId;
        this.deleteVersion(versionId);
        this.renderVersions(container);
      });
    });
  }

  updateStatus(container) {
    const statusEl = container.querySelector('#save-status');
    const storageEl = container.querySelector('#storage-info');

    if (statusEl && this.lastSave) {
      statusEl.textContent = `Last saved ${this.formatTimeAgo(this.lastSave.timestamp)}`;
    }

    if (storageEl) {
      storageEl.textContent = this.getStorageUsage().formattedSize + ' used';
    }
  }

  formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  exportVersions() {
    const data = {
      versions: this.versions,
      exportedAt: new Date().toISOString(),
      app: 'Remix Go',
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remix-go-autosave-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  destroy() {
    this.stop();
    this.clearAll();
  }
}

// Global instance
let autoSave = null;

export function getAutoSave(options = {}) {
  if (!autoSave) {
    autoSave = new AutoSave(options);
  }
  return autoSave;
}

// Convenience functions
export function enableAutoSave() {
  const manager = getAutoSave();
  manager.setEnabled(true);
}

export function disableAutoSave() {
  const manager = getAutoSave();
  manager.setEnabled(false);
}

export function saveNow(data) {
  const manager = getAutoSave();
  manager.save(data, true);
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    getAutoSave();
  });
}

export default AutoSave;
