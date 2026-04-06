export default function NavigationBuilder({ onSave, onChange }) {
  const state = {
    navItems: [
      { id: 'home', label: 'Home', href: '/', icon: 'fa-home', active: true, visible: true },
      { id: 'projects', label: 'Projects', href: '/projects', icon: 'fa-folder', active: false, visible: true },
      { id: 'templates', label: 'Templates', href: '/templates', icon: 'fa-th-large', active: false, visible: true },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: 'fa-chart-bar', active: false, visible: true },
      { id: 'team', label: 'Team', href: '/team', icon: 'fa-users', active: false, visible: false },
      { id: 'settings', label: 'Settings', href: '/settings', icon: 'fa-cog', active: false, visible: true }
    ],
    config: {
      position: 'top',
      style: 'horizontal',
      theme: 'dark',
      collapsed: false,
      showIcons: true,
      showLabels: true,
      enableDropdown: true
    },
    editingItem: null,
    dragIndex: null
  };

  const container = document.createElement('div');
  container.className = 'navigation-builder flex flex-col h-full bg-gray-900';

  function render() {
    container.innerHTML = `
      <div class="nav-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <i class="fa fa-compass text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Navigation Builder</h2>
            <p class="text-xs text-gray-400">Customize your app navigation</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button id="reset-btn" class="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
            Reset
          </button>
          <button id="save-btn" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-save"></i> Save
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="w-72 border-r border-gray-800 p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 class="text-sm font-semibold text-white mb-3">Navigation Items</h3>
            <p class="text-xs text-gray-500 mb-3">Drag to reorder</p>
            <div class="space-y-2" id="nav-items-list">
              ${state.navItems.map((item, index) => `
                <div class="nav-item-card p-3 rounded-lg bg-gray-800/50 border border-gray-700 cursor-move transition-all hover:border-violet-500 ${state.editingItem?.id === item.id ? 'border-violet-500 bg-violet-500/10' : ''} ${!item.visible ? 'opacity-50' : ''}"
                     draggable="true"
                     data-index="${index}"
                     data-item-id="${item.id}">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-gray-400">
                      <i class="fa fa-grip-vertical text-xs"></i>
                    </div>
                    <i class="fa ${item.icon} text-gray-500 w-5"></i>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-white font-medium">${item.label}</div>
                      <div class="text-xs text-gray-500 truncate">${item.href}</div>
                    </div>
                    <button class="edit-item-btn w-7 h-7 rounded hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center"
                            data-item-id="${item.id}">
                      <i class="fa fa-pencil text-xs"></i>
                    </button>
                    <button class="toggle-visibility-btn w-7 h-7 rounded hover:bg-gray-700 ${item.visible ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center"
                            data-item-id="${item.id}">
                      <i class="fa ${item.visible ? 'fa-eye' : 'fa-eye-slash'} text-xs"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <button id="add-item-btn" class="w-full mt-3 p-3 rounded-lg border border-dashed border-gray-700 text-gray-400 hover:border-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-2">
              <i class="fa fa-plus"></i>
              <span class="text-sm">Add Navigation Item</span>
            </button>
          </div>
        </div>

        <div class="flex-1 flex flex-col">
          <div class="p-4 border-b border-gray-800 space-y-4">
            <div class="flex gap-6">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Position</label>
                <div class="flex rounded-lg bg-gray-800 p-1">
                  ${['top', 'left', 'right'].map(pos => `
                    <button class="position-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${state.config.position === pos ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}"
                            data-position="${pos}">
                      ${pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Style</label>
                <div class="flex rounded-lg bg-gray-800 p-1">
                  ${['horizontal', 'vertical', 'minimal'].map(style => `
                    <button class="style-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${state.config.style === style ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}"
                            data-style="${style}">
                      ${style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Theme</label>
                <div class="flex rounded-lg bg-gray-800 p-1">
                  ${['dark', 'light', 'glass'].map(theme => `
                    <button class="theme-btn px-4 py-1.5 rounded text-sm font-medium transition-colors ${state.config.theme === theme ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}"
                            data-theme="${theme}">
                      ${theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="show-icons" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${state.config.showIcons ? 'checked' : ''}>
                <span class="text-sm text-gray-400">Show Icons</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="show-labels" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${state.config.showLabels ? 'checked' : ''}>
                <span class="text-sm text-gray-400">Show Labels</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="collapsed" class="w-4 h-4 rounded bg-gray-800 border-gray-600 text-violet-600" ${state.config.collapsed ? 'checked' : ''}>
                <span class="text-sm text-gray-400">Collapsed</span>
              </label>
            </div>
          </div>

          <div class="flex-1 p-8 bg-gray-800/30">
            <h3 class="text-sm font-semibold text-white mb-4">Preview</h3>
            ${renderPreview()}
          </div>
        </div>

        ${state.editingItem ? `
          <div class="w-80 border-l border-gray-800 p-4 bg-gray-800/30">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-white">Edit Item</h3>
              <button id="close-edit" class="text-gray-400 hover:text-white">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Label</label>
                <input id="edit-label" type="text" value="${state.editingItem.label}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">URL/Path</label>
                <input id="edit-href" type="text" value="${state.editingItem.href}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Icon</label>
                <div class="grid grid-cols-5 gap-2">
                  ${['fa-home', 'fa-folder', 'fa-th-large', 'fa-chart-bar', 'fa-users', 'fa-cog', 'fa-file', 'fa-envelope', 'fa-bell', 'fa-star', 'fa-heart', 'fa-image', 'fa-video', 'fa-music', 'fa-link'].map(icon => `
                    <button class="icon-btn p-2 rounded-lg border ${state.editingItem.icon === icon ? 'border-violet-500 bg-violet-500/20 text-violet-400' : 'border-gray-700 text-gray-400 hover:border-gray-600'}"
                            data-icon="${icon}">
                      <i class="fa ${icon}"></i>
                    </button>
                  `).join('')}
                </div>
              </div>
              <div class="pt-4 border-t border-gray-700 flex gap-2">
                <button id="update-item" class="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500">
                  Update
                </button>
                <button id="delete-item" class="py-2 px-4 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    attachEventListeners();
  }

  function renderPreview() {
    const { config } = state;
    const visibleItems = state.navItems.filter(item => item.visible);

    const navStyles = config.theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white'
      : config.theme === 'light' ? 'bg-white border-gray-200 text-gray-900'
      : 'bg-gray-900/50 backdrop-blur-lg border-white/10 text-white';

    if (config.position === 'top') {
      return `
        <div class="p-4 rounded-xl border ${navStyles}">
          <nav class="flex items-center gap-1">
            <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center mr-4">
              <i class="fa fa-bolt text-white"></i>
            </div>
            ${config.style === 'minimal' ? '' : `
              <div class="flex items-center gap-1">
                ${visibleItems.map(item => `
                  <a href="${item.href}" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-violet-600 text-white' : 'hover:bg-white/10'}">
                    ${config.showIcons ? `<i class="fa ${item.icon} mr-2"></i>` : ''}
                    ${config.showLabels ? item.label : ''}
                  </a>
                `).join('')}
              </div>
            `}
            <div class="ml-auto flex items-center gap-2">
              <button class="p-2 rounded-lg hover:bg-white/10"><i class="fa fa-search"></i></button>
              <button class="p-2 rounded-lg hover:bg-white/10"><i class="fa fa-bell"></i></button>
              <div class="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                <span class="text-sm font-medium">U</span>
              </div>
            </div>
          </nav>
        </div>
      `;
    } else {
      return `
        <div class="flex gap-4 ${config.position === 'right' ? 'flex-row-reverse' : ''}">
          <div class="w-64 p-4 rounded-xl border ${navStyles}">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <i class="fa fa-bolt text-white"></i>
              </div>
              ${!config.collapsed ? '<span class="font-semibold">Remix Go</span>' : ''}
            </div>
            <nav class="space-y-1">
              ${visibleItems.map(item => `
                <a href="${item.href}" class="flex items-center ${config.collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-violet-600 text-white' : 'hover:bg-white/10'}">
                  <i class="fa ${item.icon} w-5 text-center"></i>
                  ${!config.collapsed && config.showLabels ? item.label : ''}
                </a>
              `).join('')}
            </nav>
          </div>
          <div class="flex-1 p-8 rounded-xl bg-gray-800/50 border border-gray-700">
            <div class="h-20 rounded-lg bg-gray-800 mb-4"></div>
            <div class="grid grid-cols-3 gap-4">
              <div class="h-32 rounded-lg bg-gray-800"></div>
              <div class="h-32 rounded-lg bg-gray-800"></div>
              <div class="h-32 rounded-lg bg-gray-800"></div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function attachEventListeners() {
    const list = container.querySelector('#nav-items-list');
    if (list) {
      list.querySelectorAll('.nav-item-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
          state.dragIndex = parseInt(card.dataset.index);
          card.classList.add('opacity-50');
        });
        card.addEventListener('dragend', () => {
          card.classList.remove('opacity-50');
          state.dragIndex = null;
        });
        card.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (state.dragIndex !== null && state.dragIndex !== parseInt(card.dataset.index)) {
            const overIndex = parseInt(card.dataset.index);
            const items = [...state.navItems];
            const [removed] = items.splice(state.dragIndex, 1);
            items.splice(overIndex, 0, removed);
            state.navItems = items;
            state.dragIndex = overIndex;
            render();
          }
        });
      });
    }

    container.querySelectorAll('.edit-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = state.navItems.find(i => i.id === btn.dataset.itemId);
        if (item) {
          state.editingItem = { ...item };
          render();
        }
      });
    });

    container.querySelectorAll('.toggle-visibility-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = state.navItems.find(i => i.id === btn.dataset.itemId);
        if (item) {
          item.visible = !item.visible;
          render();
        }
      });
    });

    container.querySelectorAll('.position-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.config.position = btn.dataset.position;
        render();
      });
    });

    container.querySelectorAll('.style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.config.style = btn.dataset.style;
        render();
      });
    });

    container.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.config.theme = btn.dataset.theme;
        render();
      });
    });

    const showIcons = container.querySelector('#show-icons');
    if (showIcons) {
      showIcons.addEventListener('change', (e) => {
        state.config.showIcons = e.target.checked;
        render();
      });
    }

    const showLabels = container.querySelector('#show-labels');
    if (showLabels) {
      showLabels.addEventListener('change', (e) => {
        state.config.showLabels = e.target.checked;
        render();
      });
    }

    const collapsed = container.querySelector('#collapsed');
    if (collapsed) {
      collapsed.addEventListener('change', (e) => {
        state.config.collapsed = e.target.checked;
        render();
      });
    }

    const closeEdit = container.querySelector('#close-edit');
    if (closeEdit) {
      closeEdit.addEventListener('click', () => {
        state.editingItem = null;
        render();
      });
    }

    container.querySelectorAll('.icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.editingItem) {
          state.editingItem.icon = btn.dataset.icon;
          render();
        }
      });
    });

    const updateItem = container.querySelector('#update-item');
    if (updateItem) {
      updateItem.addEventListener('click', () => {
        const labelInput = container.querySelector('#edit-label');
        const hrefInput = container.querySelector('#edit-href');
        if (state.editingItem && labelInput && hrefInput) {
          const index = state.navItems.findIndex(i => i.id === state.editingItem.id);
          if (index !== -1) {
            state.navItems[index] = {
              ...state.navItems[index],
              label: labelInput.value,
              href: hrefInput.value,
              icon: state.editingItem.icon
            };
            state.editingItem = null;
            render();
          }
        }
      });
    }

    const deleteItem = container.querySelector('#delete-item');
    if (deleteItem) {
      deleteItem.addEventListener('click', () => {
        if (state.editingItem) {
          state.navItems = state.navItems.filter(i => i.id !== state.editingItem.id);
          state.editingItem = null;
          render();
        }
      });
    }

    const addItemBtn = container.querySelector('#add-item-btn');
    if (addItemBtn) {
      addItemBtn.addEventListener('click', () => {
        const newId = Date.now().toString();
        state.navItems.push({
          id: newId,
          label: 'New Item',
          href: '/new',
          icon: 'fa-link',
          visible: true,
          active: false
        });
        state.editingItem = { ...state.navItems[state.navItems.length - 1] };
        render();
      });
    }

    const saveBtn = container.querySelector('#save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (onSave) {
          onSave(state.navItems, state.config);
        }
      });
    }

    const resetBtn = container.querySelector('#reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.navItems = [
          { id: 'home', label: 'Home', href: '/', icon: 'fa-home', active: true, visible: true },
          { id: 'projects', label: 'Projects', href: '/projects', icon: 'fa-folder', active: false, visible: true },
          { id: 'templates', label: 'Templates', href: '/templates', icon: 'fa-th-large', active: false, visible: true },
          { id: 'analytics', label: 'Analytics', href: '/analytics', icon: 'fa-chart-bar', active: false, visible: true },
          { id: 'settings', label: 'Settings', href: '/settings', icon: 'fa-cog', active: false, visible: true }
        ];
        state.config = {
          position: 'top',
          style: 'horizontal',
          theme: 'dark',
          collapsed: false,
          showIcons: true,
          showLabels: true,
          enableDropdown: true
        };
        render();
      });
    }
  }

  render();

  container.api = {
    getNavItems: () => state.navItems,
    getConfig: () => state.config,
    setNavItems: (items) => { state.navItems = items; render(); },
    setConfig: (config) => { state.config = { ...state.config, ...config }; render(); }
  };

  return container;
}
