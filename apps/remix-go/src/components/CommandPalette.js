export default function CommandPalette({ commands = [], onSelect }) {
  const state = {
    isOpen: false,
    searchQuery: '',
    selectedIndex: 0
  };

  const defaultCommands = [
    { id: 'new-project', name: 'New Project', shortcut: 'Ctrl+N', icon: 'fa-plus', category: 'File', action: () => {} },
    { id: 'open-project', name: 'Open Project', shortcut: 'Ctrl+O', icon: 'fa-folder-open', category: 'File', action: () => {} },
    { id: 'save-project', name: 'Save Project', shortcut: 'Ctrl+S', icon: 'fa-save', category: 'File', action: () => {} },
    { id: 'export-video', name: 'Export Video', shortcut: 'Ctrl+E', icon: 'fa-film', category: 'File', action: () => {} },
    { id: 'undo', name: 'Undo', shortcut: 'Ctrl+Z', icon: 'fa-undo', category: 'Edit', action: () => {} },
    { id: 'redo', name: 'Redo', shortcut: 'Ctrl+Y', icon: 'fa-redo', category: 'Edit', action: () => {} },
    { id: 'cut', name: 'Cut', shortcut: 'Ctrl+X', icon: 'fa-cut', category: 'Edit', action: () => {} },
    { id: 'copy', name: 'Copy', shortcut: 'Ctrl+C', icon: 'fa-copy', category: 'Edit', action: () => {} },
    { id: 'paste', name: 'Paste', shortcut: 'Ctrl+V', icon: 'fa-paste', category: 'Edit', action: () => {} },
    { id: 'select-all', name: 'Select All', shortcut: 'Ctrl+A', icon: 'fa-check-square', category: 'Edit', action: () => {} },
    { id: 'duplicate', name: 'Duplicate', shortcut: 'Ctrl+D', icon: 'fa-clone', category: 'Edit', action: () => {} },
    { id: 'delete', name: 'Delete', shortcut: 'Delete', icon: 'fa-trash', category: 'Edit', action: () => {} },
    { id: 'play-pause', name: 'Play / Pause', shortcut: 'Space', icon: 'fa-play', category: 'Playback', action: () => {} },
    { id: 'stop', name: 'Stop', shortcut: 'K', icon: 'fa-stop', category: 'Playback', action: () => {} },
    { id: 'previous-frame', name: 'Previous Frame', shortcut: 'Left', icon: 'fa-step-backward', category: 'Playback', action: () => {} },
    { id: 'next-frame', name: 'Next Frame', shortcut: 'Right', icon: 'fa-step-forward', category: 'Playback', action: () => {} },
    { id: 'mute', name: 'Mute', shortcut: 'M', icon: 'fa-volume-mute', category: 'Playback', action: () => {} },
    { id: 'fullscreen', name: 'Toggle Fullscreen', shortcut: 'F', icon: 'fa-expand', category: 'View', action: () => {} },
    { id: 'zoom-in', name: 'Zoom In', shortcut: 'Ctrl+=', icon: 'fa-search-plus', category: 'View', action: () => {} },
    { id: 'zoom-out', name: 'Zoom Out', shortcut: 'Ctrl+-', icon: 'fa-search-minus', category: 'View', action: () => {} },
    { id: 'reset-zoom', name: 'Reset Zoom', shortcut: 'Ctrl+0', icon: 'fa-compress', category: 'View', action: () => {} },
    { id: 'toggle-sidebar', name: 'Toggle Sidebar', shortcut: 'Ctrl+B', icon: 'fa-columns', category: 'View', action: () => {} },
    { id: 'ai-generate', name: 'AI Generate', shortcut: 'Ctrl+G', icon: 'fa-magic', category: 'AI', action: () => {} },
    { id: 'ai-script', name: 'AI Script Writer', shortcut: 'Ctrl+Shift+S', icon: 'fa-pen', category: 'AI', action: () => {} },
    { id: 'ai-voice', name: 'AI Voice Clone', shortcut: 'Ctrl+Shift+V', icon: 'fa-microphone', category: 'AI', action: () => {} },
    { id: 'ai-avatar', name: 'Avatar Generator', shortcut: 'Ctrl+Shift+A', icon: 'fa-user-circle', category: 'AI', action: () => {} },
    { id: 'settings', name: 'Settings', shortcut: 'Ctrl+,', icon: 'fa-cog', category: 'Preferences', action: () => {} },
    { id: 'keyboard-shortcuts', name: 'Keyboard Shortcuts', shortcut: '?', icon: 'fa-keyboard', category: 'Preferences', action: () => {} },
    { id: 'help', name: 'Help Center', shortcut: 'F1', icon: 'fa-question-circle', category: 'Help', action: () => {} },
    { id: 'getting-started', name: 'Getting Started', shortcut: '', icon: 'fa-graduation-cap', category: 'Help', action: () => {} }
  ];

  const allCommands = commands.length > 0 ? commands : defaultCommands;

  const container = document.createElement('div');
  container.className = 'command-palette-container';

  function getFilteredCommands() {
    if (!state.searchQuery.trim()) return allCommands;
    const query = state.searchQuery.toLowerCase().trim();
    return allCommands.filter(cmd =>
      cmd.name.toLowerCase().includes(query) ||
      cmd.category?.toLowerCase().includes(query) ||
      cmd.shortcut?.toLowerCase().includes(query)
    );
  }

  function getGroupedCommands() {
    const filtered = getFilteredCommands();
    const grouped = {};
    filtered.forEach(cmd => {
      const category = cmd.category || 'Other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(cmd);
    });
    return grouped;
  }

  function open() {
    state.isOpen = true;
    state.searchQuery = '';
    state.selectedIndex = 0;
    render();
    setTimeout(() => {
      const input = container.querySelector('#command-input');
      if (input) input.focus();
    }, 50);
  }

  function close() {
    state.isOpen = false;
    state.searchQuery = '';
    state.selectedIndex = 0;
    render();
  }

  function executeCommand(command) {
    if (command.action) {
      command.action();
    }
    if (onSelect) {
      onSelect(command);
    }
    close();
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (state.isOpen) close();
      else open();
      return;
    }

    if (e.key === 'Escape' && state.isOpen) {
      e.preventDefault();
      close();
      return;
    }

    if (!state.isOpen) return;

    const filtered = getFilteredCommands();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        state.selectedIndex = (state.selectedIndex + 1) % filtered.length;
        render();
        break;
      case 'ArrowUp':
        e.preventDefault();
        state.selectedIndex = (state.selectedIndex - 1 + filtered.length) % filtered.length;
        render();
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[state.selectedIndex]) {
          executeCommand(filtered[state.selectedIndex]);
        }
        break;
    }
  }

  function render() {
    if (!state.isOpen) {
      container.innerHTML = `
        <div class="fixed bottom-4 right-4 z-50">
          <button id="command-palette-trigger"
            class="w-12 h-12 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500 transition-all flex items-center justify-center group"
            title="Command Palette (Ctrl+K)">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="absolute right-full mr-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ctrl+K
            </span>
          </button>
        </div>
      `;
    } else {
      const grouped = getGroupedCommands();
      let flatIndex = 0;

      container.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" id="command-palette-overlay">
          <div class="w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl shadow-black/50 border border-gray-800 overflow-hidden">
            <div class="p-4 border-b border-gray-800">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input id="command-input"
                  type="text"
                  class="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
                  placeholder="Type a command or search..."
                  value="${state.searchQuery}"
                  autocomplete="off">
                <span class="px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs">ESC</span>
              </div>
            </div>

            <div class="max-h-96 overflow-y-auto">
              ${Object.keys(grouped).length === 0 ? `
                <div class="p-8 text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p>No commands found</p>
                </div>
              ` : Object.entries(grouped).map(([category, cmds]) => `
                <div class="command-category">
                  <div class="px-4 py-2 text-xs font-semibold text-violet-400 uppercase tracking-wider bg-gray-800/50">
                    ${category}
                  </div>
                  ${cmds.map(cmd => {
                    const isSelected = flatIndex === state.selectedIndex;
                    const index = flatIndex++;
                    return `
                      <div class="command-item px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'bg-violet-600 text-white' : 'text-gray-300 hover:bg-gray-800'}"
                           data-index="${index}"
                           data-command-id="${cmd.id}">
                        <div class="w-8 h-8 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-gray-800'} flex items-center justify-center flex-shrink-0">
                          <i class="fa ${cmd.icon}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="font-medium">${cmd.name}</div>
                          ${cmd.description ? `<div class="text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}">${cmd.description}</div>` : ''}
                        </div>
                        ${cmd.shortcut ? `
                          <span class="px-2 py-1 rounded ${isSelected ? 'bg-white/20' : 'bg-gray-800'} text-xs font-mono">
                            ${cmd.shortcut}
                          </span>
                        ` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              `).join('')}
            </div>

            <div class="px-4 py-2 bg-gray-800/50 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 rounded bg-gray-700">↑↓</kbd> to navigate
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 rounded bg-gray-700">↵</kbd> to select
                </span>
              </div>
              <span>${getFilteredCommands().length} commands</span>
            </div>
          </div>
        </div>
      `;
    }

    attachEventListeners();
  }

  function attachEventListeners() {
    const trigger = container.querySelector('#command-palette-trigger');
    if (trigger) {
      trigger.addEventListener('click', open);
    }

    const overlay = container.querySelector('#command-palette-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
    }

    const input = container.querySelector('#command-input');
    if (input) {
      input.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        state.selectedIndex = 0;
        render();
      });
    }

    container.querySelectorAll('.command-item').forEach(item => {
      item.addEventListener('click', () => {
        const commandId = item.dataset.commandId;
        const command = allCommands.find(c => c.id === commandId);
        if (command) {
          executeCommand(command);
        }
      });

      item.addEventListener('mouseenter', () => {
        state.selectedIndex = parseInt(item.dataset.index);
        render();
      });
    });
  }

  document.addEventListener('keydown', handleKeyDown);

  container.addEventListener('remove', () => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  render();

  container.api = {
    open,
    close,
    isOpen: () => state.isOpen
  };

  return container;
}
