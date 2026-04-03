export default function HelpModal({ section, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';

  const helpContent = getHelpContent(section);

  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white flex items-center gap-2">
          <svg class="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Help & Documentation
        </h3>
        <button id="help-close" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="mb-6">
        <nav class="flex flex-wrap gap-2 mb-4">
          ${getHelpSections().map(s => `
            <button data-section="${s.id}"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors ${
                section === s.id ? 'bg-violet-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
              }">
              ${s.title}
            </button>
          `).join('')}
        </nav>
      </div>

      <div id="help-content" class="prose prose-invert max-w-none">
        ${helpContent}
      </div>

      <div class="flex gap-3 justify-between items-center mt-8 pt-4 border-t border-white/10">
        <div class="text-xs text-gray-500">
          Need more help? <a href="mailto:support@remix-go.com" class="text-violet-400 hover:text-violet-300">Contact Support</a>
        </div>
        <div class="flex gap-2">
          <button id="help-prev" class="px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm">
            Previous
          </button>
          <button id="help-next" class="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  `;

  // Event handlers
  modal.querySelector('#help-close').addEventListener('click', () => {
    if (onClose) onClose();
    modal.remove();
  });

  // Section navigation
  modal.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newSection = btn.dataset.section;
      updateHelpContent(modal, newSection);
    });
  });

  // Navigation buttons
  const sections = getHelpSections();
  let currentIndex = sections.findIndex(s => s.id === section) || 0;

  modal.querySelector('#help-prev').addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateHelpContent(modal, sections[currentIndex].id);
  });

  modal.querySelector('#help-next').addEventListener('click', () => {
    currentIndex = Math.min(sections.length - 1, currentIndex + 1);
    updateHelpContent(modal, sections[currentIndex].id);
  });

  // Update navigation state
  updateNavigationState(modal, currentIndex, sections.length);

  return modal;
}

function updateHelpContent(modal, section) {
  const contentEl = modal.querySelector('#help-content');
  const navButtons = modal.querySelectorAll('[data-section]');

  // Update active nav button
  navButtons.forEach(btn => {
    const isActive = btn.dataset.section === section;
    btn.className = `px-3 py-1.5 rounded-lg text-sm transition-colors ${
      isActive ? 'bg-violet-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
    }`;
  });

  // Update content
  contentEl.innerHTML = getHelpContent(section);

  // Update navigation
  const sections = getHelpSections();
  const currentIndex = sections.findIndex(s => s.id === section);
  updateNavigationState(modal, currentIndex, sections.length);
}

function updateNavigationState(modal, currentIndex, totalSections) {
  const prevBtn = modal.querySelector('#help-prev');
  const nextBtn = modal.querySelector('#help-next');

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === totalSections - 1;

  prevBtn.className = prevBtn.disabled
    ? 'px-3 py-1.5 rounded-lg bg-white/5 text-gray-600 cursor-not-allowed text-sm'
    : 'px-3 py-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors text-sm';

  nextBtn.className = nextBtn.disabled
    ? 'px-3 py-1.5 rounded-lg bg-violet-600/50 text-gray-400 cursor-not-allowed text-sm'
    : 'px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors text-sm';
}

function getHelpSections() {
  return [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'video-editor', title: 'Video Editor' },
    { id: 'timeline', title: 'Timeline' },
    { id: 'overlays', title: 'Overlays' },
    { id: 'personalization', title: 'Personalization' },
    { id: 'landing-pages', title: 'Landing Pages' },
    { id: 'publishing', title: 'Publishing' },
    { id: 'keyboard-shortcuts', title: 'Shortcuts' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
  ];
}

function getHelpContent(section) {
  const content = {
    'getting-started': `
      <h4 class="text-lg font-semibold mb-4">Welcome to Remix Go!</h4>
      <p class="mb-4">Remix Go is a powerful video editor that lets you create personalized videos without coding experience.</p>

      <h5 class="font-semibold mb-2">Quick Start:</h5>
      <ol class="list-decimal list-inside space-y-1 mb-4">
        <li>Choose how to start: Generate with AI, upload a video, or record</li>
        <li>Add overlays like text, images, or forms</li>
        <li>Personalize with tokens like {{FIRSTNAME}}</li>
        <li>Publish and share your video</li>
      </ol>

      <div class="bg-violet-600/20 p-4 rounded-lg">
        <p class="text-sm"><strong>Pro Tip:</strong> Start with our AI video generator to create professional content in minutes!</p>
      </div>
    `,

    'video-editor': `
      <h4 class="text-lg font-semibold mb-4">Video Editor Overview</h4>
      <p class="mb-4">The video editor is divided into three main areas:</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="bg-white/5 p-3 rounded">
          <h6 class="font-semibold text-violet-400">Sidebar</h6>
          <p class="text-sm">Access tools, templates, and settings</p>
        </div>
        <div class="bg-white/5 p-3 rounded">
          <h6 class="font-semibold text-violet-400">Timeline</h6>
          <p class="text-sm">Control playback and overlay timing</p>
        </div>
        <div class="bg-white/5 p-3 rounded">
          <h6 class="font-semibold text-violet-400">Canvas</h6>
          <p class="text-sm">Visual preview of your video</p>
        </div>
      </div>

      <h5 class="font-semibold mb-2">Basic Workflow:</h5>
      <ul class="list-disc list-inside space-y-1">
        <li>Load or generate a video</li>
        <li>Add overlays (text, images, buttons)</li>
        <li>Adjust timing on the timeline</li>
        <li>Preview and export</li>
      </ul>
    `,

    'timeline': `
      <h4 class="text-lg font-semibold mb-4">Timeline Controls</h4>

      <h5 class="font-semibold mb-2">Playback Controls:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><kbd class="bg-white/20 px-1 rounded text-xs">Space</kbd> - Play/Pause</li>
        <li><kbd class="bg-white/20 px-1 rounded text-xs">←→</kbd> - Scrub timeline</li>
        <li><kbd class="bg-white/20 px-1 rounded text-xs">Home/End</kbd> - Jump to start/end</li>
      </ul>

      <h5 class="font-semibold mb-2">Zoom & Navigation:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li>Mouse wheel to zoom in/out</li>
        <li>Click and drag to pan timeline</li>
        <li>Fit to window button for full view</li>
      </ul>

      <div class="bg-yellow-600/20 p-3 rounded">
        <p class="text-sm"><strong>Note:</strong> Overlay timing is visual - drag elements on the timeline to adjust when they appear.</p>
      </div>
    `,

    'overlays': `
      <h4 class="text-lg font-semibold mb-4">Adding Overlays</h4>

      <h5 class="font-semibold mb-2">Types of Overlays:</h5>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div>
          <h6 class="font-semibold text-green-400">Text</h6>
          <p class="text-sm">Titles, subtitles, callouts</p>
        </div>
        <div>
          <h6 class="font-semibold text-blue-400">Images</h6>
          <p class="text-sm">Logos, graphics, watermarks</p>
        </div>
        <div>
          <h6 class="font-semibold text-purple-400">Forms</h6>
          <p class="text-sm">Lead capture, email signup</p>
        </div>
        <div>
          <h6 class="font-semibold text-red-400">CTAs</h6>
          <p class="text-sm">Buttons, links, actions</p>
        </div>
      </div>

      <h5 class="font-semibold mb-2">Adding Overlays:</h5>
      <ol class="list-decimal list-inside space-y-1">
        <li>Click an overlay button in the sidebar</li>
        <li>Configure settings in the modal</li>
        <li>Position and resize on the canvas</li>
        <li>Set timing on the timeline</li>
      </ol>
    `,

    'personalization': `
      <h4 class="text-lg font-semibold mb-4">Personalization with Tokens</h4>
      <p class="mb-4">Make your videos personal by using tokens that get replaced with viewer-specific information.</p>

      <h5 class="font-semibold mb-2">Available Tokens:</h5>
      <div class="grid grid-cols-2 gap-2 mb-4 font-mono text-sm">
        <div>{{FIRSTNAME}} - First name</div>
        <div>{{LASTNAME}} - Last name</div>
        <div>{{EMAIL}} - Email address</div>
        <div>{{COMPANY}} - Company name</div>
        <div>{{GEOCITY}} - City location</div>
        <div>{{GEOCOUNTRY}} - Country</div>
      </div>

      <h5 class="font-semibold mb-2">Token Formats:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><code>{{TOKEN}}</code> - Basic replacement</li>
        <li><code>{{up TOKEN}}</code> - Uppercase</li>
        <li><code>{{d TOKEN "default"}}</code> - With fallback</li>
      </ul>

      <div class="bg-green-600/20 p-3 rounded">
        <p class="text-sm"><strong>Example:</strong> "Hi {{FIRSTNAME}}, welcome to {{up COMPANY}}!"</p>
      </div>
    `,

    'landing-pages': `
      <h4 class="text-lg font-semibold mb-4">Landing Page Builder</h4>
      <p class="mb-4">Create professional landing pages with our drag-and-drop builder.</p>

      <h5 class="font-semibold mb-2">Available Components:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Hero Sections:</strong> Headlines, CTAs, backgrounds</li>
        <li><strong>Content Blocks:</strong> Text, images, testimonials</li>
        <li><strong>Forms:</strong> Contact forms, email signups</li>
        <li><strong>Interactive:</strong> Accordions, tabs, carousels</li>
      </ul>

      <h5 class="font-semibold mb-2">Building Pages:</h5>
      <ol class="list-decimal list-inside space-y-1">
        <li>Choose a template or start blank</li>
        <li>Drag components from the sidebar</li>
        <li>Edit content and styling</li>
        <li>Preview on different devices</li>
        <li>Export HTML or embed directly</li>
      </ol>
    `,

    'publishing': `
      <h4 class="text-lg font-semibold mb-4">Publishing Your Content</h4>

      <h5 class="font-semibold mb-2">Export Options:</h5>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Embed Code:</strong> Copy HTML for your website</li>
        <li><strong>Email Campaign:</strong> Generate personalized email links</li>
        <li><strong>Direct Links:</strong> Share URLs with token parameters</li>
        <li><strong>Batch Processing:</strong> Generate multiple personalized versions</li>
      </ul>

      <h5 class="font-semibold mb-2">Email Integration:</h5>
      <p class="mb-2">Works with all major email providers:</p>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li>MailChimp, AWeber, GetResponse</li>
        <li>Constant Contact, SendLane, Infusionsoft</li>
        <li>Custom providers with token replacement</li>
      </ul>

      <div class="bg-blue-600/20 p-3 rounded">
        <p class="text-sm"><strong>Analytics:</strong> Track opens, clicks, and conversions with built-in analytics.</p>
      </div>
    `,

    'keyboard-shortcuts': `
      <h4 class="text-lg font-semibold mb-4">Keyboard Shortcuts</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 class="font-semibold mb-2">Playback:</h5>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span>Play/Pause</span><kbd class="bg-white/20 px-1 rounded">Space</kbd></div>
            <div class="flex justify-between"><span>Rewind 5s</span><kbd class="bg-white/20 px-1 rounded">←</kbd></div>
            <div class="flex justify-between"><span>Forward 5s</span><kbd class="bg-white/20 px-1 rounded">→</kbd></div>
            <div class="flex justify-between"><span>Jump to start</span><kbd class="bg-white/20 px-1 rounded">Home</kbd></div>
            <div class="flex justify-between"><span>Jump to end</span><kbd class="bg-white/20 px-1 rounded">End</kbd></div>
          </div>
        </div>

        <div>
          <h5 class="font-semibold mb-2">Editing:</h5>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span>Undo</span><kbd class="bg-white/20 px-1 rounded">Ctrl+Z</kbd></div>
            <div class="flex justify-between"><span>Redo</span><kbd class="bg-white/20 px-1 rounded">Ctrl+Y</kbd></div>
            <div class="flex justify-between"><span>Copy</span><kbd class="bg-white/20 px-1 rounded">Ctrl+C</kbd></div>
            <div class="flex justify-between"><span>Paste</span><kbd class="bg-white/20 px-1 rounded">Ctrl+V</kbd></div>
            <div class="flex justify-between"><span>Delete</span><kbd class="bg-white/20 px-1 rounded">Del</kbd></div>
          </div>
        </div>
      </div>

      <div class="mt-4 p-3 bg-white/5 rounded">
        <p class="text-sm"><strong>Tip:</strong> Enable keyboard shortcuts in Settings for the full experience.</p>
      </div>
    `,

    'troubleshooting': `
      <h4 class="text-lg font-semibold mb-4">Troubleshooting</h4>

      <h5 class="font-semibold mb-2">Common Issues:</h5>

      <div class="space-y-3 mb-4">
        <details class="bg-white/5 rounded p-3">
          <summary class="cursor-pointer font-semibold">Video won't load</summary>
          <div class="mt-2 text-sm">
            <p>Check that your video file is in a supported format (MP4, WebM) and under 500MB. Try refreshing the page or clearing your browser cache.</p>
          </div>
        </details>

        <details class="bg-white/5 rounded p-3">
          <summary class="cursor-pointer font-semibold">Overlays not appearing</summary>
          <div class="mt-2 text-sm">
            <p>Ensure overlays are positioned within the visible area and have timing set on the timeline. Check that the timeline is playing and overlays aren't hidden.</p>
          </div>
        </details>

        <details class="bg-white/5 rounded p-3">
          <summary class="cursor-pointer font-semibold">Personalization not working</summary>
          <div class="mt-2 text-sm">
            <p>Verify token format ({{TOKEN}}) and that URL parameters match your token names. Check browser console for errors.</p>
          </div>
        </details>

        <details class="bg-white/5 rounded p-3">
          <summary class="cursor-pointer font-semibold">Performance issues</summary>
          <div class="mt-2 text-sm">
            <p>Try reducing video resolution, clearing cache, or using a smaller video file. Check your internet connection and browser performance.</p>
          </div>
        </details>
      </div>

      <h5 class="font-semibold mb-2">Getting Help:</h5>
      <ul class="list-disc list-inside space-y-1">
        <li>Check browser console for error messages</li>
        <li>Try a different browser (Chrome, Firefox, Safari)</li>
        <li>Clear browser cache and cookies</li>
        <li>Contact support with error details</li>
      </ul>
    `,
  };

  return content[section] || content['getting-started'];
}

// Convenience function to open help modal
export function openHelpModal(section = 'getting-started', onClose) {
  const modal = HelpModal({ section, onClose });
  document.body.appendChild(modal);
  return modal;
}
