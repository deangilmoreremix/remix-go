export default function ThemeCustomizer({ initialTheme = {}, onChange, onSave }) {
  const defaultTheme = {
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      muted: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Inter',
      baseSize: 16,
      lineHeight: 1.6,
      headingWeight: 600,
      bodyWeight: 400
    },
    spacing: {
      base: 4,
      scale: 1.5
    },
    radius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      xl: '24px'
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.1)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 25px rgba(0,0,0,0.15)',
      glow: '0 0 20px rgba(139, 92, 246, 0.3)'
    },
    animations: {
      enabled: true,
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    darkMode: true,
    glassMorphism: true
  };

  const state = {
    theme: { ...defaultTheme, ...initialTheme },
    activeTab: 'colors',
    presetName: '',
    presets: [
      { name: 'Default Dark', colors: defaultTheme.colors },
      { name: 'Midnight', colors: { ...defaultTheme.colors, primary: '#6366f1', background: '#0f172a', surface: '#1e293b' } },
      { name: 'Forest', colors: { ...defaultTheme.colors, primary: '#22c55e', secondary: '#84cc16', accent: '#14b8a6' } },
      { name: 'Sunset', colors: { ...defaultTheme.colors, primary: '#f97316', secondary: '#f43f5e', accent: '#eab308' } },
      { name: 'Ocean', colors: { ...defaultTheme.colors, primary: '#0ea5e9', secondary: '#06b6d4', accent: '#8b5cf6' } }
    ]
  };

  const container = document.createElement('div');
  container.className = 'theme-customizer flex flex-col h-full bg-gray-900';

  function updateTheme(path, value) {
    const keys = path.split('.');
    let target = state.theme;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    if (onChange) {
      onChange(state.theme);
    }
    render();
  }

  function generateCSS() {
    const t = state.theme;
    return `
:root {
  --color-primary: ${t.colors.primary};
  --color-secondary: ${t.colors.secondary};
  --color-accent: ${t.colors.accent};
  --color-bg: ${t.colors.background};
  --color-surface: ${t.colors.surface};
  --color-text: ${t.colors.text};
  --color-muted: ${t.colors.muted};
  --font-main: ${t.typography.fontFamily}, sans-serif;
  --font-heading: ${t.typography.headingFont}, sans-serif;
  --radius-sm: ${t.radius.small};
  --radius-md: ${t.radius.medium};
  --radius-lg: ${t.radius.large};
  --shadow-glow: ${t.shadows.glow};
}`;
  }

  function render() {
    const t = state.theme;

    container.innerHTML = `
      <div class="theme-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Theme Customizer</h2>
            <p class="text-xs text-gray-400">Design your brand experience</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <select id="preset-select" class="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
            <option value="">Load Preset...</option>
            ${state.presets.map((p, i) => `<option value="${i}">${p.name}</option>`).join('')}
          </select>
          <button id="save-theme" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-save"></i> Save
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="w-64 border-r border-gray-800 p-4 space-y-2">
          ${[
            ['colors', 'Colors', 'fa-palette'],
            ['typography', 'Typography', 'fa-font'],
            ['layout', 'Layout & Spacing', 'fa-expand'],
            ['effects', 'Effects', 'fa-magic']
          ].map(([tab, label, icon]) => `
            <button class="tab-btn w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${state.activeTab === tab ? 'bg-violet-500/20 text-violet-300' : 'text-gray-400 hover:bg-gray-800'}"
                    data-tab="${tab}">
              <i class="fa ${icon} w-5"></i>
              <span class="text-sm font-medium">${label}</span>
            </button>
          `).join('')}
        </div>

        <div class="flex-1 flex">
          <div class="flex-1 p-6 overflow-y-auto space-y-6">
            ${state.activeTab === 'colors' ? `
              <div>
                <h3 class="text-sm font-semibold text-white mb-4">Brand Colors</h3>
                <div class="grid grid-cols-2 gap-4">
                  ${[
                    ['colors.primary', 'Primary', 'The main brand color used for buttons and CTAs'],
                    ['colors.secondary', 'Secondary', 'Accent color for highlights and secondary actions'],
                    ['colors.accent', 'Accent', 'Tertiary color for emphasis and special elements'],
                  ].map(([path, name, desc]) => `
                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-white">${name}</label>
                        <div class="flex items-center gap-2">
                          <input type="color" value="${t.colors[path.split('.')[1]]}" 
                                 class="w-8 h-8 rounded cursor-pointer bg-transparent"
                                 data-color-path="${path}">
                          <input type="text" value="${t.colors[path.split('.')[1]]}" 
                                 class="w-20 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-xs uppercase font-mono"
                                 data-color-text-path="${path}">
                        </div>
                      </div>
                      <p class="text-xs text-gray-500">${desc}</p>
                    </div>
                  `).join('')}
                </div>

                <h3 class="text-sm font-semibold text-white mb-4 mt-6">UI Colors</h3>
                <div class="grid grid-cols-3 gap-4">
                  ${[
                    ['colors.background', 'Background', 'Main page background color'],
                    ['colors.surface', 'Surface', 'Cards, modals, and elevated surfaces'],
                    ['colors.text', 'Text', 'Primary text color for readability'],
                    ['colors.muted', 'Muted', 'Secondary and placeholder text'],
                    ['colors.success', 'Success', 'Success states and confirmations'],
                    ['colors.error', 'Error', 'Error states and warnings']
                  ].map(([path, name, desc]) => `
                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-white">${name}</label>
                        <div class="flex items-center gap-2">
                          <input type="color" value="${t.colors[path.split('.')[1]]}" 
                                 class="w-6 h-6 rounded cursor-pointer bg-transparent"
                                 data-color-path="${path}">
                          <input type="text" value="${t.colors[path.split('.')[1]]}" 
                                 class="w-16 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-xs uppercase font-mono"
                                 data-color-text-path="${path}">
                        </div>
                      </div>
                      <p class="text-xs text-gray-500">${desc}</p>
                    </div>
                  `).join('')}
                </div>

                <div class="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-white">Dark Mode</label>
                      <p class="text-xs text-gray-500">Enable dark color scheme by default</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="dark-mode-toggle" class="sr-only peer" ${t.darkMode ? 'checked' : ''}>
                      <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            ` : ''}

            ${state.activeTab === 'typography' ? `
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Font Family</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Primary Font</label>
                      <select id="font-family" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                        <option value="Inter" ${t.typography.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                        <option value="Roboto" ${t.typography.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
                        <option value="Open Sans" ${t.typography.fontFamily === 'Open Sans' ? 'selected' : ''}>Open Sans</option>
                        <option value="Poppins" ${t.typography.fontFamily === 'Poppins' ? 'selected' : ''}>Poppins</option>
                        <option value="Manrope" ${t.typography.fontFamily === 'Manrope' ? 'selected' : ''}>Manrope</option>
                        <option value="DM Sans" ${t.typography.fontFamily === 'DM Sans' ? 'selected' : ''}>DM Sans</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Heading Font</label>
                      <select id="heading-font" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
                        <option value="Inter" ${t.typography.headingFont === 'Inter' ? 'selected' : ''}>Inter</option>
                        <option value="Poppins" ${t.typography.headingFont === 'Poppins' ? 'selected' : ''}>Poppins</option>
                        <option value="Montserrat" ${t.typography.headingFont === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                        <option value="Outfit" ${t.typography.headingFont === 'Outfit' ? 'selected' : ''}>Outfit</option>
                        <option value="Syne" ${t.typography.headingFont === 'Syne' ? 'selected' : ''}>Syne</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Text Sizing</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Base Font Size</label>
                      <input type="range" id="base-size" min="12" max="20" value="${t.typography.baseSize}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>12px</span>
                        <span class="text-white">${t.typography.baseSize}px</span>
                        <span>20px</span>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 mb-2 block">Line Height</label>
                      <input type="range" id="line-height" min="1" max="2" step="0.1" value="${t.typography.lineHeight}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1.0</span>
                        <span class="text-white">${t.typography.lineHeight}</span>
                        <span>2.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}

            ${state.activeTab === 'layout' ? `
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Border Radius</h3>
                  <div class="grid grid-cols-2 gap-4">
                    ${[
                      ['radius.small', 'Small', 'Inputs, badges'],
                      ['radius.medium', 'Medium', 'Buttons, cards'],
                      ['radius.large', 'Large', 'Modals, containers'],
                      ['radius.xl', 'Extra Large', 'Hero elements']
                    ].map(([path, name, desc]) => `
                      <div class="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <label class="text-sm text-white block mb-1">${name}</label>
                        <input type="text" value="${t.radius[path.split('.')[1]]}" 
                               class="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                               data-radius-path="${path}">
                        <span class="text-xs text-gray-500">${desc}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Spacing</h3>
                  <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                    <label class="text-xs text-gray-500 mb-2 block">Spacing Scale Multiplier</label>
                    <input type="range" id="spacing-scale" min="1" max="2" step="0.1" value="${t.spacing.scale}" class="w-full">
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Compact (1.0)</span>
                      <span class="text-white">${t.spacing.scale}x</span>
                      <span>Spacious (2.0)</span>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}

            ${state.activeTab === 'effects' ? `
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Visual Effects</h3>
                  <div class="space-y-4">
                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-white">Glass Morphism</label>
                        <p class="text-xs text-gray-500">Frosted glass effect on overlays</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="glass-toggle" class="sr-only peer" ${t.glassMorphism ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>

                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-white">Animations</label>
                        <p class="text-xs text-gray-500">Enable smooth transitions and micro-interactions</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="animations-toggle" class="sr-only peer" ${t.animations.enabled ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>

                    <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <label class="text-sm font-medium text-white block mb-2">Animation Duration</label>
                      <input type="range" id="anim-duration" min="100" max="1000" step="50" value="${t.animations.duration}" class="w-full">
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Fast (100ms)</span>
                        <span class="text-white">${t.animations.duration}ms</span>
                        <span>Slow (1000ms)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-white mb-4">Shadow Presets</h3>
                  <div class="grid grid-cols-2 gap-3">
                    ${Object.entries(t.shadows).map(([name, value]) => `
                      <div class="p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-violet-500 transition-colors"
                           style="box-shadow: ${value}">
                        <span class="text-sm text-white capitalize">${name}</span>
                        <p class="text-xs text-gray-500 truncate">${value.substring(0, 40)}...</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="w-80 border-l border-gray-800 p-6">
            <h3 class="text-sm font-semibold text-white mb-4">Live Preview</h3>
            <div class="p-6 rounded-xl" style="background: ${t.colors.surface}; border: 1px solid ${t.colors.muted}40;">
              <h4 style="color: ${t.colors.text}; font-size: ${t.typography.baseSize * 1.5}px; margin-bottom: 12px;">Heading Text</h4>
              <p style="color: ${t.colors.muted}; font-size: ${t.typography.baseSize}px; line-height: ${t.typography.lineHeight}; margin-bottom: 16px;">This is how body text appears in your theme.</p>
              <button style="background: ${t.colors.primary}; color: ${t.colors.text}; padding: 10px 20px; border-radius: ${t.radius.medium}; border: none; font-weight: 500; cursor: pointer;">
                Primary Button
              </button>
            </div>

            <div class="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <h4 class="text-sm font-semibold text-white mb-2">CSS Variables</h4>
              <pre class="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap" style="max-height: 200px; overflow-y: auto;">${generateCSS()}</pre>
            </div>

            <button id="copy-css" class="w-full mt-4 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
              <i class="fa fa-copy"></i> Copy CSS
            </button>
          </div>
        </div>
      </div>
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeTab = btn.dataset.tab;
        render();
      });
    });

    container.querySelectorAll('[data-color-path]').forEach(input => {
      input.addEventListener('input', (e) => {
        const path = e.target.dataset.colorPath;
        updateTheme(path, e.target.value);
        const textInput = container.querySelector(`[data-color-text-path="${path}"]`);
        if (textInput) textInput.value = e.target.value;
      });
    });

    container.querySelectorAll('[data-color-text-path]').forEach(input => {
      input.addEventListener('input', (e) => {
        const path = e.target.dataset.colorTextPath;
        updateTheme(path, e.target.value);
        const colorInput = container.querySelector(`[data-color-path="${path}"]`);
        if (colorInput) colorInput.value = e.target.value;
      });
    });

    const presetSelect = container.querySelector('#preset-select');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const preset = state.presets[parseInt(e.target.value)];
        if (preset) {
          state.theme.colors = { ...preset.colors };
          if (onChange) onChange(state.theme);
          render();
        }
      });
    }

    const saveBtn = container.querySelector('#save-theme');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (onSave) onSave(state.theme);
      });
    }

    const darkModeToggle = container.querySelector('#dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', (e) => {
        updateTheme('darkMode', e.target.checked);
      });
    }

    const fontFamily = container.querySelector('#font-family');
    if (fontFamily) {
      fontFamily.addEventListener('change', (e) => {
        updateTheme('typography.fontFamily', e.target.value);
      });
    }

    const headingFont = container.querySelector('#heading-font');
    if (headingFont) {
      headingFont.addEventListener('change', (e) => {
        updateTheme('typography.headingFont', e.target.value);
      });
    }

    const baseSize = container.querySelector('#base-size');
    if (baseSize) {
      baseSize.addEventListener('input', (e) => {
        updateTheme('typography.baseSize', parseInt(e.target.value));
      });
    }

    const lineHeight = container.querySelector('#line-height');
    if (lineHeight) {
      lineHeight.addEventListener('input', (e) => {
        updateTheme('typography.lineHeight', parseFloat(e.target.value));
      });
    }

    const spacingScale = container.querySelector('#spacing-scale');
    if (spacingScale) {
      spacingScale.addEventListener('input', (e) => {
        updateTheme('spacing.scale', parseFloat(e.target.value));
      });
    }

    const glassToggle = container.querySelector('#glass-toggle');
    if (glassToggle) {
      glassToggle.addEventListener('change', (e) => {
        updateTheme('glassMorphism', e.target.checked);
      });
    }

    const animationsToggle = container.querySelector('#animations-toggle');
    if (animationsToggle) {
      animationsToggle.addEventListener('change', (e) => {
        updateTheme('animations.enabled', e.target.checked);
      });
    }

    const animDuration = container.querySelector('#anim-duration');
    if (animDuration) {
      animDuration.addEventListener('input', (e) => {
        updateTheme('animations.duration', parseInt(e.target.value));
      });
    }

    const copyCss = container.querySelector('#copy-css');
    if (copyCss) {
      copyCss.addEventListener('click', () => {
        navigator.clipboard.writeText(generateCSS());
      });
    }
  }

  render();

  container.api = {
    getTheme: () => state.theme,
    setTheme: (theme) => { state.theme = { ...state.theme, ...theme }; render(); }
  };

  return container;
}
