import Header from '../components/Header.js';
import Sidebar from '../components/Sidebar.js';

export function initRouter() {
  const app = document.getElementById('app');

  // Create shell
  const header = Header();
  const sidebar = Sidebar();
  document.body.appendChild(header);
  document.body.appendChild(sidebar);

  const contentArea = document.createElement('div');
  contentArea.id = 'page-content';
  contentArea.style.marginTop = '56px';
  contentArea.style.marginLeft = '224px';
  contentArea.style.minHeight = 'calc(100vh - 56px)';
  app.appendChild(contentArea);

  const routes = {
    'getting-started': () => import('../pages/GettingStarted.js'),
    'editor': () => import('../pages/Editor.js'),
    'publisher': () => import('../pages/Publisher.js'),
    'landing-page': () => import('../pages/LandingPageBuilder.js'),
  };

  async function navigate() {
    const fullHash = window.location.hash.slice(1) || 'getting-started';
    const page = fullHash.split('?')[0];
    const loader = routes[page];

    if (loader) {
      contentArea.innerHTML = '';
      try {
        const module = await loader();
        contentArea.appendChild(module.default());
      } catch (err) {
        contentArea.innerHTML = `<div class="p-8 text-red-400">Error loading page: ${err.message}</div>`;
      }
    }

    // Update sidebar active state
    document.querySelectorAll('aside a').forEach(link => {
      const linkPage = link.getAttribute('href')?.replace('#', '');
      if (linkPage === page) {
        link.className = link.className.replace(
          'text-gray-400 hover:text-white hover:bg-white/5',
          'bg-violet-600/20 text-violet-300'
        );
      } else {
        link.className = link.className.replace(
          'bg-violet-600/20 text-violet-300',
          'text-gray-400 hover:text-white hover:bg-white/5'
        );
      }
    });
  }

  window.addEventListener('hashchange', navigate);
  navigate();
}
