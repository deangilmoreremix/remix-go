// Global theme state
let currentTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    accent: '#007bff',
    light: '#f8f9fa',
    dark: '#343a40',
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  logo: '/default-logo.png',
  name: 'Higgsfield',
  domain: 'default',
  theme: 'light'
};

function updateTheme(newTheme) {
  currentTheme = { ...currentTheme, ...newTheme };
  applyThemeToHeader();
}

function applyThemeToHeader() {
  const header = document.querySelector('header.theme-header');
  if (!header) return;

  // Apply theme colors
  header.style.backgroundColor = currentTheme.colors.primary;
  header.style.color = currentTheme.colors.light;
  header.style.borderBottomColor = currentTheme.colors.accent;

  // Update logo
  const logoImg = header.querySelector('.brand-logo');
  if (logoImg) {
    logoImg.src = currentTheme.logo;
  }

  // Update brand name
  const brandName = header.querySelector('.brand-name');
  if (brandName) {
    brandName.textContent = `${currentTheme.name} Video Editor`;
    brandName.style.fontFamily = currentTheme.typography?.fontFamily;
  }

  // Apply theme mode
  document.documentElement.setAttribute('data-theme', currentTheme.theme || 'light');

  // Apply CSS variables
  const root = document.documentElement;
  Object.entries(currentTheme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });

  if (currentTheme.typography?.fontFamily) {
    root.style.setProperty('--theme-font-family', currentTheme.typography.fontFamily);
  }
}

export default function Header() {
  const header = document.createElement('header');
  header.className = 'fixed top-0 left-0 right-0 h-14 backdrop-blur-md border-b flex items-center px-4 z-50 theme-header';
  header.innerHTML = `
    <div class="flex items-center gap-3">
      <button class="back-button flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-white/10 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        <span class="back-text">Back to ${currentTheme.name}</span>
      </button>
    </div>

    <div class="flex items-center gap-3 logo-section">
      <img src="${currentTheme.logo}" alt="${currentTheme.name} logo" class="brand-logo w-8 h-8 rounded-lg" />
      <span class="brand-name text-white font-bold text-lg" style="font-family: ${currentTheme.typography?.fontFamily}">Remix Go</span>
    </div>

    <div class="flex-1 flex justify-center">
      <nav class="flex items-center gap-1">
        <a href="#getting-started" class="nav-link px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">Home</a>
        <a href="#editor" class="nav-link px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">Editor</a>
        <a href="#landing-page" class="nav-link px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">Landing Pages</a>
        <a href="#publisher" class="nav-link px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">Publish</a>
      </nav>
    </div>

    <div class="flex items-center gap-3">
      <button class="settings-button p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </button>
    </div>
  `;

  // Add event listeners
  const backButton = header.querySelector('.back-button');
  backButton.addEventListener('click', () => {
    window.location.href = '/';
  });

  // Listen for theme updates from main app
  window.addEventListener('message', (event) => {
    if (event.data.type === 'HIGGSFIELD_THEME_UPDATE') {
      updateTheme(event.data.theme);
    }
  });

  // Request theme on initialization
  setTimeout(() => {
    window.parent.postMessage({
      type: 'REMIX_GO_THEME_REQUEST'
    }, '*');
  }, 100);

  return header;
}
