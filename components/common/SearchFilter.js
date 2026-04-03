import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class SearchFilter extends Component {
  @observable
  searchQuery = '';

  @observable
  activeFilters = {
    type: 'all',
    category: 'all',
    date: 'all',
    tags: []
  };

  @observable
  isExpanded = false;

  @observable
  sortBy = 'name';

  @observable
  sortOrder = 'asc';

  constructor(props) {
    super(props);
    this.searchInputRef = React.createRef();
  }

  @action
  updateSearchQuery = (query) => {
    this.searchQuery = query;
    this.props.onSearchChange && this.props.onSearchChange({
      query: this.searchQuery,
      filters: this.activeFilters,
      sort: { by: this.sortBy, order: this.sortOrder }
    });
  };

  @action
  updateFilter = (filterType, value) => {
    this.activeFilters[filterType] = value;
    this.props.onSearchChange && this.props.onSearchChange({
      query: this.searchQuery,
      filters: this.activeFilters,
      sort: { by: this.sortBy, order: this.sortOrder }
    });
  };

  @action
  toggleTag = (tag) => {
    const index = this.activeFilters.tags.indexOf(tag);
    if (index > -1) {
      this.activeFilters.tags.splice(index, 1);
    } else {
      this.activeFilters.tags.push(tag);
    }
    this.props.onSearchChange && this.props.onSearchChange({
      query: this.searchQuery,
      filters: this.activeFilters,
      sort: { by: this.sortBy, order: this.sortOrder }
    });
  };

  @action
  toggleExpanded = () => {
    this.isExpanded = !this.isExpanded;
  };

  @action
  updateSort = (sortBy, sortOrder = this.sortOrder) => {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.props.onSearchChange && this.props.onSearchChange({
      query: this.searchQuery,
      filters: this.activeFilters,
      sort: { by: this.sortBy, order: this.sortOrder }
    });
  };

  handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.clearSearch();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      this.toggleExpanded();
    }
  };

  @action
  clearSearch = () => {
    this.searchQuery = '';
    this.activeFilters = {
      type: 'all',
      category: 'all',
      date: 'all',
      tags: []
    };
    this.props.onSearchChange && this.props.onSearchChange({
      query: '',
      filters: this.activeFilters,
      sort: { by: this.sortBy, order: this.sortOrder }
    });
  };

  render() {
    const { className, placeholder = 'Search...', showFilters = true } = this.props;

    return (
      <div className={classnames('search-filter-container', className)}>
        <div className="search-filter-main">
          <div className="search-input-wrapper">
            <input
              ref={this.searchInputRef}
              type="text"
              className="search-input"
              placeholder={placeholder}
              value={this.searchQuery}
              onChange={(e) => this.updateSearchQuery(e.target.value)}
              onKeyDown={this.handleKeyDown}
            />
            <button
              className="search-clear-btn"
              onClick={this.clearSearch}
              style={{ display: this.searchQuery ? 'block' : 'none' }}
              title="Clear search (Esc)"
            >
              ×
            </button>
          </div>

          {showFilters && (
            <button
              className="filter-toggle-btn"
              onClick={this.toggleExpanded}
              title="Toggle filters (Ctrl+Enter)"
            >
              <i className={`fa ${this.isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
              Filters
            </button>
          )}
        </div>

        {this.isExpanded && showFilters && (
          <div className="search-filter-expanded">
            <div className="filter-row">
              <div className="filter-group">
                <label>Type:</label>
                <select
                  value={this.activeFilters.type}
                  onChange={(e) => this.updateFilter('type', e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="text">Text</option>
                  <option value="audio">Audio</option>
                  <option value="template">Template</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Category:</label>
                <select
                  value={this.activeFilters.category}
                  onChange={(e) => this.updateFilter('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="recent">Recent</option>
                  <option value="favorites">Favorites</option>
                  <option value="drafts">Drafts</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Date:</label>
                <select
                  value={this.activeFilters.date}
                  onChange={(e) => this.updateFilter('date', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group tags-group">
                <label>Tags:</label>
                <div className="tags-container">
                  {['animation', 'music', 'presentation', 'social', 'business', 'personal'].map(tag => (
                    <button
                      key={tag}
                      className={classnames('tag-btn', {
                        active: this.activeFilters.tags.includes(tag)
                      })}
                      onClick={() => this.toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group sort-group">
                <label>Sort by:</label>
                <select
                  value={this.sortBy}
                  onChange={(e) => this.updateSort(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="date">Date</option>
                  <option value="size">Size</option>
                  <option value="type">Type</option>
                </select>
                <button
                  className="sort-order-btn"
                  onClick={() => this.updateSort(this.sortBy, this.sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${this.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  <i className={`fa fa-sort-${this.sortOrder === 'asc' ? 'up' : 'down'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .search-filter-container {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
          }

          .search-filter-main {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .search-input-wrapper {
            position: relative;
            flex: 1;
          }

          .search-input {
            width: 100%;
            padding: 8px 32px 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
          }

          .search-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .search-clear-btn {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #6c757d;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .search-clear-btn:hover {
            color: #495057;
          }

          .filter-toggle-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
          }

          .filter-toggle-btn:hover {
            background: #0056b3;
          }

          .search-filter-expanded {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #e9ecef;
          }

          .filter-row {
            display: flex;
            gap: 16px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }

          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 120px;
          }

          .filter-group label {
            font-size: 12px;
            font-weight: 500;
            color: #495057;
            text-transform: uppercase;
          }

          .filter-group select {
            padding: 6px 8px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
          }

          .filter-group select:focus {
            outline: none;
            border-color: #007bff;
          }

          .tags-group {
            flex: 1;
            min-width: 200px;
          }

          .tags-container {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .tag-btn {
            background: #e9ecef;
            border: 1px solid #ced4da;
            border-radius: 16px;
            padding: 4px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .tag-btn:hover {
            background: #dee2e6;
          }

          .tag-btn.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .sort-group {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
          }

          .sort-order-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 6px 8px;
            border-radius: 4px;
            cursor: pointer;
          }

          .sort-order-btn:hover {
            background: #5a6268;
          }

          @media (max-width: 768px) {
            .filter-row {
              flex-direction: column;
              gap: 12px;
            }

            .filter-group {
              min-width: auto;
            }
          }
        `}</style>
      </div>
    );
  }
}

SearchFilter.propTypes = {
  onSearchChange: PropTypes.func,
  placeholder: PropTypes.string,
  showFilters: PropTypes.bool,
  className: PropTypes.string
};