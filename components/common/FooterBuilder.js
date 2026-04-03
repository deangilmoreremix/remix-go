import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class FooterBuilder extends Component {
  @observable
  footerConfig = {
    layout: 'multi-column', // single-column, multi-column, minimal
    style: 'standard', // standard, centered, minimal
    theme: 'dark', // light, dark, custom
    backgroundColor: '#212529',
    textColor: '#ffffff',
    linkColor: '#ffffff',
    borderColor: '#495057',
    sections: [
      {
        id: 'links',
        title: 'Quick Links',
        type: 'links',
        content: [
          { label: 'Home', url: '/' },
          { label: 'About', url: '/about' },
          { label: 'Services', url: '/services' },
          { label: 'Contact', url: '/contact' }
        ]
      },
      {
        id: 'services',
        title: 'Services',
        type: 'links',
        content: [
          { label: 'Web Design', url: '/services/web-design' },
          { label: 'Development', url: '/services/development' },
          { label: 'Consulting', url: '/services/consulting' },
          { label: 'Support', url: '/services/support' }
        ]
      },
      {
        id: 'contact',
        title: 'Contact Info',
        type: 'contact',
        content: {
          address: '123 Business St, City, State 12345',
          phone: '+1 (555) 123-4567',
          email: 'hello@company.com'
        }
      },
      {
        id: 'social',
        title: 'Follow Us',
        type: 'social',
        content: [
          { platform: 'facebook', url: 'https://facebook.com/company', icon: 'fa-facebook' },
          { platform: 'twitter', url: 'https://twitter.com/company', icon: 'fa-twitter' },
          { platform: 'linkedin', url: 'https://linkedin.com/company', icon: 'fa-linkedin' },
          { platform: 'instagram', url: 'https://instagram.com/company', icon: 'fa-instagram' }
        ]
      }
    ],
    bottomBar: {
      copyright: '© 2024 Company Name. All rights reserved.',
      links: [
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Cookie Policy', url: '/cookies' }
      ]
    },
    styling: {
      padding: '60px 20px 20px 20px',
      margin: '40px 0 0 0',
      borderRadius: '0',
      fontSize: '14px',
      lineHeight: '1.6'
    }
  };

  @observable
  activeTab = 'layout';

  @observable
  selectedSectionIndex = -1;

  @observable
  isPreviewMode = true;

  footerLayouts = [
    { id: 'single-column', name: 'Single Column', icon: 'fa-square' },
    { id: 'multi-column', name: 'Multi Column', icon: 'fa-th' },
    { id: 'minimal', name: 'Minimal', icon: 'fa-minus' }
  ];

  footerStyles = [
    { id: 'standard', name: 'Standard', icon: 'fa-align-left' },
    { id: 'centered', name: 'Centered', icon: 'fa-align-center' },
    { id: 'minimal', name: 'Minimal', icon: 'fa-minus' }
  ];

  sectionTypes = [
    { id: 'links', name: 'Link List', icon: 'fa-link' },
    { id: 'contact', name: 'Contact Info', icon: 'fa-address-card' },
    { id: 'social', name: 'Social Media', icon: 'fa-share-alt' },
    { id: 'text', name: 'Text Block', icon: 'fa-font' },
    { id: 'newsletter', name: 'Newsletter', icon: 'fa-envelope' }
  ];

  socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: 'fa-facebook', color: '#1877f2' },
    { id: 'twitter', name: 'Twitter', icon: 'fa-twitter', color: '#1da1f2' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'fa-linkedin', color: '#0077b5' },
    { id: 'instagram', name: 'Instagram', icon: 'fa-instagram', color: '#e4405f' },
    { id: 'youtube', name: 'YouTube', icon: 'fa-youtube', color: '#ff0000' },
    { id: 'github', name: 'GitHub', icon: 'fa-github', color: '#333333' }
  ];

  @action
  updateFooterConfig = (path, value) => {
    const keys = path.split('.');
    let current = this.footerConfig;

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
  selectSection = (index) => {
    this.selectedSectionIndex = index;
  };

  @action
  addSection = (type = 'links') => {
    const newSection = {
      id: `section_${Date.now()}`,
      title: `New ${type} Section`,
      type,
      content: this.getDefaultContent(type)
    };

    this.footerConfig.sections.push(newSection);
    this.selectedSectionIndex = this.footerConfig.sections.length - 1;
  };

  @action
  removeSection = (index) => {
    this.footerConfig.sections.splice(index, 1);
    if (this.selectedSectionIndex === index) {
      this.selectedSectionIndex = -1;
    } else if (this.selectedSectionIndex > index) {
      this.selectedSectionIndex--;
    }
  };

  @action
  moveSection = (fromIndex, toIndex) => {
    const section = this.footerConfig.sections.splice(fromIndex, 1)[0];
    this.footerConfig.sections.splice(toIndex, 0, section);
    this.selectedSectionIndex = toIndex;
  };

  @action
  updateSection = (index, property, value) => {
    this.footerConfig.sections[index][property] = value;
  };

  @action
  updateSectionContent = (sectionIndex, contentPath, value) => {
    const section = this.footerConfig.sections[sectionIndex];
    if (contentPath.includes('.')) {
      const [parent, child] = contentPath.split('.');
      if (!section.content[parent]) section.content[parent] = {};
      section.content[parent][child] = value;
    } else {
      section.content[contentPath] = value;
    }
  };

  getDefaultContent = (type) => {
    switch (type) {
      case 'links':
        return [{ label: 'Link 1', url: '#' }, { label: 'Link 2', url: '#' }];
      case 'contact':
        return {
          address: '123 Business St, City, State 12345',
          phone: '+1 (555) 123-4567',
          email: 'hello@company.com'
        };
      case 'social':
        return [{ platform: 'facebook', url: '#', icon: 'fa-facebook' }];
      case 'text':
        return 'Your custom text content goes here.';
      case 'newsletter':
        return {
          title: 'Subscribe to our newsletter',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe'
        };
      default:
        return {};
    }
  };

  @action
  togglePreview = () => {
    this.isPreviewMode = !this.isPreviewMode;
  };

  @action
  applyFooter = () => {
    if (this.props.onFooterApply) {
      this.props.onFooterApply(this.footerConfig);
    }
  };

  @action
  resetToDefault = () => {
    this.footerConfig = {
      layout: 'multi-column',
      style: 'standard',
      theme: 'dark',
      backgroundColor: '#212529',
      textColor: '#ffffff',
      linkColor: '#ffffff',
      borderColor: '#495057',
      sections: [
        {
          id: 'links',
          title: 'Quick Links',
          type: 'links',
          content: [
            { label: 'Home', url: '/' },
            { label: 'About', url: '/about' },
            { label: 'Services', url: '/services' },
            { label: 'Contact', url: '/contact' }
          ]
        },
        {
          id: 'services',
          title: 'Services',
          type: 'links',
          content: [
            { label: 'Web Design', url: '/services/web-design' },
            { label: 'Development', url: '/services/development' },
            { label: 'Consulting', url: '/services/consulting' },
            { label: 'Support', url: '/services/support' }
          ]
        },
        {
          id: 'contact',
          title: 'Contact Info',
          type: 'contact',
          content: {
            address: '123 Business St, City, State 12345',
            phone: '+1 (555) 123-4567',
            email: 'hello@company.com'
          }
        },
        {
          id: 'social',
          title: 'Follow Us',
          type: 'social',
          content: [
            { platform: 'facebook', url: 'https://facebook.com/company', icon: 'fa-facebook' },
            { platform: 'twitter', url: 'https://twitter.com/company', icon: 'fa-twitter' },
            { platform: 'linkedin', url: 'https://linkedin.com/company', icon: 'fa-linkedin' },
            { platform: 'instagram', url: 'https://instagram.com/company', icon: 'fa-instagram' }
          ]
        }
      ],
      bottomBar: {
        copyright: '© 2024 Company Name. All rights reserved.',
        links: [
          { label: 'Privacy Policy', url: '/privacy' },
          { label: 'Terms of Service', url: '/terms' },
          { label: 'Cookie Policy', url: '/cookies' }
        ]
      },
      styling: {
        padding: '60px 20px 20px 20px',
        margin: '40px 0 0 0',
        borderRadius: '0',
        fontSize: '14px',
        lineHeight: '1.6'
      }
    };
    this.selectedSectionIndex = -1;
  };

  renderPreview() {
    const { layout, style, theme, sections, bottomBar, styling } = this.footerConfig;

    const footerStyle = {
      backgroundColor: this.footerConfig.backgroundColor,
      color: this.footerConfig.textColor,
      padding: styling.padding,
      margin: styling.margin,
      borderRadius: styling.borderRadius,
      fontSize: styling.fontSize,
      lineHeight: styling.lineHeight,
      borderTop: theme !== 'transparent' ? `1px solid ${this.footerConfig.borderColor}` : 'none'
    };

    return (
      <div className="footer-preview-container">
        <footer className={`footer-preview footer-${layout} footer-${style}`} style={footerStyle}>
          <div className="footer-content">
            {layout === 'single-column' ? (
              <div className="footer-single">
                {sections.map(section => (
                  <div key={section.id} className="footer-section">
                    {this.renderSection(section)}
                  </div>
                ))}
              </div>
            ) : layout === 'multi-column' ? (
              <div className="footer-columns">
                {sections.map(section => (
                  <div key={section.id} className="footer-column">
                    {this.renderSection(section)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="footer-minimal">
                {this.renderSection(sections[0])}
              </div>
            )}
          </div>

          <div className="footer-bottom" style={{
            borderTop: `1px solid ${this.footerConfig.borderColor}`,
            padding: '20px 0',
            margin: '20px 0 0 0'
          }}>
            <div className="footer-copyright">
              {bottomBar.copyright}
            </div>
            <div className="footer-links">
              {bottomBar.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  style={{
                    color: this.footerConfig.linkColor,
                    textDecoration: 'none',
                    marginLeft: index > 0 ? '20px' : '0'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  renderSection(section) {
    const { title, type, content } = section;

    return (
      <div className={`footer-section section-${type}`}>
        {title && (
          <h4 style={{
            color: this.footerConfig.textColor,
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {title}
          </h4>
        )}

        {this.renderSectionContent(type, content)}
      </div>
    );
  }

  renderSectionContent(type, content) {
    const linkStyle = {
      color: this.footerConfig.linkColor,
      textDecoration: 'none',
      display: 'block',
      marginBottom: '8px'
    };

    switch (type) {
      case 'links':
        return (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {content.map((link, index) => (
              <li key={index}>
                <a href={link.url} style={linkStyle}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        );

      case 'contact':
        return (
          <div className="contact-info">
            {content.address && (
              <div style={{ marginBottom: '8px', color: this.footerConfig.textColor }}>
                <i className="fa fa-map-marker" style={{ marginRight: '8px' }} />
                {content.address}
              </div>
            )}
            {content.phone && (
              <div style={{ marginBottom: '8px', color: this.footerConfig.textColor }}>
                <i className="fa fa-phone" style={{ marginRight: '8px' }} />
                <a href={`tel:${content.phone}`} style={linkStyle}>
                  {content.phone}
                </a>
              </div>
            )}
            {content.email && (
              <div style={{ color: this.footerConfig.textColor }}>
                <i className="fa fa-envelope" style={{ marginRight: '8px' }} />
                <a href={`mailto:${content.email}`} style={linkStyle}>
                  {content.email}
                </a>
              </div>
            )}
          </div>
        );

      case 'social':
        return (
          <div className="social-links">
            {content.map((social, index) => (
              <a
                key={index}
                href={social.url}
                style={{
                  color: this.footerConfig.linkColor,
                  textDecoration: 'none',
                  fontSize: '18px',
                  marginRight: '12px',
                  display: 'inline-block'
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={`fa ${social.icon}`} />
              </a>
            ))}
          </div>
        );

      case 'text':
        return (
          <div style={{ color: this.footerConfig.textColor }}>
            {content}
          </div>
        );

      case 'newsletter':
        return (
          <div className="newsletter-signup">
            {content.title && (
              <p style={{ margin: '0 0 12px 0', color: this.footerConfig.textColor }}>
                {content.title}
              </p>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder={content.placeholder}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: `1px solid ${this.footerConfig.borderColor}`,
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: this.footerConfig.textColor
                }}
              />
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: this.footerConfig.linkColor,
                  color: this.footerConfig.backgroundColor,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {content.buttonText}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('footer-builder', className)}>
        <div className="builder-header">
          <h2>Footer Builder</h2>
          <div className="header-actions">
            <button className="action-btn" onClick={this.togglePreview}>
              <i className={`fa ${this.isPreviewMode ? 'fa-edit' : 'fa-eye'}`} />
              {this.isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button className="action-btn" onClick={this.resetToDefault}>
              <i className="fa fa-refresh" /> Reset
            </button>
            <button className="action-btn primary" onClick={this.applyFooter}>
              <i className="fa fa-plus" /> Add Footer
            </button>
          </div>
        </div>

        <div className="builder-content">
          <div className="builder-tabs">
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'layout' })}
              onClick={() => this.setActiveTab('layout')}
            >
              <i className="fa fa-th" /> Layout
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
          </div>

          <div className="builder-panel">
            {this.activeTab === 'layout' && this.renderLayoutTab()}
            {this.activeTab === 'content' && this.renderContentTab()}
            {this.activeTab === 'styling' && this.renderStylingTab()}
          </div>

          <div className="builder-preview">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <div className="preview-info">
                <span>Footer preview with responsive design</span>
              </div>
            </div>
            {this.renderPreview()}
          </div>
        </div>

        <style jsx>{`
          .footer-builder {
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

          .footer-preview-container {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          .footer-preview {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .footer-content {
            padding: 0 20px;
          }

          .footer-single {
            display: flex;
            flex-direction: column;
            gap: 32px;
          }

          .footer-columns {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 32px;
          }

          .footer-minimal {
            text-align: center;
          }

          .footer-section {
            margin-bottom: 24px;
          }

          .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }

          .footer-copyright {
            font-size: 12px;
            opacity: 0.8;
          }

          .footer-links {
            display: flex;
            gap: 16px;
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

          .sections-list {
            margin-bottom: 20px;
          }

          .section-item {
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

          .section-item.selected {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .section-icon {
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

          .section-info {
            flex: 1;
          }

          .section-title {
            font-weight: 500;
            margin-bottom: 2px;
          }

          .section-type {
            font-size: 12px;
            color: #6c757d;
          }

          .section-actions {
            display: flex;
            gap: 4px;
          }

          .section-action {
            padding: 6px;
            border: none;
            background: none;
            color: #6c757d;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .section-action:hover {
            background: #e9ecef;
            color: #495057;
          }

          .section-action.danger:hover {
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

          .links-editor {
            margin-top: 12px;
          }

          .link-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          }

          .link-input {
            flex: 1;
          }

          .remove-link {
            padding: 4px 8px;
            border: none;
            background: #dc3545;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          }

          .social-editor {
            margin-top: 12px;
          }

          .social-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          }

          .social-select {
            width: 120px;
          }

          .social-url {
            flex: 1;
          }

          .remove-social {
            padding: 4px 8px;
            border: none;
            background: #dc3545;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          }

          .add-btn {
            padding: 8px 12px;
            border: 1px solid #007bff;
            background: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
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

            .footer-columns {
              grid-template-columns: 1fr;
              gap: 24px;
            }

            .footer-bottom {
              flex-direction: column;
              align-items: stretch;
              text-align: center;
            }
          }
        `}</style>
      </div>
    );
  }

  renderLayoutTab() {
    return (
      <div className="layout-tab">
        <div className="form-group">
          <label>Layout Type</label>
          <div className="option-grid">
            {this.footerLayouts.map(layout => (
              <div
                key={layout.id}
                className={classnames('option-card', {
                  selected: this.footerConfig.layout === layout.id
                })}
                onClick={() => this.updateFooterConfig('layout', layout.id)}
              >
                <div className="option-icon">
                  <i className={`fa ${layout.icon}`} />
                </div>
                <p className="option-name">{layout.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Footer Style</label>
          <div className="option-grid">
            {this.footerStyles.map(style => (
              <div
                key={style.id}
                className={classnames('option-card', {
                  selected: this.footerConfig.style === style.id
                })}
                onClick={() => this.updateFooterConfig('style', style.id)}
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
          <label>Theme</label>
          <select
            value={this.footerConfig.theme}
            onChange={(e) => this.updateFooterConfig('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
    );
  }

  renderContentTab() {
    return (
      <div className="content-tab">
        <div className="sections-section">
          <div className="section-header">
            <h4>Footer Sections</h4>
            <button className="add-btn" onClick={() => this.addSection()}>
              <i className="fa fa-plus" /> Add Section
            </button>
          </div>

          <div className="sections-list">
            {this.footerConfig.sections.map((section, index) => (
              <div
                key={section.id}
                className={classnames('section-item', {
                  selected: this.selectedSectionIndex === index
                })}
                onClick={() => this.selectSection(index)}
              >
                <div className="section-icon">
                  <i className={`fa ${this.sectionTypes.find(t => t.id === section.type)?.icon}`} />
                </div>
                <div className="section-info">
                  <div className="section-title">{section.title}</div>
                  <div className="section-type">{section.type}</div>
                </div>
                <div className="section-actions">
                  <button
                    className="section-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.moveSection(index, Math.max(0, index - 1));
                    }}
                    disabled={index === 0}
                  >
                    <i className="fa fa-arrow-up" />
                  </button>
                  <button
                    className="section-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.moveSection(index, Math.min(this.footerConfig.sections.length - 1, index + 1));
                    }}
                    disabled={index === this.footerConfig.sections.length - 1}
                  >
                    <i className="fa fa-arrow-down" />
                  </button>
                  <button
                    className="section-action danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.removeSection(index);
                    }}
                  >
                    <i className="fa fa-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {this.selectedSectionIndex >= 0 && (
          <div className="section-editor">
            <h4>Edit Section</h4>
            {this.renderSectionEditor()}
          </div>
        )}

        <div className="bottom-bar-section">
          <h4>Bottom Bar</h4>
          <div className="form-group">
            <label>Copyright Text</label>
            <input
              type="text"
              value={this.footerConfig.bottomBar.copyright}
              onChange={(e) => this.updateFooterConfig('bottomBar.copyright', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Legal Links</label>
            <div className="links-editor">
              {this.footerConfig.bottomBar.links.map((link, index) => (
                <div key={index} className="link-item">
                  <input
                    type="text"
                    className="link-input"
                    placeholder="Link label"
                    value={link.label}
                    onChange={(e) => {
                      const newLinks = [...this.footerConfig.bottomBar.links];
                      newLinks[index].label = e.target.value;
                      this.updateFooterConfig('bottomBar.links', newLinks);
                    }}
                  />
                  <input
                    type="url"
                    className="link-input"
                    placeholder="Link URL"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...this.footerConfig.bottomBar.links];
                      newLinks[index].url = e.target.value;
                      this.updateFooterConfig('bottomBar.links', newLinks);
                    }}
                  />
                  <button
                    className="remove-link"
                    onClick={() => {
                      const newLinks = this.footerConfig.bottomBar.links.filter((_, i) => i !== index);
                      this.updateFooterConfig('bottomBar.links', newLinks);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-btn"
                onClick={() => {
                  const newLinks = [...this.footerConfig.bottomBar.links, { label: 'New Link', url: '#' }];
                  this.updateFooterConfig('bottomBar.links', newLinks);
                }}
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderSectionEditor() {
    const section = this.footerConfig.sections[this.selectedSectionIndex];
    if (!section) return null;

    return (
      <div className="section-editor-content">
        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => this.updateSection(this.selectedSectionIndex, 'title', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Section Type</label>
          <select
            value={section.type}
            onChange={(e) => {
              const newType = e.target.value;
              this.updateSection(this.selectedSectionIndex, 'type', newType);
              this.updateSection(this.selectedSectionIndex, 'content', this.getDefaultContent(newType));
            }}
          >
            {this.sectionTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {section.type === 'links' && (
          <div className="links-editor">
            <label>Links</label>
            {section.content.map((link, index) => (
              <div key={index} className="link-item">
                <input
                  type="text"
                  className="link-input"
                  placeholder="Link label"
                  value={link.label}
                  onChange={(e) => {
                    const newContent = [...section.content];
                    newContent[index].label = e.target.value;
                    this.updateSection(this.selectedSectionIndex, 'content', newContent);
                  }}
                />
                <input
                  type="url"
                  className="link-input"
                  placeholder="Link URL"
                  value={link.url}
                  onChange={(e) => {
                    const newContent = [...section.content];
                    newContent[index].url = e.target.value;
                    this.updateSection(this.selectedSectionIndex, 'content', newContent);
                  }}
                />
                <button
                  className="remove-link"
                  onClick={() => {
                    const newContent = section.content.filter((_, i) => i !== index);
                    this.updateSection(this.selectedSectionIndex, 'content', newContent);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="add-btn"
              onClick={() => {
                const newContent = [...section.content, { label: 'New Link', url: '#' }];
                this.updateSection(this.selectedSectionIndex, 'content', newContent);
              }}
            >
              Add Link
            </button>
          </div>
        )}

        {section.type === 'contact' && (
          <div className="contact-editor">
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={section.content.address}
                onChange={(e) => this.updateSectionContent(this.selectedSectionIndex, 'address', e.target.value)}
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={section.content.phone}
                onChange={(e) => this.updateSectionContent(this.selectedSectionIndex, 'phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={section.content.email}
                onChange={(e) => this.updateSectionContent(this.selectedSectionIndex, 'email', e.target.value)}
              />
            </div>
          </div>
        )}

        {section.type === 'social' && (
          <div className="social-editor">
            <label>Social Links</label>
            {section.content.map((social, index) => (
              <div key={index} className="social-item">
                <select
                  className="social-select"
                  value={social.platform}
                  onChange={(e) => {
                    const newContent = [...section.content];
                    newContent[index].platform = e.target.value;
                    newContent[index].icon = this.socialPlatforms.find(p => p.id === e.target.value)?.icon || 'fa-link';
                    this.updateSection(this.selectedSectionIndex, 'content', newContent);
                  }}
                >
                  {this.socialPlatforms.map(platform => (
                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                  ))}
                </select>
                <input
                  type="url"
                  className="social-url"
                  placeholder="Profile URL"
                  value={social.url}
                  onChange={(e) => {
                    const newContent = [...section.content];
                    newContent[index].url = e.target.value;
                    this.updateSection(this.selectedSectionIndex, 'content', newContent);
                  }}
                />
                <button
                  className="remove-social"
                  onClick={() => {
                    const newContent = section.content.filter((_, i) => i !== index);
                    this.updateSection(this.selectedSectionIndex, 'content', newContent);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="add-btn"
              onClick={() => {
                const newContent = [...section.content, { platform: 'facebook', url: '#', icon: 'fa-facebook' }];
                this.updateSection(this.selectedSectionIndex, 'content', newContent);
              }}
            >
              Add Social Link
            </button>
          </div>
        )}

        {section.type === 'text' && (
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={section.content}
              onChange={(e) => this.updateSection(this.selectedSectionIndex, 'content', e.target.value)}
              rows={4}
            />
          </div>
        )}

        {section.type === 'newsletter' && (
          <div className="newsletter-editor">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={section.content.title}
                onChange={(e) => this.updateSectionContent(this.selectedSectionIndex, 'title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Placeholder</label>
              <input
                type="text"
                value={section.content.placeholder}
                onChange={(e) => this.updateSectionContent(this.selectedSectionIndex, 'placeholder', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Button Text</label>
              <input
                type="text"
                value={section.content.buttonText}
                onChange={(e) => this.updateSectionContent(this.selectedSectionIndex, 'buttonText', e.target.value)}
              />
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
              value={this.footerConfig.backgroundColor}
              onChange={(e) => this.updateFooterConfig('backgroundColor', e.target.value)}
            />
            <input
              type="text"
              value={this.footerConfig.backgroundColor}
              onChange={(e) => this.updateFooterConfig('backgroundColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Text Color</label>
          <div className="color-row">
            <input
              type="color"
              className="color-input"
              value={this.footerConfig.textColor}
              onChange={(e) => this.updateFooterConfig('textColor', e.target.value)}
            />
            <input
              type="text"
              value={this.footerConfig.textColor}
              onChange={(e) => this.updateFooterConfig('textColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Link Color</label>
          <div className="color-row">
            <input
              type="color"
              className="color-input"
              value={this.footerConfig.linkColor}
              onChange={(e) => this.updateFooterConfig('linkColor', e.target.value)}
            />
            <input
              type="text"
              value={this.footerConfig.linkColor}
              onChange={(e) => this.updateFooterConfig('linkColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Border Color</label>
          <div className="color-row">
            <input
              type="color"
              className="color-input"
              value={this.footerConfig.borderColor}
              onChange={(e) => this.updateFooterConfig('borderColor', e.target.value)}
            />
            <input
              type="text"
              value={this.footerConfig.borderColor}
              onChange={(e) => this.updateFooterConfig('borderColor', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Padding</label>
          <input
            type="text"
            value={this.footerConfig.styling.padding}
            onChange={(e) => this.updateFooterConfig('styling.padding', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Margin</label>
          <input
            type="text"
            value={this.footerConfig.styling.margin}
            onChange={(e) => this.updateFooterConfig('styling.margin', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Border Radius</label>
          <input
            type="text"
            value={this.footerConfig.styling.borderRadius}
            onChange={(e) => this.updateFooterConfig('styling.borderRadius', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Font Size</label>
          <input
            type="text"
            value={this.footerConfig.styling.fontSize}
            onChange={(e) => this.updateFooterConfig('styling.fontSize', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Line Height</label>
          <input
            type="text"
            value={this.footerConfig.styling.lineHeight}
            onChange={(e) => this.updateFooterConfig('styling.lineHeight', e.target.value)}
          />
        </div>
      </div>
    );
  }
}

FooterBuilder.propTypes = {
  onFooterApply: PropTypes.func,
  className: PropTypes.string
};