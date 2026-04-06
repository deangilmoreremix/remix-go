export default function CTABuilder({ onSave, initialConfig = {} }) {
  const state = {
    ctaConfig: {
      type: 'button',
      style: 'primary',
      size: 'medium',
      shape: 'rounded',
      content: {
        text: 'Get Started Today',
        subtext: '',
        icon: '',
        iconPosition: 'left'
      },
      action: {
        type: 'link',
        target: '#',
        modalId: '',
        scrollTarget: '',
        downloadUrl: '',
        phoneNumber: '',
        emailAddress: '',
        emailSubject: ''
      },
      appearance: {
        backgroundColor: '#8b5cf6',
        textColor: '#ffffff',
        borderColor: '#8b5cf6',
        borderWidth: '2px',
        shadow: 'medium',
        hoverEffect: 'lift',
        animation: 'fade-in'
      },
      positioning: {
        alignment: 'center',
        margin: '16px 0',
        width: 'auto',
        customWidth: '200px'
      },
      conversion: {
        urgencyText: '',
        socialProof: '',
        guarantee: '',
        tracking: {
          eventName: 'cta_click',
          eventCategory: 'conversion',
          eventLabel: ''
        }
      }
    },
    activeTab: 'content',
    isPreviewMode: true,
    previewHover: false
  };

  Object.assign(state.ctaConfig, initialConfig);

  const buttonStyles = [
    { id: 'primary', name: 'Primary', color: '#8b5cf6' },
    { id: 'secondary', name: 'Secondary', color: '#6b7280' },
    { id: 'success', name: 'Success', color: '#10b981' },
    { id: 'danger', name: 'Danger', color: '#ef4444' },
    { id: 'warning', name: 'Warning', color: '#f59e0b' },
    { id: 'info', name: 'Info', color: '#3b82f6' },
    { id: 'light', name: 'Light', color: '#f3f4f6' },
    { id: 'dark', name: 'Dark', color: '#1f2937' },
    { id: 'outline', name: 'Outline', color: 'transparent' },
    { id: 'ghost', name: 'Ghost', color: 'transparent' },
    { id: 'gradient', name: 'Gradient', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }
  ];

  const sizes = [
    { id: 'small', name: 'Small', scale: 0.85 },
    { id: 'medium', name: 'Medium', scale: 1 },
    { id: 'large', name: 'Large', scale: 1.15 },
    { id: 'extra-large', name: 'Extra Large', scale: 1.3 }
  ];

  const shapes = [
    { id: 'square', name: 'Square', radius: '4px' },
    { id: 'rounded', name: 'Rounded', radius: '8px' },
    { id: 'pill', name: 'Pill', radius: '9999px' },
    { id: 'circle', name: 'Circle', radius: '50%' }
  ];

  const hoverEffects = [
    { id: 'none', name: 'None' },
    { id: 'lift', name: 'Lift', transform: 'translateY(-2px)' },
    { id: 'glow', name: 'Glow', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
    { id: 'scale', name: 'Scale', transform: 'scale(1.05)' },
    { id: 'slide', name: 'Slide', transform: 'translateX(4px)' }
  ];

  const container = document.createElement('div');
  container.className = 'cta-builder bg-gray-900 rounded-xl border border-gray-800 overflow-hidden';

  function updateConfig(path, value) {
    const keys = path.split('.');
    let target = state.ctaConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
  }

  function getButtonStyles() {
    const config = state.ctaConfig;
    const selectedStyle = buttonStyles.find(s => s.id === config.style);
    const selectedSize = sizes.find(s => s.id === config.size);
    const selectedShape = shapes.find(s => s.id === config.shape);
    const selectedHover = hoverEffects.find(h => h.id === config.appearance.hoverEffect);

    let bgStyle = '';
    if (selectedStyle?.gradient) {
      bgStyle = selectedStyle.gradient;
    } else {
      bgStyle = config.style === 'outline' || config.style === 'ghost'
        ? 'transparent'
        : (selectedStyle?.color || config.appearance.backgroundColor);
    }

    return {
      background: bgStyle,
      color: config.style === 'outline' || config.style === 'ghost'
        ? config.appearance.backgroundColor
        : config.appearance.textColor,
      border: config.style === 'outline'
        ? `${config.appearance.borderWidth} solid ${config.appearance.borderColor}`
        : 'none',
      borderRadius: selectedShape?.radius || '8px',
      padding: config.size === 'small' ? '8px 16px'
        : config.size === 'medium' ? '12px 24px'
        : config.size === 'large' ? '16px 32px'
        : '20px 40px',
      fontSize: config.size === 'small' ? '14px'
        : config.size === 'medium' ? '16px'
        : config.size === 'large' ? '18px'
        : '20px',
      width: config.positioning.width === 'full' ? '100%'
        : config.positioning.width === 'custom' ? config.positioning.customWidth
        : 'auto',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: config.appearance.shadow === 'small' ? '0 1px 3px rgba(0,0,0,0.1)'
        : config.appearance.shadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)'
        : config.appearance.shadow === 'large' ? '0 10px 25px rgba(0,0,0,0.15)'
        : 'none',
      transform: state.previewHover && selectedHover?.transform ? selectedHover.transform : 'none'
    };
  }

  function styleToString(styles) {
    return Object.entries(styles)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v}`)
      .join('; ');
  }

  function render() {
    const config = state.ctaConfig;
    const buttonStyleStr = styleToString(getButtonStyles());

    container.innerHTML = `
      <div class="cta-builder-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">CTA Builder</h2>
            <p class="text-xs text-gray-400">Create high-converting call-to-action buttons</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="preview-toggle" class="px-3 py-1.5 rounded-lg ${state.isPreviewMode ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-300'} text-sm font-medium transition-colors flex items-center gap-2">
            <i class="fa fa-eye"></i> Preview
          </button>
          <button id="save-cta" class="px-4 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-save"></i> Save CTA
          </button>
        </div>
      </div>

      <div class="flex">
        <div class="w-80 border-r border-gray-800 p-4 overflow-y-auto" style="max-height: 600px;">
          <div class="flex border-b border-gray-800 mb-4">
            ${['content', 'appearance', 'action', 'advanced'].map(tab => `
              <button class="tab-btn flex-1 py-2 text-sm font-medium ${state.activeTab === tab ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-500 hover:text-gray-300'}"
                      data-tab="${tab}">
                ${tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            `).join('')}
          </div>

          ${state.activeTab === 'content' ? `
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Button Text</label>
                <input id="btn-text" type="text" value="${config.content.text}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Subtext (Optional)</label>
                <input id="btn-subtext" type="text" value="${config.content.subtext}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Limited time offer">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Icon</label>
                <div class="grid grid-cols-6 gap-2">
                  ${['', 'fa-arrow-right', 'fa-download', 'fa-envelope', 'fa-phone', 'fa-play', 'fa-plus', 'fa-check', 'fa-star', 'fa-heart', 'fa-bolt', 'fa-shopping-cart', 'fa-external-link', 'fa-chevron-right', 'fa-angle-right'].map(icon => `
                    <button class="icon-btn w-10 h-10 rounded-lg border ${config.content.icon === icon ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-gray-700 text-gray-400 hover:border-gray-500'} flex items-center justify-center transition-colors"
                            data-icon="${icon}">
                      ${icon ? `<i class="fa ${icon}"></i>` : '<span class="text-xs">None</span>'}
                    </button>
                  `).join('')}
                </div>
              </div>

              ${config.content.icon ? `
                <div>
                  <label class="block text-xs text-gray-500 mb-2">Icon Position</label>
                  <div class="grid grid-cols-2 gap-2">
                    ${[['left', 'Left'], ['right', 'Right']].map(([pos, label]) => `
                      <button class="pos-btn py-2 rounded-lg border text-sm ${config.content.iconPosition === pos ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-gray-700 text-gray-400'}"
                              data-position="${pos}">
                        ${label}
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div>
                <label class="block text-xs text-gray-500 mb-2">Style</label>
                <div class="space-y-2">
                  ${buttonStyles.map(style => `
                    <button class="style-btn w-full p-3 rounded-lg border flex items-center gap-3 transition-colors ${config.style === style.id ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-gray-600'}"
                            data-style="${style.id}">
                      <div class="w-8 h-8 rounded" style="background: ${style.gradient || style.color}; ${style.id === 'outline' || style.id === 'ghost' ? 'border: 2px solid #8b5cf6' : ''}"></div>
                      <span class="text-sm text-white">${style.name}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Size</label>
                <div class="grid grid-cols-2 gap-2">
                  ${sizes.map(size => `
                    <button class="size-btn py-2 rounded-lg border text-sm ${config.size === size.id ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-gray-700 text-gray-400 hover:border-gray-600'}"
                            data-size="${size.id}">
                      ${size.name}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Shape</label>
                <div class="grid grid-cols-2 gap-2">
                  ${shapes.map(shape => `
                    <button class="shape-btn py-2 rounded-lg border text-sm ${config.shape === shape.id ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-gray-700 text-gray-400 hover:border-gray-600'}"
                            data-shape="${shape.id}">
                      ${shape.name}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          ${state.activeTab === 'appearance' ? `
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Background Color</label>
                <div class="flex gap-2">
                  <input id="bg-color" type="color" value="${config.appearance.backgroundColor}"
                    class="w-12 h-10 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer">
                  <input id="bg-color-text" type="text" value="${config.appearance.backgroundColor}"
                    class="flex-1 p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Text Color</label>
                <div class="flex gap-2">
                  <input id="text-color" type="color" value="${config.appearance.textColor}"
                    class="w-12 h-10 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer">
                  <input id="text-color-text" type="text" value="${config.appearance.textColor}"
                    class="flex-1 p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Shadow</label>
                <div class="grid grid-cols-2 gap-2">
                  ${['none', 'small', 'medium', 'large'].map(shadow => `
                    <button class="shadow-btn py-2 rounded-lg border text-sm ${config.appearance.shadow === shadow ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-gray-700 text-gray-400'}"
                            data-shadow="${shadow}">
                      ${shadow.charAt(0).toUpperCase() + shadow.slice(1)}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Hover Effect</label>
                <div class="space-y-2">
                  ${hoverEffects.map(effect => `
                    <button class="hover-btn w-full p-3 rounded-lg border text-sm flex items-center gap-2 ${config.appearance.hoverEffect === effect.id ? 'border-violet-500 bg-violet-500/10 text-violet-300' : 'border-gray-700 text-gray-400'}"
                            data-hover="${effect.id}">
                      <span>${effect.name}</span>
                      ${effect.transform !== 'none' ? `<i class="fa fa-arrow-up text-xs opacity-50"></i>` : ''}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          ${state.activeTab === 'action' ? `
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Action Type</label>
                <div class="space-y-2">
                  ${[
                    ['link', 'Link to URL', 'fa-link'],
                    ['modal', 'Open Modal', 'fa-window-maximize'],
                    ['scroll', 'Scroll to Section', 'fa-arrow-down'],
                    ['download', 'Download File', 'fa-download'],
                    ['phone', 'Call Phone', 'fa-phone'],
                    ['email', 'Send Email', 'fa-envelope']
                  ].map(([type, label, icon]) => `
                    <button class="action-type-btn w-full p-3 rounded-lg border flex items-center gap-3 ${config.action.type === type ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-gray-600'}"
                            data-action-type="${type}">
                      <i class="fa ${icon} text-gray-400"></i>
                      <span class="text-sm text-white">${label}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              ${config.action.type === 'link' ? `
                <div>
                  <label class="block text-xs text-gray-500 mb-2">URL</label>
                  <input id="action-target" type="text" value="${config.action.target}"
                    class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                    placeholder="https://example.com">
                </div>
              ` : ''}

              ${config.action.type === 'email' ? `
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-2">Email Address</label>
                    <input id="email-address" type="email" value="${config.action.emailAddress}"
                      class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-2">Subject (Optional)</label>
                    <input id="email-subject" type="text" value="${config.action.emailSubject}"
                      class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  </div>
                </div>
              ` : ''}

              ${config.action.type === 'phone' ? `
                <div>
                  <label class="block text-xs text-gray-500 mb-2">Phone Number</label>
                  <input id="phone-number" type="tel" value="${config.action.phoneNumber}"
                    class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                    placeholder="+1 (555) 123-4567">
                </div>
              ` : ''}

              <div>
                <label class="block text-xs text-gray-500 mb-2">Alignment</label>
                <div class="grid grid-cols-3 gap-2">
                  ${[['left', 'Left'], ['center', 'Center'], ['right', 'Right']].map(([align, label]) => `
                    <button class="align-btn py-2 rounded-lg border text-sm ${config.positioning.alignment === align ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-gray-700 text-gray-400'}"
                            data-align="${align}">
                      ${label}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          ${state.activeTab === 'advanced' ? `
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Urgency Text</label>
                <input id="urgency-text" type="text" value="${config.conversion.urgencyText}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Limited time offer - ends soon!">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Social Proof</label>
                <input id="social-proof" type="text" value="${config.conversion.socialProof}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Join 10,000+ satisfied customers">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Guarantee Badge</label>
                <input id="guarantee-text" type="text" value="${config.conversion.guarantee}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="30-day money back guarantee">
              </div>

              <div class="pt-4 border-t border-gray-800">
                <label class="block text-xs text-gray-500 mb-2">Tracking Event Name</label>
                <input id="tracking-event" type="text" value="${config.conversion.tracking.eventName}"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-2">Custom CSS</label>
                <textarea id="custom-css" rows="4"
                  class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-mono resize-none focus:outline-none focus:border-violet-500"
                  placeholder="/* Custom CSS styles */"></textarea>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="flex-1 p-8 flex flex-col">
          <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Preview</h3>
          <div class="flex-1 bg-gray-800/50 rounded-xl p-8 flex flex-col items-${config.positioning.alignment} justify-center border border-gray-700">
            ${config.conversion.socialProof ? `
              <div class="text-xs text-green-400 mb-3 flex items-center gap-1">
                <i class="fa fa-users"></i>
                ${config.conversion.socialProof}
              </div>
            ` : ''}

            <button id="cta-preview-btn" class="cta-preview-btn inline-flex items-center justify-center gap-2 transition-all"
                    style="${buttonStyleStr}"
                    onmouseenter="this.style.transform = '${hoverEffects.find(h => h.id === config.appearance.hoverEffect)?.transform || 'none'}'"
                    onmouseleave="this.style.transform = 'none'">
              ${config.content.icon && config.content.iconPosition === 'left' ? `<i class="fa ${config.content.icon}"></i>` : ''}
              <span>${config.content.text}</span>
              ${config.content.icon && config.content.iconPosition === 'right' ? `<i class="fa ${config.content.icon}"></i>` : ''}
            </button>

            ${config.content.subtext ? `
              <p class="text-xs text-gray-500 mt-2">${config.content.subtext}</p>
            ` : ''}

            ${config.conversion.urgencyText ? `
              <div class="text-xs text-orange-400 mt-2 flex items-center gap-1">
                <i class="fa fa-clock"></i>
                ${config.conversion.urgencyText}
              </div>
            ` : ''}

            ${config.conversion.guarantee ? `
              <div class="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <i class="fa fa-shield-alt"></i>
                ${config.conversion.guarantee}
              </div>
            ` : ''}
          </div>

          <div class="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div class="text-xs text-gray-500 mb-2">HTML Code</div>
            <code class="text-xs text-gray-300 font-mono break-all" id="html-code">
              &lt;button class="cta-button" style="${buttonStyleStr.replace(/"/g, '&quot;')}"&gt;${config.content.text}&lt;/button&gt;
            </code>
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

    const previewToggle = container.querySelector('#preview-toggle');
    if (previewToggle) {
      previewToggle.addEventListener('click', () => {
        state.isPreviewMode = !state.isPreviewMode;
        render();
      });
    }

    const saveBtn = container.querySelector('#save-cta');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (onSave) {
          onSave(state.ctaConfig);
        }
      });
    }

    const btnText = container.querySelector('#btn-text');
    if (btnText) {
      btnText.addEventListener('input', (e) => {
        state.ctaConfig.content.text = e.target.value;
        render();
      });
    }

    const btnSubtext = container.querySelector('#btn-subtext');
    if (btnSubtext) {
      btnSubtext.addEventListener('input', (e) => {
        state.ctaConfig.content.subtext = e.target.value;
        render();
      });
    }

    container.querySelectorAll('.icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.content.icon = btn.dataset.icon;
        render();
      });
    });

    container.querySelectorAll('.pos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.content.iconPosition = btn.dataset.position;
        render();
      });
    });

    container.querySelectorAll('.style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.style = btn.dataset.style;
        render();
      });
    });

    container.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.size = btn.dataset.size;
        render();
      });
    });

    container.querySelectorAll('.shape-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.shape = btn.dataset.shape;
        render();
      });
    });

    const bgColor = container.querySelector('#bg-color');
    const bgColorText = container.querySelector('#bg-color-text');
    if (bgColor) {
      bgColor.addEventListener('input', (e) => {
        state.ctaConfig.appearance.backgroundColor = e.target.value;
        if (bgColorText) bgColorText.value = e.target.value;
        render();
      });
    }
    if (bgColorText) {
      bgColorText.addEventListener('input', (e) => {
        state.ctaConfig.appearance.backgroundColor = e.target.value;
        if (bgColor) bgColor.value = e.target.value;
        render();
      });
    }

    const textColor = container.querySelector('#text-color');
    const textColorText = container.querySelector('#text-color-text');
    if (textColor) {
      textColor.addEventListener('input', (e) => {
        state.ctaConfig.appearance.textColor = e.target.value;
        if (textColorText) textColorText.value = e.target.value;
        render();
      });
    }
    if (textColorText) {
      textColorText.addEventListener('input', (e) => {
        state.ctaConfig.appearance.textColor = e.target.value;
        if (textColor) textColor.value = e.target.value;
        render();
      });
    }

    container.querySelectorAll('.shadow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.appearance.shadow = btn.dataset.shadow;
        render();
      });
    });

    container.querySelectorAll('.hover-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.appearance.hoverEffect = btn.dataset.hover;
        render();
      });
    });

    container.querySelectorAll('.action-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.action.type = btn.dataset.actionType;
        render();
      });
    });

    container.querySelectorAll('.align-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.ctaConfig.positioning.alignment = btn.dataset.align;
        render();
      });
    });

    const urgencyText = container.querySelector('#urgency-text');
    if (urgencyText) {
      urgencyText.addEventListener('input', (e) => {
        state.ctaConfig.conversion.urgencyText = e.target.value;
        render();
      });
    }

    const socialProof = container.querySelector('#social-proof');
    if (socialProof) {
      socialProof.addEventListener('input', (e) => {
        state.ctaConfig.conversion.socialProof = e.target.value;
        render();
      });
    }

    const guaranteeText = container.querySelector('#guarantee-text');
    if (guaranteeText) {
      guaranteeText.addEventListener('input', (e) => {
        state.ctaConfig.conversion.guarantee = e.target.value;
        render();
      });
    }

    const ctaPreview = container.querySelector('#cta-preview-btn');
    if (ctaPreview) {
      ctaPreview.addEventListener('mouseenter', () => { state.previewHover = true; });
      ctaPreview.addEventListener('mouseleave', () => { state.previewHover = false; });
    }
  }

  render();

  container.api = {
    getConfig: () => state.ctaConfig,
    setConfig: (newConfig) => {
      Object.assign(state.ctaConfig, newConfig);
      render();
    }
  };

  return container;
}
