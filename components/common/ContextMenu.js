import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class ContextMenu extends Component {
  @observable
  isVisible = false;

  @observable
  position = { x: 0, y: 0 };

  @observable
  menuItems = [];

  @observable
  targetElement = null;

  @observable
  targetData = null;

  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
    this.setupEventListeners();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  setupEventListeners = () => {
    if (typeof window !== 'undefined') {
      document.addEventListener('contextmenu', this.handleContextMenu);
      document.addEventListener('click', this.handleClickOutside);
      document.addEventListener('keydown', this.handleKeyDown);
    }
  };

  removeEventListeners = () => {
    if (typeof window !== 'undefined') {
      document.removeEventListener('contextmenu', this.handleContextMenu);
      document.removeEventListener('click', this.handleClickOutside);
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  };

  handleContextMenu = (e) => {
    // Check if the context menu should be shown for this element
    const target = e.target;
    const contextMenuTrigger = target.closest('[data-context-menu]');

    if (contextMenuTrigger) {
      e.preventDefault();

      const menuType = contextMenuTrigger.getAttribute('data-context-menu');
      const elementId = contextMenuTrigger.getAttribute('data-element-id');
      const elementType = contextMenuTrigger.getAttribute('data-element-type');

      this.showMenu(e.clientX, e.clientY, menuType, {
        element: contextMenuTrigger,
        id: elementId,
        type: elementType
      });
    }
  };

  @action
  showMenu = (x, y, menuType, targetData = null) => {
    this.position = { x, y };
    this.menuItems = this.getMenuItems(menuType, targetData);
    this.targetData = targetData;
    this.isVisible = true;

    // Adjust position to keep menu in viewport
    this.adjustPosition();
  };

  @action
  hideMenu = () => {
    this.isVisible = false;
    this.menuItems = [];
    this.targetData = null;
  };

  adjustPosition = () => {
    if (typeof window === 'undefined' || !this.menuRef.current) return;

    const menu = this.menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = this.position;

    // Adjust horizontal position
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 10;
    }

    // Adjust vertical position
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 10;
    }

    // Ensure minimum distance from edges
    x = Math.max(10, x);
    y = Math.max(10, y);

    this.position = { x, y };
  };

  handleClickOutside = (e) => {
    if (this.menuRef.current && !this.menuRef.current.contains(e.target)) {
      this.hideMenu();
    }
  };

  handleKeyDown = (e) => {
    if (!this.isVisible) return;

    if (e.key === 'Escape') {
      this.hideMenu();
    }
  };

  getMenuItems = (menuType, targetData) => {
    const { store } = this.props;

    switch (menuType) {
      case 'timeline-element':
        return [
          {
            id: 'edit',
            label: 'Edit',
            icon: 'fa-edit',
            action: () => this.handleEditElement(targetData)
          },
          {
            id: 'duplicate',
            label: 'Duplicate',
            icon: 'fa-copy',
            action: () => this.handleDuplicateElement(targetData)
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: 'fa-trash',
            action: () => this.handleDeleteElement(targetData),
            danger: true
          },
          { type: 'divider' },
          {
            id: 'bring-front',
            label: 'Bring to Front',
            icon: 'fa-arrow-up',
            action: () => this.handleBringToFront(targetData)
          },
          {
            id: 'send-back',
            label: 'Send to Back',
            icon: 'fa-arrow-down',
            action: () => this.handleSendToBack(targetData)
          }
        ];

      case 'project-item':
        return [
          {
            id: 'open',
            label: 'Open',
            icon: 'fa-folder-open',
            action: () => this.handleOpenProject(targetData)
          },
          {
            id: 'duplicate',
            label: 'Duplicate',
            icon: 'fa-copy',
            action: () => this.handleDuplicateProject(targetData)
          },
          {
            id: 'rename',
            label: 'Rename',
            icon: 'fa-edit',
            action: () => this.handleRenameProject(targetData)
          },
          {
            id: 'export',
            label: 'Export',
            icon: 'fa-download',
            action: () => this.handleExportProject(targetData)
          },
          { type: 'divider' },
          {
            id: 'delete',
            label: 'Delete',
            icon: 'fa-trash',
            action: () => this.handleDeleteProject(targetData),
            danger: true
          }
        ];

      case 'media-item':
        return [
          {
            id: 'preview',
            label: 'Preview',
            icon: 'fa-eye',
            action: () => this.handlePreviewMedia(targetData)
          },
          {
            id: 'add-timeline',
            label: 'Add to Timeline',
            icon: 'fa-plus',
            action: () => this.handleAddToTimeline(targetData)
          },
          {
            id: 'replace',
            label: 'Replace Media',
            icon: 'fa-exchange',
            action: () => this.handleReplaceMedia(targetData)
          },
          { type: 'divider' },
          {
            id: 'properties',
            label: 'Properties',
            icon: 'fa-info-circle',
            action: () => this.handleShowProperties(targetData)
          }
        ];

      default:
        return [];
    }
  };

  handleEditElement = (targetData) => {
    if (this.props.onEditElement) {
      this.props.onEditElement(targetData);
    }
  };

  handleDuplicateElement = (targetData) => {
    if (this.props.onDuplicateElement) {
      this.props.onDuplicateElement(targetData);
    }
  };

  handleDeleteElement = (targetData) => {
    if (this.props.onDeleteElement) {
      this.props.onDeleteElement(targetData);
    }
  };

  handleBringToFront = (targetData) => {
    if (this.props.onBringToFront) {
      this.props.onBringToFront(targetData);
    }
  };

  handleSendToBack = (targetData) => {
    if (this.props.onSendToBack) {
      this.props.onSendToBack(targetData);
    }
  };

  handleOpenProject = (targetData) => {
    if (this.props.onOpenProject) {
      this.props.onOpenProject(targetData);
    }
  };

  handleDuplicateProject = (targetData) => {
    if (this.props.onDuplicateProject) {
      this.props.onDuplicateProject(targetData);
    }
  };

  handleRenameProject = (targetData) => {
    if (this.props.onRenameProject) {
      this.props.onRenameProject(targetData);
    }
  };

  handleExportProject = (targetData) => {
    if (this.props.onExportProject) {
      this.props.onExportProject(targetData);
    }
  };

  handleDeleteProject = (targetData) => {
    if (this.props.onDeleteProject) {
      this.props.onDeleteProject(targetData);
    }
  };

  handlePreviewMedia = (targetData) => {
    if (this.props.onPreviewMedia) {
      this.props.onPreviewMedia(targetData);
    }
  };

  handleAddToTimeline = (targetData) => {
    if (this.props.onAddToTimeline) {
      this.props.onAddToTimeline(targetData);
    }
  };

  handleReplaceMedia = (targetData) => {
    if (this.props.onReplaceMedia) {
      this.props.onReplaceMedia(targetData);
    }
  };

  handleShowProperties = (targetData) => {
    if (this.props.onShowProperties) {
      this.props.onShowProperties(targetData);
    }
  };

  handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    this.hideMenu();
  };

  render() {
    if (!this.isVisible) return null;

    return (
      <div
        ref={this.menuRef}
        className="context-menu"
        style={{
          left: this.position.x,
          top: this.position.y
        }}
      >
        {this.menuItems.map((item, index) => {
          if (item.type === 'divider') {
            return <div key={`divider-${index}`} className="context-menu-divider" />;
          }

          return (
            <div
              key={item.id}
              className={classnames('context-menu-item', {
                danger: item.danger
              })}
              onClick={() => this.handleMenuItemClick(item)}
            >
              {item.icon && (
                <div className="context-menu-icon">
                  <i className={`fa ${item.icon}`} />
                </div>
              )}
              <span className="context-menu-label">{item.label}</span>
              {item.shortcut && (
                <span className="context-menu-shortcut">{item.shortcut}</span>
              )}
            </div>
          );
        })}

        <style jsx>{`
          .context-menu {
            position: fixed;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            min-width: 160px;
            max-width: 250px;
            padding: 4px 0;
          }

          .context-menu-item {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            color: #212529;
            transition: background-color 0.15s;
          }

          .context-menu-item:hover {
            background: #f8f9fa;
          }

          .context-menu-item.danger {
            color: #dc3545;
          }

          .context-menu-item.danger:hover {
            background: #f8d7da;
          }

          .context-menu-icon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            color: #6c757d;
          }

          .context-menu-label {
            flex: 1;
          }

          .context-menu-shortcut {
            font-size: 12px;
            color: #6c757d;
            margin-left: 16px;
          }

          .context-menu-divider {
            height: 1px;
            background: #e9ecef;
            margin: 4px 0;
          }
        `}</style>
      </div>
    );
  }
}

ContextMenu.propTypes = {
  onEditElement: PropTypes.func,
  onDuplicateElement: PropTypes.func,
  onDeleteElement: PropTypes.func,
  onBringToFront: PropTypes.func,
  onSendToBack: PropTypes.func,
  onOpenProject: PropTypes.func,
  onDuplicateProject: PropTypes.func,
  onRenameProject: PropTypes.func,
  onExportProject: PropTypes.func,
  onDeleteProject: PropTypes.func,
  onPreviewMedia: PropTypes.func,
  onAddToTimeline: PropTypes.func,
  onReplaceMedia: PropTypes.func,
  onShowProperties: PropTypes.func
};