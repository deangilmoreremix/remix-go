// Main entry point for RemixGo Vanilla JS Video Editor
import './styles/main.css';

// Core Components
export { default as VideoEditor } from './components/VideoEditor.js';
export { default as EnhancedVideoEditor } from './components/EnhancedVideoEditor.js';
export { default as ConstructionWorkspace } from './components/ConstructionWorkspace.js';
export { default as ConstructionScene } from './components/ConstructionScene.js';
export { default as CheckpointsList } from './components/CheckpointsList.js';
export { default as Checkpoint } from './components/Checkpoint.js';

// Media Selection Components
export { default as VideoSelectionWorkspace } from './components/VideoSelectionWorkspace.js';
export { default as AudioSelectionWorkspace } from './components/AudioSelectionWorkspace.js';

// User Custom Features
export { default as AIContentGenerator } from './components/AIContentGenerator.js';
export { default as CommandPalette } from './components/CommandPalette.js';
export { default as CTABuilder } from './components/CTABuilder.js';
export { default as BehavioralAnalytics } from './components/BehavioralAnalytics.js';
export { default as ThemeCustomizer } from './components/ThemeCustomizer.js';
export { default as TemplateSystem } from './components/TemplateSystem.js';
export { default as NavigationBuilder } from './components/NavigationBuilder.js';
export { default as FormBuilder } from './components/FormBuilder.js';

// UI Components
export { default as AlertModal } from './components/AlertModal.js';
export { default as ConfirmationModal } from './components/ConfirmationModal.js';
export { default as FilePickerModal } from './components/FilePickerModal.js';
export { default as HelpModal } from './components/HelpModal.js';
export { default as KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.js';
export { default as OnboardingModal } from './components/OnboardingModal.js';
export { default as PreviewModal } from './components/PreviewModal.js';
export { default as ProgressModal } from './components/ProgressModal.js';
export { default as SettingsModal } from './components/SettingsModal.js';

// AI Components
export { default as AIGeneratePanel } from './components/AIGeneratePanel.js';
export { default as AvatarGenerator } from './components/AvatarGenerator.js';
export { default as BatchGenerator } from './components/BatchGenerator.js';
export { default as ScriptWriter } from './components/ScriptWriter.js';
export { default as VoiceClone } from './components/VoiceClone.js';

// Layout Components
export { default as BrandHeader } from './components/BrandHeader.js';
export { default as Sidebar } from './components/Sidebar.js';
export { default as WizardStepper } from './components/WizardStepper.js';

// Utilities and Services
export * from './lib/index.js';
export * from './services/index.js';

// Main App Class
export class RemixGoVanilla {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      theme: 'dark',
      ...options
    };
    this.components = new Map();
    this.initialize();
  }

  initialize() {
    // Set up basic app structure
    this.container.innerHTML = `
      <div class="remix-go-app w-full h-screen bg-gray-900 flex flex-col">
        <div id="app-header" class="flex-shrink-0"></div>
        <div id="app-main" class="flex-1 flex overflow-hidden">
          <div id="app-sidebar" class="flex-shrink-0"></div>
          <div id="app-content" class="flex-1 overflow-hidden"></div>
        </div>
        <div id="app-footer" class="flex-shrink-0"></div>
      </div>
    `;

    // Initialize theme
    this.applyTheme();
  }

  applyTheme() {
    document.documentElement.classList.toggle('dark', this.options.theme === 'dark');
  }

  // Component management
  mount(componentName, component, targetSelector = '#app-content') {
    const target = this.container.querySelector(targetSelector);
    if (target) {
      target.innerHTML = '';
      target.appendChild(component);
      this.components.set(componentName, component);
    }
  }

  getComponent(componentName) {
    return this.components.get(componentName);
  }

  // Utility methods
  showModal(modalComponent) {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center';
    modalContainer.appendChild(modalComponent);
    document.body.appendChild(modalContainer);

    // Auto-remove on close
    const originalClose = modalComponent.api?.close;
    if (originalClose) {
      modalComponent.api.close = () => {
        originalClose();
        document.body.removeChild(modalContainer);
      };
    }
  }

  // Lifecycle methods
  destroy() {
    this.components.forEach(component => {
      if (component.api?.destroy) {
        component.api.destroy();
      }
    });
    this.components.clear();
  }
}

// Helper function to initialize the app
export function createRemixGoApp(container, options = {}) {
  return new RemixGoVanilla(container, options);
}

// Export everything as default
export default {
  RemixGoVanilla,
  createRemixGoApp,
  // All component exports are available as named exports
};