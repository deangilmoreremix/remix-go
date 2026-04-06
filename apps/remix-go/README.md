# RemixGo Vanilla

A vanilla JavaScript/Vite implementation of the RemixGo video editor application, converted from the original React/Next.js codebase.

## Overview

This project converts the strategic-limited/remix-go video editor application from React to vanilla JavaScript, making it suitable for integration into other applications as a modular component.

## Features

### Core Video Editor Components
- **VideoEditor**: Main video editing interface
- **EnhancedVideoEditor**: Advanced video editing with additional features
- **ConstructionWorkspace**: Video timeline and editing workspace
- **ConstructionScene**: Video canvas and rendering area
- **CheckpointsList**: Video timeline checkpoints
- **VideoSelectionWorkspace**: Video library browser
- **AudioSelectionWorkspace**: Audio library browser

### User Custom Features
- **AIContentGenerator**: AI-powered content creation
- **CommandPalette**: Keyboard shortcut interface
- **CTABuilder**: Call-to-action button builder
- **BehavioralAnalytics**: User behavior tracking
- **ThemeCustomizer**: Theme customization system
- **TemplateSystem**: Template management
- **NavigationBuilder**: Navigation menu builder
- **FormBuilder**: Custom form creator

### UI Components
- Modal components (Alert, Confirmation, FilePicker, etc.)
- AI generation panels
- Layout components (Sidebar, Header, etc.)
- Advanced features (Undo/Redo, AutoSave, etc.)

## Installation

```bash
cd apps/remix-go
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage

### Basic Usage

```javascript
import { createRemixGoApp, VideoEditor } from 'remix-go-vanilla';

// Create app instance
const app = createRemixGoApp(document.getElementById('app'));

// Mount video editor
const videoEditor = VideoEditor();
app.mount('video-editor', videoEditor);
```

### Advanced Usage

```javascript
import {
  VideoEditor,
  AIContentGenerator,
  CommandPalette,
  ThemeCustomizer
} from 'remix-go-vanilla';

// Initialize with custom options
const app = createRemixGoApp(document.getElementById('app'), {
  theme: 'dark'
});

// Mount multiple components
app.mount('video-editor', VideoEditor());
app.mount('ai-panel', AIContentGenerator({
  onGenerate: (content) => console.log(content)
}));

// Add command palette
const palette = CommandPalette({
  commands: [...],
  onSelect: (cmd) => console.log(cmd)
});
document.body.appendChild(palette);
```

## API Reference

### Main Classes

#### `RemixGoVanilla`
Main application class that manages component mounting and lifecycle.

**Methods:**
- `mount(componentName, component, targetSelector)`: Mount a component
- `getComponent(componentName)`: Get a mounted component
- `showModal(modalComponent)`: Show a modal component
- `destroy()`: Clean up the application

#### `createRemixGoApp(container, options)`
Factory function to create a new app instance.

### Component API

Each component returns a DOM element with an optional `api` property containing component-specific methods.

## Architecture

### File Structure
```
src/
├── components/          # All UI components
│   ├── VideoEditor.js
│   ├── AIContentGenerator.js
│   └── ...
├── lib/                # Utilities and helpers
│   ├── editor.js
│   ├── utils.js
│   └── white-label.js
├── services/           # External services
│   └── alertService.js
├── styles/             # CSS styles
│   └── main.css
└── index.js            # Main entry point
```

### Component Pattern

All components follow a consistent vanilla JS pattern:

```javascript
export default function ComponentName(options = {}) {
  const container = document.createElement('div');
  container.className = 'component-name';

  function render() {
    container.innerHTML = `...`;
    attachEventListeners();
  }

  function attachEventListeners() {
    // Event binding
  }

  render();

  // Optional API
  container.api = {
    method1: () => {},
    method2: () => {}
  };

  return container;
}
```

## Integration

This library is designed to be easily integrated into existing applications:

1. **NPM Package**: Install via npm and import components
2. **CDN**: Load the built bundle from a CDN
3. **Direct Import**: Use the source files directly

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project maintains the same license as the original remix-go repository.