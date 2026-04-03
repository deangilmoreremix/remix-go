import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class NavigationBuilder extends Component {
  @observable
  navConfig = {
    type: 'header', // header, footer, sidebar, breadcrumbs, tabs
    style: 'horizontal', // horizontal, vertical, dropdown, mega-menu
    position: 'fixed', // fixed, sticky, static, absolute
    theme: 'light', // light, dark, transparent
    logo: {
      text: 'Your Logo',
      image: '',
      url: '/',
      alt: 'Company Logo'
    },
    menuItems: [
      { id: 'home', label: 'Home', url: '/', type: 'link', children: [] },
      { id: 'about', label: 'About', url: '/about', type: 'link', children: [] },
      { id: 'services', label: 'Services', url: '/services', type: 'dropdown', children: [
        { id: 'web-design', label: 'Web Design', url: '/services/web-design' },
        { id: 'development', label: 'Development', url: '/services/development' },
        { id: 'consulting', label: 'Consulting', url: '/services/consulting' }
      ]},
      { id: 'contact', label: 'Contact', url: '/contact', type: 'link', children: [] }
    ],
    ctaButton: {
      text: 'Get Started',
      url: '/signup',
      style: 'primary',
      visible: true
    },
    mobileMenu: {
      enabled: true,
      type: 'hamburger', // hamburger, slide-out, full-screen
      animation: 'slide-down'
    },
    styling: {
      backgroundColor: '#ffffff',
      textColor: '#212529',
      hoverColor: '#007bff',
      activeColor: '#0056b3',
      borderColor: '#e9ecef',
      fontSize: '16px',
      fontWeight: '500',
      padding: '16px 20px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  };

  @observable
  activeTab = 'structure';

  @observable
  selectedItemIndex = -1;

  @observable
  isPreviewMode = true;

  @observable
  mobilePreview = false;

  navTypes = [
    { id: 'header', name: 'Header Navigation', icon: 'fa-header' },
    { id: 'footer', name: 'Footer Navigation', icon: 'fa-footer' },
    { id: 'sidebar', name: 'Sidebar Navigation', icon: 'fa-columns' },
    { id: 'breadcrumbs', name: 'Breadcrumbs', icon: 'fa-link' },
    { id: 'tabs', name: 'Tab Navigation', icon: 'fa-folder' }
  ];

  navStyles = [
    { id: 'horizontal', name: 'Horizontal', icon: 'fa-arrows-alt-h' },
    { id: 'vertical', name: 'Vertical', icon: 'fa-arrows-alt-v' },
    { id: 'dropdown', name: 'Dropdown Menu', icon: 'fa-caret-down' },
    { id: 'mega-menu', name: 'Mega Menu', icon: 'fa-th-large' }
  ];

  menuItemTypes = [
    { id: 'link', name: 'Link', icon: 'fa-link' },
    { id: 'dropdown', name: 'Dropdown', icon: 'fa-caret-down' },
    { id: 'button', name: 'Button', icon: 'fa-square' },
    { id: 'divider', name: 'Divider', icon: 'fa-minus' },
    { id: 'search', name: 'Search', icon: 'fa-search' }
  ];

  @action
  updateNavConfig = (path, value) => {
    const keys = path.split('.');
    let current = this.navConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  };

  @action
  setActiveTab = (tab) => {
    this.activeTab = tab;
  };

  @action
  selectMenuItem = (index) => {
    this.selectedItemIndex = index;
  };

  @action
  addMenuItem = (type = 'link') => {
    const newItem = {
      id: `item_${Date.now()}`,
      label: `New ${type}`,
      url: '#',
      type,
      children: []
    };

    this.navConfig.menuItems.push(newItem);
    this.selectedItemIndex = this.navConfig.menuItems.length - 1;
  };

  @action
  removeMenuItem = (index) => {
    this.navConfig.menuItems.splice(index, 1);
    if (this.selectedItemIndex === index) {
      this.selectedItemIndex = -1;
    } else if (this.selectedItemIndex > index) {
      this.selectedItemIndex--;
    }
  };

  @action
  moveMenuItem = (fromIndex, toIndex) => {
    const item = this.navConfig.menuItems.splice(fromIndex, 1)[0];
    this.navConfig.menuItems.splice(toIndex, 0, item);
    this.selectedItemIndex = toIndex;
  };

  @action
  updateMenuItem = (index, property, value) => {
    this.navConfig.menuItems[index][property] = value;
  };

  @action
  addChildItem = (parentIndex) => {
    if (!this.navConfig.menuItems[parentIndex].children) {
      this.navConfig.menuItems[parentIndex].children = [];
    }

    const newChild = {
      id: `child_${Date.now()}`,
      label: 'New Child Item',
      url: '#',
      type: 'link'
    };

    this.navConfig.menuItems[parentIndex].children.push(newChild);
  };

  @action
  togglePreview = () => {
    this.isPreviewMode = !this.isPreviewMode;
  };

  @action
  toggleMobilePreview = () => {
    this.mobilePreview = !this.mobilePreview;
  };

  @action
  applyNavigation = () => {
    if (this.props.onNavApply) {
      this.props.onNavApply(this.navConfig);
    }
  };

  @action
  resetToDefault = () => {
    this.navConfig = {
      type: 'header',
      style: 'horizontal',
      position: 'fixed',
      theme: 'light',
      logo: {
        text: 'Your Logo',
        image: '',
        url: '/',
        alt: 'Company Logo'
      },
      menuItems: [
        { id: 'home', label: 'Home', url: '/', type: 'link', children: [] },
        { id: 'about', label: 'About', url: '/about', type: 'link', children: [] },
        { id: 'services', label: 'Services', url: '/services', type: 'dropdown', children: [
          { id: 'web-design', label: 'Web Design', url: '/services/web-design' },
          { id: 'development', label: 'Development', url: '/services/development' },
          { id: 'consulting', label: 'Consulting', url: '/services/consulting' }
        ]},
        { id: 'contact', label: 'Contact', url: '/contact', type: 'link', children: [] }
      ],
      ctaButton: {
        text: 'Get Started',
        url: '/signup',
        style: 'primary',
        visible: true
      },
      mobileMenu: {
        enabled: true,
        type: 'hamburger',
        animation: 'slide-down'
      },
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#212529',
        hoverColor: '#007bff',
        activeColor: '#0056b3',
        borderColor: '#e9ecef',
        fontSize: '16px',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    };
    this.selectedItemIndex = -1;
  };

  renderPreview() {
    const { type, style, position, theme, logo, menuItems, ctaButton, styling } = this.navConfig;

    const containerStyle = {
      position: position === 'fixed' ? 'fixed' : position === 'sticky' ? 'sticky' : 'relative',
      top: position === 'fixed' || position === 'sticky' ? 0 : 'auto',
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: styling.backgroundColor,
      color: styling.textColor,
      padding: styling.padding,
      boxShadow: styling.boxShadow,
      borderBottom: theme === 'transparent' ? 'none' : `1px solid ${styling.borderColor}`
    };

    if (this.mobilePreview) {
      containerStyle.maxWidth = '375px';
      containerStyle.margin = '0 auto';
    }

    return (
      <div className="nav-preview-container">
        <nav className={`nav-preview nav-${type} nav-${style}`} style={containerStyle}>
          <div className="nav-brand">
            {logo.image ? (
              <img src={logo.image} alt={logo.alt} style={{ height: '32px' }} />
            ) : (
              <span className="nav-logo-text" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {logo.text}
              </span>
            )}
          </div>

          <div className="nav-menu">
            {this.renderMenuItems(menuItems, style)}
          </div>

          {ctaButton.visible && (
            <div className="nav-cta">
              <a
                href={ctaButton.url}
                className={`cta-btn ${ctaButton.style}`}
                style={{
                  backgroundColor: ctaButton.style === 'primary' ? styling.hoverColor : 'transparent',
                  color: ctaButton.style === 'primary' ? '#ffffff' : styling.hoverColor,
                  border: `1px solid ${styling.hoverColor}`,
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                {ctaButton.text}
              </a>
            </div>
          )}

          {this.navConfig.mobileMenu.enabled && !this.mobilePreview && (
            <div className="nav-mobile-toggle">
              <button className="mobile-menu-btn">
                <i className="fa fa-bars" />
              </button>
            </div>
          )}
        </nav>
      </div>
    );
  }

  renderMenuItems(items, navStyle) {
    const { styling } = this.navConfig;

    return (
      <ul className={`nav-items nav-${navStyle}`} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '20px' }}>
        {items.map((item, index) => (
          <li key={item.id} className={`nav-item nav-item-${item.type}`}>
            {item.type === 'divider' ? (
              <div className="nav-divider" style={{ width: '1px', height: '20px', backgroundColor: styling.borderColor }} />
            ) : item.type === 'search' ? (
              <div className="nav-search">
                <input
                  type="text"
                  placeholder="Search..."
                  style={{
                    padding: '6px 12px',
                    border: `1px solid ${styling.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            ) : (
              <a
                href={item.url}
                className="nav-link"
                style={{
                  color: styling.textColor,
                  textDecoration: 'none',
                  fontSize: styling.fontSize,
                  fontWeight: styling.fontWeight,
                  padding: '8px 12px',
                  borderRadius: styling.borderRadius,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = styling.hoverColor;
                  e.target.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,123,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = styling.textColor;
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {item.label}
                {item.children && item.children.length > 0 && (
                  <i className="fa fa-caret-down" style={{ marginLeft: '6px' }} />
                )}
              </a>
            )}

            {item.children && item.children.length > 0 && (
              <ul className="nav-dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: styling.backgroundColor,
                border: `1px solid ${styling.borderColor}`,
                borderRadius: styling.borderRadius,
                boxShadow: styling.boxShadow,
                minWidth: '200px',
                listStyle: 'none',
                margin: 0,
                padding: '8px 0',
                display: 'none'
              }}>
                {item.children.map(child => (
                  <li key={child.id}>
                    <a
                      href={child.url}
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        color: styling.textColor,
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,123,255,0.1)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('navigation-builder', className)}>
        <div className="builder-header">
          <h2>Navigation Builder</h2>
          <div className="header-actions">
            <button className="action-btn" onClick={this.toggleMobilePreview}>
              <i className={`fa ${this.mobilePreview ? 'fa-desktop' : 'fa-mobile'}`} />
              {this.mobilePreview ? 'Desktop' : 'Mobile'}
            </button>
            <button className="action-btn" onClick={this.togglePreview}>
              <i className={`fa ${this.isPreviewMode ? 'fa-edit' : 'fa-eye'}`} />
              {this.isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button className="action-btn" onClick={this.resetToDefault}>
              <i className="fa fa-refresh" /> Reset
            </button>
            <button className="action-btn primary" onClick={this.applyNavigation}>
              <i className="fa fa-plus" /> Add Navigation
            </button>
          </div>
        </div>

        <div className="builder-content">
          <div className="builder-tabs">
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'structure' })}
              onClick={() => this.setActiveTab('structure')}
            >
              <i className="fa fa-sitemap" /> Structure
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'content' })}
              onClick={() => this.setActiveTab('content')}
            >
              <i className="fa fa-edit" /> Content
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'styling' })}
              onClick={() => this.setActiveTab('styling')}
            >
              <i className="fa fa-paint-brush" /> Styling
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'mobile' })}
              onClick={() => this.setActiveTab('mobile')}
            >
              <i className="fa fa-mobile" /> Mobile
            </button>
          </div>

          <div className="builder-panel">
            {this.activeTab === 'structure' && this.renderStructureTab()}
            {this.activeTab === 'content' && this.renderContentTab()}
            {this.activeTab === 'styling' && this.renderStylingTab()}
            {this.activeTab === 'mobile' && this.renderMobileTab()}
          </div>

          <div className="builder-preview">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <div className="preview-info">
                <span>Hover over menu items to see dropdowns</span>
              </div>
            </div>
            {this.renderPreview()}
          </div>
        </div>

        <style jsx>{`
          .navigation-builder {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .builder-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .builder-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .header-actions {
            display: flex;
            gap: 8px;
          }

          .action-btn {
            padding: 8px 16px;
            border: 1px solid #ced4da;
            background: white;
            color: #6c757d;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .action-btn:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
          }

          .action-btn.primary {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .action-btn.primary:hover {
            background: #0056b3;
          }

          .builder-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .builder-tabs {
            width: 200px;
            background: white;
            border-right: 1px solid #e9ecef;
            display: flex;
            flex-direction: column;
          }

          .tab-btn {
            padding: 16px 20px;
            border: none;
            background: none;
            text-align: left;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #6c757d;
            border-bottom: 1px solid #f8f9fa;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
          }

          .tab-btn.active {
            background: #007bff;
            color: white;
            border-bottom-color: #007bff;
          }

          .tab-btn:hover:not(.active) {
            background: #f8f9fa;
            color: #495057;
          }

          .builder-panel {
            width: 320px;
            background: white;
            border-right: 1px solid #e9ecef;
            overflow-y: auto;
            padding: 20px;
          }

          .builder-preview {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #f8f9fa;
          }

          .preview-header {
            padding: 16px 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .preview-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          }

          .preview-info {
            font-size: 12px;
            color: #6c757d;
          }

          .nav-preview-container {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          .nav-preview {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .nav-brand {
            font-size: 20px;
            font-weight: bold;
          }

          .nav-menu {
            flex: 1;
            display: flex;
            justify-content: center;
          }

          .nav-horizontal .nav-items {
            flex-direction: row !important;
          }

          .nav-vertical .nav-items {
            flex-direction: column !important;
          }

          .nav-cta {
            margin-left: 20px;
          }

          .nav-mobile-toggle {
            display: none;
          }

          .option-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }

          .option-card {
            padding: 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s;
          }

          .option-card:hover {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .option-card.selected {
            border-color: #007bff;
            background: #e7f3ff;
          }

          .option-icon {
            font-size: 24px;
            color: #6c757d;
            margin-bottom: 8px;
          }

          .option-name {
            font-size: 14px;
            font-weight: 500;
            margin: 0;
          }

          .menu-items-list {
            margin-bottom: 20px;
          }

          .menu-item-card {
            display: flex;
            align-items: center;
            padding: 12px;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            margin-bottom: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
          }

          .menu-item-card.selected {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .menu-item-icon {
            width: 32px;
            height: 32px;
            background: #007bff;
            color: white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
          }

          .menu-item-info {
            flex: 1;
          }

          .menu-item-label {
            font-weight: 500;
            margin-bottom: 2px;
          }

          .menu-item-type {
            font-size: 12px;
            color: #6c757d;
          }

          .menu-item-actions {
            display: flex;
            gap: 4px;
          }

          .menu-item-action {
            padding: 6px;
            border: none;
            background: none;
            color: #6c757d;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .menu-item-action:hover {
            background: #e9ecef;
            color: #495057;
          }

          .menu-item-action.danger:hover {
            background: #f8d7da;
            color: #721c24;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            margin-bottom: 4px;
            font-size: 12px;
            font-weight: 500;
            color: #495057;
            text-transform: uppercase;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .form-group textarea {
            resize: vertical;
            min-height: 80px;
          }

          .color-input {
            width: 50px;
            height: 40px;
            border: 2px solid #e9ecef;
            border-radius: 4px;
            cursor: pointer;
          }

          .color-input::-webkit-color-swatch-wrapper {
            padding: 0;
          }

          .color-input::-webkit-color-swatch {
            border: none;
            border-radius: 2px;
          }

          .children-list {
            margin-left: 20px;
            margin-top: 8px;
          }

          .child-item {
            display: flex;
            align-items: center;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            margin-bottom: 4px;
          }

          .child-label {
            flex: 1;
            font-size: 14px;
          }

          .child-actions {
            display: flex;
            gap: 4px;
          }

          @media (max-width: 1200px) {
            .builder-content {
              flex-direction: column;
            }

            .builder-tabs, .builder-panel {
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #e9ecef;
            }

            .builder-tabs {
              flex-direction: row;
              overflow-x: auto;
            }

            .tab-btn {
              flex: 1;
              min-width: 120px;
              justify-content: center;
              border-bottom: none;
              border-right: 1px solid #f8f9fa;
            }

            .option-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        `}</style>
      </div>
    );
  }

  renderStructureTab() {
    return (
      <div className="structure-tab">
        <div className="form-group">
          <label>Navigation Type</label>
          <div className="option-grid">
            {this.navTypes.map(type => (
              <div
                key={type.id}
                className={classnames('option-card', {
                  selected: this.navConfig.type === type.id
                })}
                onClick={() => this.updateNavConfig('type', type.id)}
              >
                <div className="option-icon">
                  <i className={`fa ${type.icon}`} />
                </div>
                <p className="option-name">{type.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Navigation Style</label>
          <div className="option-grid">
            {this.navStyles.map(style => (
              <div
                key={style.id}
                className={classnames('option-card', {
                  selected: this.navConfig.style === style.id
                })}
                onClick={() => this.updateNavConfig('style', style.id)}
              >
                <div className="option-icon">
                  <i className={`fa ${style.icon}`} />
                </div>
                <p className="option-name">{style.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Position</label>
          <select
            value={this.navConfig.position}
            onChange={(e) => this.updateNavConfig('position', e.target.value)}
          >
            <option value="static">Static</option>
            <option value="fixed">Fixed</option>
            <option value="sticky">Sticky</option>
            <option value="absolute">Absolute</option>
          </select>
        </div>

        <div className="form-group">
          <label>Theme</label>
          <select
            value={this.navConfig.theme}
            onChange={(e) => this.updateNavConfig('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="transparent">Transparent</option>
          </select>
        </div>
      </div>
    );
  }

  renderContentTab() {
    return (
      <div className="content-tab">
        <div className="form-group">
          <label>Logo</label>
          <div className="form-row">
            <input
              type="text"
              placeholder="Logo text"
              value={this.navConfig.logo.text}
              onChange={(e) => this.updateNavConfig('logo.text', e.target.value)}
            />
            <input
              type="url"
              placeholder="Logo image URL"
              value={this.navConfig.logo.image}
              onChange={(e) => this.updateNavConfig('logo.image', e.target.value)}
            />
          </div>
          <input
            type="url"
            placeholder="Logo link URL"
            value={this.navConfig.logo.url}
            onChange={(e) => this.updateNavConfig('logo.url', e.target.value)}
          />
        </div>

        <div className="menu-items-section">
          <div className="section-header">
            <h4>Menu Items</h4>
            <button className="add-item-btn" onClick={() => this.addMenuItem()}>
              <i className="fa fa-plus" /> Add Item
            </button>
          </div>

          <div className="menu-items-list">
            {this.navConfig.menuItems.map((item, index) => (
              <div
                key={item.id}
                className={classnames('menu-item-card', {
                  selected: this.selectedItemIndex === index
                })}
                onClick={() => this.selectMenuItem(index)}
              >
                <div className="menu-item-icon">
                  <i className={`fa ${this.menuItemTypes.find(t => t.id === item.type)?.icon}`} />
                </div>
                <div className="menu-item-info">
                  <div className="menu-item-label">{item.label}</div>
                  <div className="menu-item-type">{item.type}</div>
                </div>
                <div className="menu-item-actions">
                  <button
                    className="menu-item-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.moveMenuItem(index, Math.max(0, index - 1));
                    }}
                    disabled={index === 0}
                  >
                    <i className="fa fa-arrow-up" />
                  </button>
                  <button
                    className="menu-item-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.moveMenuItem(index, Math.min(this.navConfig.menuItems.length - 1, index + 1));
                    }}
                    disabled={index === this.navConfig.menuItems.length - 1}
                  >
                    <i className="fa fa-arrow-down" />
                  </button>
                  <button
                    className="menu-item-action danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.removeMenuItem(index);
                    }}
                  >
                    <i className="fa fa-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {this.selectedItemIndex >= 0 && (
          <div className="item-editor">
            <h4>Edit Menu Item</h4>
            {this.renderItemEditor()}
          </div>
        )}

        <div className="cta-section">
          <h4>Call-to-Action Button</h4>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={this.navConfig.ctaButton.visible}
                onChange={(e) => this.updateNavConfig('ctaButton.visible', e.target.checked)}
              />
              Show CTA Button
            </label>
          </div>

          {this.navConfig.ctaButton.visible && (
            <>
              <div className="form-group">
                <label>Button Text</label>
                <input
                  type="text"
                  value={this.navConfig.ctaButton.text}
                  onChange={(e) => this.updateNavConfig('ctaButton.text', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Button URL</label>
                <input
                  type="url"
                  value={this.navConfig.ctaButton.url}
                  onChange={(e) => this.updateNavConfig('ctaButton.url', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Button Style</label>
                <select
                  value={this.navConfig.ctaButton.style}
                  onChange={(e) => this.updateNavConfig('ctaButton.style', e.target.value)}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  renderItemEditor() {
    const item = this.navConfig.menuItems[this.selectedItemIndex];
    if (!item) return null;

    return (
      <div className="item-editor-content">
        <div className="form-group">
          <label>Label</label>
          <input
            type="text"
            value={item.label}
            onChange={(e) => this.updateMenuItem(this.selectedItemIndex, 'label', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>URL</label>
          <input
            type="url"
            value={item.url}
            onChange={(e) => this.updateMenuItem(this.selectedItemIndex, 'url', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            value={item.type}
            onChange={(e) => this.updateMenuItem(this.selectedItemIndex, 'type', e.target.value)}
          >
            {this.menuItemTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {(item.type === 'dropdown' || item.type === 'button') && (
          <div className="children-section">
            <div className="section-header">
              <h5>Dropdown Items</h5>
              <button
                className="add-child-btn"
                onClick={() => this.addChildItem(this.selectedItemIndex)}
              >
                <i className="fa fa-plus" /> Add Child
              </button>
            </div>

            <div className="children-list">
              {item.children?.map((child, childIndex) => (
                <div key={child.id} className="child-item">
                  <span className="child-label">{child.label}</span>
                  <div className="child-actions">
                    <button
                      className="child-action"
                      onClick={() => {
                        const newChildren = [...item.children];
                        newChildren.splice(childIndex, 1);
                        this.updateMenuItem(this.selectedItemIndex, 'children', newChildren);
                      }}
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  renderStylingTab() {
    return (
      <div className="styling-tab">
        <div className="form-group">
          <label>Background Color</label>
          <div className="color-row">
            <input
              type="color"
              className="color-input"
              value={this.navConfig.styling.backgroundColor}
              onChange={(e) => this.updateNavConfig('styling.backgroundColor', e.target.value)}
            />
            <input
              type="text"
              value={this.navConfig.styling.backgroundColor}
              onChange={(e) => this.updateNavConfig('styling.backgroundColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Text Color</label>
          <div className="color-row">
            <input
              type="color"
              className="color-input"
              value={this.navConfig.styling.textColor}
              onChange={(e) => this.updateNavConfig('styling.textColor', e.target.value)}
            />
            <input
              type="text"
              value={this.navConfig.styling.textColor}
              onChange={(e) => this.updateNavConfig('styling.textColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Hover Color</label>
          <div className="color-row">
            <input
              type="color"
              className="color-input"
              value={this.navConfig.styling.hoverColor}
              onChange={(e) => this.updateNavConfig('styling.hoverColor', e.target.value)}
            />
            <input
              type="text"
              value={this.navConfig.styling.hoverColor}
              onChange={(e) => this.updateNavConfig('styling.hoverColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Border Color</label>
          <div className="color-row">
            <input
              type="color"
              className="color-input"
              value={this.navConfig.styling.borderColor}
              onChange={(e) => this.updateNavConfig('styling.borderColor', e.target.value)}
            />
            <input
              type="text"
              value={this.navConfig.styling.borderColor}
              onChange={(e) => this.updateNavConfig('styling.borderColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Font Size</label>
          <input
            type="text"
            value={this.navConfig.styling.fontSize}
            onChange={(e) => this.updateNavConfig('styling.fontSize', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Font Weight</label>
          <select
            value={this.navConfig.styling.fontWeight}
            onChange={(e) => this.updateNavConfig('styling.fontWeight', e.target.value)}
          >
            <option value="300">Light</option>
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
          </select>
        </div>

        <div className="form-group">
          <label>Padding</label>
          <input
            type="text"
            value={this.navConfig.styling.padding}
            onChange={(e) => this.updateNavConfig('styling.padding', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Border Radius</label>
          <input
            type="text"
            value={this.navConfig.styling.borderRadius}
            onChange={(e) => this.updateNavConfig('styling.borderRadius', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Box Shadow</label>
          <input
            type="text"
            value={this.navConfig.styling.boxShadow}
            onChange={(e) => this.updateNavConfig('styling.boxShadow', e.target.value)}
          />
        </div>
      </div>
    );
  }

  renderMobileTab() {
    return (
      <div className="mobile-tab">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={this.navConfig.mobileMenu.enabled}
              onChange={(e) => this.updateNavConfig('mobileMenu.enabled', e.target.checked)}
            />
            Enable Mobile Menu
          </label>
        </div>

        {this.navConfig.mobileMenu.enabled && (
          <>
            <div className="form-group">
              <label>Mobile Menu Type</label>
              <select
                value={this.navConfig.mobileMenu.type}
                onChange={(e) => this.updateNavConfig('mobileMenu.type', e.target.value)}
              >
                <option value="hamburger">Hamburger Menu</option>
                <option value="slide-out">Slide Out Menu</option>
                <option value="full-screen">Full Screen Menu</option>
              </select>
            </div>

            <div className="form-group">
              <label>Animation</label>
              <select
                value={this.navConfig.mobileMenu.animation}
                onChange={(e) => this.updateNavConfig('mobileMenu.animation', e.target.value)}
              >
                <option value="slide-down">Slide Down</option>
                <option value="slide-up">Slide Up</option>
                <option value="fade-in">Fade In</option>
                <option value="slide-left">Slide Left</option>
                <option value="slide-right">Slide Right</option>
              </select>
            </div>
          </>
        )}
      </div>
    );
  }
}

NavigationBuilder.propTypes = {
  onNavApply: PropTypes.func,
  className: PropTypes.string
};