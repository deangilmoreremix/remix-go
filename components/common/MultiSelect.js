import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class MultiSelect extends Component {
  @observable
  selectedItems = new Map();

  @observable
  lastSelectedIndex = -1;

  @observable
  isSelecting = false;

  constructor(props) {
    super(props);
    this.setupKeyboardListeners();
  }

  componentWillUnmount() {
    this.removeKeyboardListeners();
  }

  setupKeyboardListeners = () => {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('keyup', this.handleKeyUp);
    }
  };

  removeKeyboardListeners = () => {
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeyDown);
      document.removeEventListener('keyup', this.handleKeyUp);
    }
  };

  handleKeyDown = (e) => {
    if (e.key === 'Control' || e.key === 'Meta') {
      this.isSelecting = true;
    }

    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.selectAll();
    }

    if (e.key === 'Escape') {
      this.clearSelection();
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedItems.size > 0) {
        e.preventDefault();
        this.handleBulkDelete();
      }
    }
  };

  handleKeyUp = (e) => {
    if (e.key === 'Control' || e.key === 'Meta') {
      this.isSelecting = false;
    }
  };

  @action
  selectItem = (itemId, itemIndex = -1, shiftKey = false) => {
    if (shiftKey && this.lastSelectedIndex >= 0 && itemIndex >= 0) {
      // Range selection
      this.selectRange(this.lastSelectedIndex, itemIndex);
    } else if (this.isSelecting) {
      // Toggle selection
      if (this.selectedItems.has(itemId)) {
        this.selectedItems.delete(itemId);
      } else {
        this.selectedItems.set(itemId, true);
      }
    } else {
      // Single selection - clear previous and select this one
      this.selectedItems.clear();
      this.selectedItems.set(itemId, true);
      this.lastSelectedIndex = itemIndex;
    }

    this.notifySelectionChange();
  };

  @action
  selectRange = (startIndex, endIndex) => {
    const { items = [] } = this.props;
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    this.selectedItems.clear();

    for (let i = minIndex; i <= maxIndex; i++) {
      if (items[i] && items[i].id) {
        this.selectedItems.set(items[i].id, true);
      }
    }

    this.lastSelectedIndex = endIndex;
  };

  @action
  selectAll = () => {
    const { items = [] } = this.props;
    this.selectedItems.clear();

    items.forEach((item, index) => {
      if (item.id) {
        this.selectedItems.set(item.id, true);
      }
    });

    this.lastSelectedIndex = items.length - 1;
    this.notifySelectionChange();
  };

  @action
  clearSelection = () => {
    this.selectedItems.clear();
    this.lastSelectedIndex = -1;
    this.notifySelectionChange();
  };

  @action
  invertSelection = () => {
    const { items = [] } = this.props;
    const newSelection = new Map();

    items.forEach(item => {
      if (item.id) {
        if (!this.selectedItems.has(item.id)) {
          newSelection.set(item.id, true);
        }
      }
    });

    this.selectedItems = newSelection;
    this.lastSelectedIndex = -1;
    this.notifySelectionChange();
  };

  notifySelectionChange = () => {
    if (this.props.onSelectionChange) {
      const selectedIds = Array.from(this.selectedItems.keys());
      this.props.onSelectionChange(selectedIds);
    }
  };

  handleBulkDelete = () => {
    if (this.props.onBulkDelete) {
      const selectedIds = Array.from(this.selectedItems.keys());
      this.props.onBulkDelete(selectedIds);
      this.clearSelection();
    }
  };

  handleBulkDuplicate = () => {
    if (this.props.onBulkDuplicate) {
      const selectedIds = Array.from(this.selectedItems.keys());
      this.props.onBulkDuplicate(selectedIds);
    }
  };

  handleBulkMove = (direction) => {
    if (this.props.onBulkMove) {
      const selectedIds = Array.from(this.selectedItems.keys());
      this.props.onBulkMove(selectedIds, direction);
    }
  };

  @computed
  get selectedCount() {
    return this.selectedItems.size;
  }

  @computed
  get hasSelection() {
    return this.selectedCount > 0;
  }

  isSelected = (itemId) => {
    return this.selectedItems.has(itemId);
  };

  render() {
    const { children, showBulkActions = true } = this.props;

    return (
      <div className="multi-select-container">
        {showBulkActions && this.hasSelection && (
          <div className="bulk-actions-bar">
            <div className="selection-info">
              {this.selectedCount} item{this.selectedCount > 1 ? 's' : ''} selected
            </div>

            <div className="bulk-actions">
              <button
                className="bulk-action-btn"
                onClick={this.handleBulkDuplicate}
                title="Duplicate selected items (Ctrl+D)"
              >
                <i className="fa fa-copy" /> Duplicate
              </button>

              <button
                className="bulk-action-btn"
                onClick={() => this.handleBulkMove('up')}
                title="Move selected items up"
              >
                <i className="fa fa-arrow-up" /> Move Up
              </button>

              <button
                className="bulk-action-btn"
                onClick={() => this.handleBulkMove('down')}
                title="Move selected items down"
              >
                <i className="fa fa-arrow-down" /> Move Down
              </button>

              <button
                className="bulk-action-btn danger"
                onClick={this.handleBulkDelete}
                title="Delete selected items (Delete)"
              >
                <i className="fa fa-trash" /> Delete
              </button>

              <button
                className="bulk-action-btn secondary"
                onClick={this.clearSelection}
                title="Clear selection (Escape)"
              >
                <i className="fa fa-times" /> Clear
              </button>
            </div>
          </div>
        )}

        <div className="multi-select-content">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                'data-multi-select-item': true,
                'data-item-id': child.props['data-item-id'] || child.props.id || `item-${index}`,
                'data-item-index': index,
                className: classnames(child.props.className, {
                  'multi-selected': this.isSelected(child.props['data-item-id'] || child.props.id || `item-${index}`)
                }),
                onClick: (e) => {
                  const itemId = child.props['data-item-id'] || child.props.id || `item-${index}`;
                  this.selectItem(itemId, index, e.shiftKey);

                  // Call original onClick if it exists
                  if (child.props.onClick) {
                    child.props.onClick(e);
                  }
                }
              });
            }
            return child;
          })}
        </div>

        <style jsx>{`
          .multi-select-container {
            position: relative;
          }

          .bulk-actions-bar {
            background: #e3f2fd;
            border: 1px solid #2196f3;
            border-radius: 4px;
            padding: 8px 12px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
          }

          .selection-info {
            font-weight: 500;
            color: #1976d2;
            font-size: 14px;
          }

          .bulk-actions {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .bulk-action-btn {
            background: #2196f3;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: background-color 0.2s;
          }

          .bulk-action-btn:hover {
            background: #1976d2;
          }

          .bulk-action-btn.secondary {
            background: #6c757d;
          }

          .bulk-action-btn.secondary:hover {
            background: #5a6268;
          }

          .bulk-action-btn.danger {
            background: #dc3545;
          }

          .bulk-action-btn.danger:hover {
            background: #c82333;
          }

          .multi-select-content {
            /* Container for selectable items */
          }

          .multi-selected {
            background: #fff3cd !important;
            border: 2px solid #ffc107 !important;
            border-radius: 4px;
          }

          @media (max-width: 768px) {
            .bulk-actions-bar {
              flex-direction: column;
              align-items: stretch;
            }

            .bulk-actions {
              justify-content: center;
            }

            .bulk-action-btn {
              flex: 1;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    );
  }
}

MultiSelect.propTypes = {
  items: PropTypes.array,
  onSelectionChange: PropTypes.func,
  onBulkDelete: PropTypes.func,
  onBulkDuplicate: PropTypes.func,
  onBulkMove: PropTypes.func,
  showBulkActions: PropTypes.bool,
  children: PropTypes.node
};