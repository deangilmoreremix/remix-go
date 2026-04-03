export default function OnboardingModal({ onComplete, onSkip }) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50';

  const steps = [
    {
      title: 'Welcome to Remix Go!',
      content: `
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">🎬</div>
          <p class="text-lg text-gray-300 mb-4">
            Create personalized videos without coding experience
          </p>
          <p class="text-sm text-gray-400">
            Follow this quick tour to learn the basics
          </p>
        </div>
      `,
      action: 'Next',
    },
    {
      title: 'Getting Started',
      content: `
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white font-semibold">1</div>
            <div>
              <h4 class="font-semibold text-white mb-1">Choose Your Method</h4>
              <p class="text-sm text-gray-400">Start with AI generation, upload your video, or record directly</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white font-semibold">2</div>
            <div>
              <h4 class="font-semibold text-white mb-1">Add Personalization</h4>
              <p class="text-sm text-gray-400">Use tokens like {{FIRSTNAME}} to make videos personal</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white font-semibold">3</div>
            <div>
              <h4 class="font-semibold text-white mb-1">Publish & Share</h4>
              <p class="text-sm text-gray-400">Generate embed codes and email campaigns</p>
            </div>
          </div>
        </div>
      `,
      action: 'Next',
    },
    {
      title: 'Key Features',
      content: `
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/5 p-4 rounded-lg">
            <div class="text-2xl mb-2">🤖</div>
            <h4 class="font-semibold text-white mb-1">AI Generation</h4>
            <p class="text-xs text-gray-400">Create videos from text prompts</p>
          </div>
          <div class="bg-white/5 p-4 rounded-lg">
            <div class="text-2xl mb-2">🎭</div>
            <h4 class="font-semibold text-white mb-1">Overlays</h4>
            <p class="text-xs text-gray-400">Text, images, forms, CTAs</p>
          </div>
          <div class="bg-white/5 p-4 rounded-lg">
            <div class="text-2xl mb-2">🎯</div>
            <h4 class="font-semibold text-white mb-1">Personalization</h4>
            <p class="text-xs text-gray-400">Dynamic token replacement</p>
          </div>
          <div class="bg-white/5 p-4 rounded-lg">
            <div class="text-2xl mb-2">📄</div>
            <h4 class="font-semibold text-white mb-1">Landing Pages</h4>
            <p class="text-xs text-gray-400">Drag-and-drop page builder</p>
          </div>
        </div>
      `,
      action: 'Next',
    },
    {
      title: 'Keyboard Shortcuts',
      content: `
        <div class="space-y-3">
          <div class="bg-white/5 p-3 rounded">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-white">Play/Pause</span>
              <kbd class="bg-white/20 px-2 py-1 rounded text-xs">Space</kbd>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-white">Undo/Redo</span>
              <kbd class="bg-white/20 px-2 py-1 rounded text-xs">Ctrl+Z / Ctrl+Y</kbd>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-white">Help</span>
              <kbd class="bg-white/20 px-2 py-1 rounded text-xs">F1</kbd>
            </div>
          </div>
          <p class="text-sm text-gray-400 text-center">
            Enable keyboard shortcuts in Settings for full functionality
          </p>
        </div>
      `,
      action: 'Get Started',
    },
  ];

  let currentStep = 0;

  function render() {
    const step = steps[currentStep];

    modal.innerHTML = `
      <div class="glass rounded-2xl p-8 max-w-lg w-full mx-4">
        <!-- Progress Indicator -->
        <div class="flex justify-center mb-6">
          <div class="flex gap-2">
            ${steps.map((_, index) => `
              <div class="w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-violet-500' : 'bg-white/20'
              }"></div>
            `).join('')}
          </div>
        </div>

        <!-- Content -->
        <div class="text-center mb-8">
          <h3 class="text-xl font-semibold text-white mb-4">${step.title}</h3>
          <div class="text-left">
            ${step.content}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 justify-between">
          <button id="onboarding-skip" class="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">
            Skip Tour
          </button>
          <div class="flex gap-2">
            ${currentStep > 0 ? `
              <button id="onboarding-prev" class="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                Back
              </button>
            ` : ''}
            <button id="onboarding-next" class="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">
              ${step.action}
            </button>
          </div>
        </div>

        <!-- Skip All -->
        ${currentStep === 0 ? `
          <div class="mt-4 pt-4 border-t border-white/10">
            <button id="onboarding-skip-all" class="w-full text-center text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Don't show this again
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Event handlers
    const nextBtn = modal.querySelector('#onboarding-next');
    const prevBtn = modal.querySelector('#onboarding-prev');
    const skipBtn = modal.querySelector('#onboarding-skip');
    const skipAllBtn = modal.querySelector('#onboarding-skip-all');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          render();
        } else {
          completeOnboarding();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          render();
        }
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (onSkip) onSkip();
        modal.remove();
      });
    }

    if (skipAllBtn) {
      skipAllBtn.addEventListener('click', () => {
        localStorage.setItem('remix-go-skip-onboarding', 'true');
        if (onSkip) onSkip();
        modal.remove();
      });
    }

    // Keyboard navigation
    const handleKeydown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextBtn?.click();
      } else if (e.key === 'ArrowLeft' && prevBtn) {
        e.preventDefault();
        prevBtn.click();
      } else if (e.key === 'Escape') {
        if (skipBtn) skipBtn.click();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    // Cleanup on modal removal
    modal.addEventListener('remove', () => {
      document.removeEventListener('keydown', handleKeydown);
    });
  }

  function completeOnboarding() {
    localStorage.setItem('remix-go-onboarding-completed', 'true');
    if (onComplete) onComplete();
    modal.remove();

    // Show success message
    showCompletionToast();
  }

  function showCompletionToast() {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50 flex items-center gap-2';
    toast.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      Welcome to Remix Go! You're all set to start creating.
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  render();
  return modal;
}

// Convenience functions
export function showOnboarding(onComplete, onSkip) {
  // Check if user has already completed onboarding
  if (localStorage.getItem('remix-go-onboarding-completed') === 'true' ||
      localStorage.getItem('remix-go-skip-onboarding') === 'true') {
    return null;
  }

  const modal = OnboardingModal({ onComplete, onSkip });
  document.body.appendChild(modal);
  return modal;
}

export function resetOnboarding() {
  localStorage.removeItem('remix-go-onboarding-completed');
  localStorage.removeItem('remix-go-skip-onboarding');
}

export function hasCompletedOnboarding() {
  return localStorage.getItem('remix-go-onboarding-completed') === 'true';
}
