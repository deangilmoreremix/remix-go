export default function BrandHeader({ showBackButton = true, onBackClick, theme = {} }) {
  const container = document.createElement('header');
  container.className = 'brand-header flex items-center justify-between p-4 border-b border-gray-800';

  const defaultTheme = {
    name: 'RemixGo',
    logo: '/logo.png',
    colors: {
      primary: '#8b5cf6',
      light: '#ffffff',
      accent: '#ec4899'
    }
  };

  const currentTheme = { ...defaultTheme, ...theme };

  function render() {
    container.innerHTML = `
      <div class="flex items-center gap-4">
        ${showBackButton ? `
          <button class="back-button flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                  aria-label="Back to main app">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span class="back-text">Back to ${currentTheme.name}</span>
          </button>
        ` : ''}

        <div class="brand-info flex items-center gap-3">
          <img src="${currentTheme.logo}" alt="${currentTheme.name} logo" class="brand-logo w-8 h-8 rounded-lg" onerror="this.style.display='none'">
          <div>
            <h1 class="brand-name text-xl font-bold text-white">${currentTheme.name}</h1>
            <p class="brand-tagline text-sm text-gray-400">Video Editor</p>
          </div>
        </div>
      </div>

      <div class="header-actions flex items-center gap-3">
        <button class="notification-btn w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title="Notifications">
          <i class="fa fa-bell"></i>
        </button>
        <button class="profile-btn w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title="Profile">
          <i class="fa fa-user"></i>
        </button>
      </div>
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    const backButton = container.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        if (onBackClick) {
          onBackClick();
        } else {
          window.location.href = '/';
        }
      });
    }

    const notificationBtn = container.querySelector('.notification-btn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        console.log('Notifications clicked');
      });
    }

    const profileBtn = container.querySelector('.profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        console.log('Profile clicked');
      });
    }
  }

  render();

  container.api = {
    updateTheme: (newTheme) => {
      Object.assign(currentTheme, newTheme);
      render();
    }
  };

  return container;
}