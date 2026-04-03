export default function SettingsModal({ onSave, onClose, initialSettings = {} }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  // Load settings from localStorage or use defaults
  const settings = {
    theme: localStorage.getItem('remix-go-theme') || initialSettings.theme || 'dark',
    language: localStorage.getItem('remix-go-language') || initialSettings.language || 'en',
    autoplay: localStorage.getItem('remix-go-autoplay') === 'true' || initialSettings.autoplay || false,
    showTips: localStorage.getItem('remix-go-showTips') !== 'false' || initialSettings.showTips || true,
    keyboardShortcuts: localStorage.getItem('remix-go-keyboardShortcuts') === 'true' || initialSettings.keyboardShortcuts || false,
    autoSave: localStorage.getItem('remix-go-autoSave') !== 'false' || initialSettings.autoSave || true,
    highContrast: localStorage.getItem('remix-go-highContrast') === 'true' || initialSettings.highContrast || false,
    reducedMotion: localStorage.getItem('remix-go-reducedMotion') === 'true' || initialSettings.reducedMotion || false,
    ...initialSettings,
  };

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">Settings</h3>
        <button id="settings-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- Appearance -->
        <div class="border-b border-white/10 pb-4">
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Appearance</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-300 mb-2">Theme</label>
              <select id="theme-select" class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
                <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
                <option value="auto" ${settings.theme === 'auto' ? 'selected' : ''}>Auto (System)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Language</label>
              <select id="language-select" class="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500">
                <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                <option value="es" ${settings.language === 'es' ? 'selected' : ''}>Español</option>
                <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>Français</option>
                <option value="de" ${settings.language === 'de' ? 'selected' : ''}>Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Behavior -->
        <div class="border-b border-white/10 pb-4">
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Behavior</h4>
          <div class="space-y-3">
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Auto-play videos</span>
              <input id="autoplay-toggle" type="checkbox" ${settings.autoplay ? 'checked' : ''} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Show tips and hints</span>
              <input id="tips-toggle" type="checkbox" ${settings.showTips ? 'checked' : ''} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Enable keyboard shortcuts</span>
              <input id="shortcuts-toggle" type="checkbox" ${settings.keyboardShortcuts ? 'checked' : ''} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Auto-save projects</span>
              <input id="autosave-toggle" type="checkbox" ${settings.autoSave ? 'checked' : ''} class="accent-violet-500">
            </label>
          </div>
        </div>

        <!-- Accessibility -->
        <div class="border-b border-white/10 pb-4">
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Accessibility</h4>
          <div class="space-y-3">
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">High contrast mode</span>
              <input id="contrast-toggle" type="checkbox" ${settings.highContrast ? 'checked' : ''} class="accent-violet-500">
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span class="text-sm text-white">Reduce motion</span>
              <input id="motion-toggle" type="checkbox" ${settings.reducedMotion ? 'checked' : ''} class="accent-violet-500">
            </label>
          </div>
        </div>

        <!-- Storage & Privacy -->
        <div>
          <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Storage & Privacy</h4>
          <div class="space-y-3">
            <button id="clear-cache" class="w-full p-3 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-left">
              Clear Cache & Temporary Files
            </button>
            <button id="reset-settings" class="w-full p-3 rounded-lg bg-red-600/20 text-red-400 hover:text-red-300 hover:bg-red-600/30 transition-colors text-left">
              Reset All Settings
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-3 justify-end mt-8 pt-4 border-t border-white/10">
        <button id="settings-cancel" class="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
          Cancel
        </button>
        <button id="settings-save" class="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  `;

  // Event handlers
  modal.querySelector('#settings-close').addEventListener('click', () => {
    if (onClose) onClose();
    modal.remove();
  });

  modal.querySelector('#settings-cancel').addEventListener('click', () => {
    if (onClose) onClose();
    modal.remove();
  });

  modal.querySelector('#settings-save').addEventListener('click', () => {
    const newSettings = {
      theme: modal.querySelector('#theme-select').value,
      language: modal.querySelector('#language-select').value,
      autoplay: modal.querySelector('#autoplay-toggle').checked,
      showTips: modal.querySelector('#tips-toggle').checked,
      keyboardShortcuts: modal.querySelector('#shortcuts-toggle').checked,
      autoSave: modal.querySelector('#autosave-toggle').checked,
      highContrast: modal.querySelector('#contrast-toggle').checked,
      reducedMotion: modal.querySelector('#motion-toggle').checked,
    };

    // Save to localStorage
    Object.entries(newSettings).forEach(([key, value]) => {
      localStorage.setItem(`remix-go-${key}`, value.toString());
    });

    // Apply theme immediately
    applyTheme(newSettings.theme);
    applyAccessibility(newSettings);

    if (onSave) onSave(newSettings);
    modal.remove();
  });

  modal.querySelector('#clear-cache').addEventListener('click', () => {
    if (confirm('Clear all cached data? This will remove temporary files and cached assets.')) {
      // Clear localStorage (except settings)
      const settingsKeys = Object.keys(localStorage).filter(key =>
        key.startsWith('remix-go-') &&
        !['theme', 'language', 'autoplay', 'showTips', 'keyboardShortcuts', 'autoSave', 'highContrast', 'reducedMotion'].some(setting =>
          key.includes(setting)
        )
      );
      settingsKeys.forEach(key => localStorage.removeItem(key));

      // Clear caches if available
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }

      alert('Cache cleared successfully!');
    }
  });

  modal.querySelector('#reset-settings').addEventListener('click', () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      // Clear all settings
      Object.keys(localStorage).filter(key => key.startsWith('remix-go-')).forEach(key => {
        localStorage.removeItem(key);
      });

      // Reset form
      modal.querySelector('#theme-select').value = 'dark';
      modal.querySelector('#language-select').value = 'en';
      modal.querySelector('#autoplay-toggle').checked = false;
      modal.querySelector('#tips-toggle').checked = true;
      modal.querySelector('#shortcuts-toggle').checked = false;
      modal.querySelector('#autosave-toggle').checked = true;
      modal.querySelector('#contrast-toggle').checked = false;
      modal.querySelector('#motion-toggle').checked = false;

      alert('Settings reset to defaults!');
    }
  });

  // Keyboard shortcuts
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      if (onClose) onClose();
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  return modal;
}

// Helper functions
function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === 'light') {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
  } else if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('light-theme', !prefersDark);
    root.classList.toggle('dark-theme', prefersDark);
  } else {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
  }
}

function applyAccessibility(settings) {
  const root = document.documentElement;

  root.classList.toggle('high-contrast', settings.highContrast);
  root.classList.toggle('reduced-motion', settings.reducedMotion);

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', settings.highContrast ? '#000000' : '#0f0f13');
  }
}

// Export convenience function
export function openSettingsModal(onSave, onClose) {
  const modal = SettingsModal({ onSave, onClose });
  document.body.appendChild(modal);
  return modal;
}
