import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class CommandPalette extends Component {
  @observable
  isOpen = false;

  @observable
  searchQuery = '';

  @observable
  selectedIndex = 0;

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.setupKeyboardListener();
  }

  componentWillUnmount() {
    this.removeKeyboardListener();
  }

  setupKeyboardListener = () => {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', this.handleGlobalKeyDown);
    }
  };

  removeKeyboardListener = () => {
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', this.handleGlobalKeyDown);
    }
  };

  handleGlobalKeyDown = (e) => {
    // Ctrl+K or Cmd+K to open command palette
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.toggleOpen();
    }

    // Escape to close
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  };

  @action
  toggleOpen = () => {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = '';
      this.selectedIndex = 0;
      // Focus input after render
      setTimeout(() => {
        if (this.inputRef.current) {
          this.inputRef.current.focus();
        }
      }, 100);
    }
  };

  @action
  close = () => {
    this.isOpen = false;
    this.searchQuery = '';
    this.selectedIndex = 0;
  };

  @action
  updateSearchQuery = (query) => {
    this.searchQuery = query;
    this.selectedIndex = 0;
  };

  @action
  navigateResults = (direction) => {
    const filteredCommands = this.filteredCommands;
    if (filteredCommands.length === 0) return;

    if (direction === 'up') {
      this.selectedIndex = this.selectedIndex > 0
        ? this.selectedIndex - 1
        : filteredCommands.length - 1;
    } else if (direction === 'down') {
      this.selectedIndex = this.selectedIndex < filteredCommands.length - 1
        ? this.selectedIndex + 1
        : 0;
    }
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.navigateResults('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.navigateResults('down');
        break;
      case 'Enter':
        e.preventDefault();
        this.executeSelectedCommand();
        break;
      case 'Escape':
        this.close();
        break;
    }
  };

  executeSelectedCommand = () => {
    const filteredCommands = this.filteredCommands;
    if (filteredCommands.length > 0 && filteredCommands[this.selectedIndex]) {
      const command = filteredCommands[this.selectedIndex];
      this.executeCommand(command);
    }
  };

  executeCommand = (command) => {
    if (command.action) {
      command.action();
      this.close();
    }
  };

  @computed
  get filteredCommands() {
    const commands = this.getAvailableCommands();
    if (!this.searchQuery) return commands;

    const query = this.searchQuery.toLowerCase();
    return commands.filter(cmd =>
      cmd.title.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      (cmd.keywords && cmd.keywords.some(keyword => keyword.toLowerCase().includes(query)))
    );
  }

  getAvailableCommands = () => {
    const { store } = this.props;

    return [
      {
        id: 'new-project',
        title: 'New Project',
        description: 'Create a new video project',
        icon: 'fa-plus',
        keywords: ['create', 'new', 'project'],
        action: () => {
          // Navigate to new project page
          if (typeof window !== 'undefined') {
            window.location.href = '/new';
          }
        }
      },
      {
        id: 'save-project',
        title: 'Save Project',
        description: 'Save current project',
        icon: 'fa-save',
        keywords: ['save', 'store', 'persist'],
        action: () => {
          // Trigger save action
          if (store && store.saveProject) {
            store.saveProject();
          }
        }
      },
      {
        id: 'export-video',
        title: 'Export Video',
        description: 'Export current project as video',
        icon: 'fa-download',
        keywords: ['export', 'download', 'render'],
        action: () => {
          // Trigger export
          if (store && store.exportProject) {
            store.exportProject();
          }
        }
      },
      {
        id: 'open-settings',
        title: 'Settings',
        description: 'Open application settings',
        icon: 'fa-cog',
        keywords: ['settings', 'preferences', 'config'],
        action: () => {
          // Open settings modal
          if (this.props.onOpenSettings) {
            this.props.onOpenSettings();
          }
        }
      },
      {
        id: 'toggle-preview',
        title: 'Toggle Preview',
        description: 'Show/hide video preview',
        icon: 'fa-play-circle',
        keywords: ['preview', 'play', 'view'],
        action: () => {
          // Toggle preview
          if (store && store.togglePreview) {
            store.togglePreview();
          }
        }
      },
      {
        id: 'add-text',
        title: 'Add Text Element',
        description: 'Add a new text element to timeline',
        icon: 'fa-font',
        keywords: ['text', 'element', 'add'],
        action: () => {
          // Add text element
          if (store && store.addElement) {
            store.addElement('text');
          }
        }
      },
      {
        id: 'add-image',
        title: 'Add Image Element',
        description: 'Add a new image element to timeline',
        icon: 'fa-image',
        keywords: ['image', 'photo', 'element', 'add'],
        action: () => {
          // Add image element
          if (store && store.addElement) {
            store.addElement('image');
          }
        }
      },
      {
        id: 'undo',
        title: 'Undo',
        description: 'Undo last action',
        icon: 'fa-undo',
        keywords: ['undo', 'revert', 'back'],
        action: () => {
          // Undo action
          if (store && store.undo) {
            store.undo();
          }
        }
      },
      {
        id: 'redo',
        title: 'Redo',
        description: 'Redo last undone action',
        icon: 'fa-redo',
        keywords: ['redo', 'forward', 'repeat'],
        action: () => {
          // Redo action
          if (store && store.redo) {
            store.redo();
          }
        }
      },
      {
        id: 'help',
        title: 'Help & Shortcuts',
        description: 'Show keyboard shortcuts and help',
        icon: 'fa-question-circle',
        keywords: ['help', 'shortcuts', 'guide'],
        action: () => {
          // Open help
          if (this.props.onOpenHelp) {
            this.props.onOpenHelp();
          }
        }
      }
    ];
  };

  render() {
    if (!this.isOpen) return null;

    const filteredCommands = this.filteredCommands;

    return (
      <div className="command-palette-overlay" onClick={this.close}>
        <div className="command-palette-modal" onClick={(e) => e.stopPropagation()}>
          <div className="command-palette-header">
            <input
              ref={this.inputRef}
              type="text"
              className="command-palette-input"
              placeholder="Type a command..."
              value={this.searchQuery}
              onChange={(e) => this.updateSearchQuery(e.target.value)}
              onKeyDown={this.handleKeyDown}
            />
          </div>

          <div className="command-palette-results">
            {filteredCommands.length === 0 ? (
              <div className="command-palette-empty">
                No commands found for "{this.searchQuery}"
              </div>
            ) : (
              filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  className={classnames('command-palette-item', {
                    selected: index === this.selectedIndex
                  })}
                  onClick={() => {
                    this.selectedIndex = index;
                    this.executeSelectedCommand();
                  }}
                >
                  <div className="command-icon">
                    <i className={`fa ${command.icon}`} />
                  </div>
                  <div className="command-content">
                    <div className="command-title">{command.title}</div>
                    <div className="command-description">{command.description}</div>
                  </div>
                  <div className="command-shortcut">
                    {command.shortcut && <kbd>{command.shortcut}</kbd>}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="command-palette-footer">
            <div className="command-palette-hint">
              <kbd>↑↓</kbd> Navigate • <kbd>Enter</kbd> Execute • <kbd>Esc</kbd> Close
            </div>
          </div>
        </div>

        <style jsx>{`
          .command-palette-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 100px;
            z-index: 9999;
          }

          .command-palette-modal {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 600px;
            max-height: 400px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .command-palette-header {
            padding: 16px;
            border-bottom: 1px solid #e9ecef;
          }

          .command-palette-input {
            width: 100%;
            border: none;
            outline: none;
            font-size: 16px;
            padding: 8px 0;
          }

          .command-palette-input::placeholder {
            color: #6c757d;
          }

          .command-palette-results {
            flex: 1;
            overflow-y: auto;
            max-height: 300px;
          }

          .command-palette-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f8f9fa;
            transition: background-color 0.15s;
          }

          .command-palette-item:hover,
          .command-palette-item.selected {
            background: #f8f9fa;
          }

          .command-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            color: #6c757d;
          }

          .command-content {
            flex: 1;
          }

          .command-title {
            font-weight: 500;
            font-size: 14px;
            color: #212529;
          }

          .command-description {
            font-size: 12px;
            color: #6c757d;
            margin-top: 2px;
          }

          .command-shortcut {
            margin-left: 12px;
          }

          .command-shortcut kbd {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 3px;
            padding: 2px 6px;
            font-size: 11px;
            color: #495057;
          }

          .command-palette-empty {
            padding: 32px 16px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
          }

          .command-palette-footer {
            padding: 8px 16px;
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
          }

          .command-palette-hint {
            font-size: 12px;
            color: #6c757d;
            text-align: center;
          }

          .command-palette-hint kbd {
            background: #e9ecef;
            border: 1px solid #ced4da;
            border-radius: 3px;
            padding: 1px 4px;
            font-size: 10px;
            margin: 0 2px;
          }

          @media (max-width: 768px) {
            .command-palette-overlay {
              padding-top: 50px;
            }

            .command-palette-modal {
              width: 95%;
              max-height: 80vh;
            }
          }
        `}</style>
      </div>
    );
  }
}

CommandPalette.propTypes = {
  onOpenSettings: PropTypes.func,
  onOpenHelp: PropTypes.func
};