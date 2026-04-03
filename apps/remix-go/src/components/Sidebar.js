export default function Sidebar({ items, activeItem }) {
  const defaultItems = [
    { id: 'getting-started', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'editor', label: 'Video Editor', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'landing-page', label: 'Landing Pages', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'publisher', label: 'Publish', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
  ];

  const navItems = items || defaultItems;
  const current = activeItem || (window.location.hash.slice(1) || 'getting-started').split('?')[0];

  const sidebar = document.createElement('aside');
  sidebar.className = 'fixed left-0 top-14 bottom-0 w-56 bg-black/30 border-r border-white/5 overflow-y-auto z-40';

  const nav = document.createElement('nav');
  nav.className = 'p-3 space-y-1';

  navItems.forEach(item => {
    const isActive = item.id === current;
    const link = document.createElement('a');
    link.href = `#${item.id}`;
    link.className = `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-violet-600/20 text-violet-300'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;
    link.innerHTML = `
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"/>
      </svg>
      <span>${item.label}</span>
    `;
    nav.appendChild(link);
  });

  sidebar.appendChild(nav);

  const footer = document.createElement('div');
  footer.className = 'absolute bottom-0 left-0 right-0 p-3 border-t border-white/5';
  footer.innerHTML = `
    <a href="https://github.com/deangilmoreremix/Open-Higgsfield-AI" target="_blank"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      Higgsfield AI
    </a>
  `;
  sidebar.appendChild(footer);

  return sidebar;
}
