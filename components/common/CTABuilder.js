import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class CTABuilder extends Component {
  @observable
  ctaConfig = {
    type: 'button', // button, link, banner, modal-trigger
    style: 'primary', // primary, secondary, outline, ghost, gradient
    size: 'medium', // small, medium, large, extra-large
    shape: 'rounded', // square, rounded, pill, circle
    content: {
      text: 'Get Started Today',
      subtext: '',
      icon: '', // font-awesome icon class
      iconPosition: 'left' // left, right, top, bottom
    },
    action: {
      type: 'link', // link, modal, scroll, download, phone, email
      target: '#',
      modalId: '',
      scrollTarget: '',
      downloadUrl: '',
      phoneNumber: '',
      emailAddress: '',
      emailSubject: ''
    },
    appearance: {
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      borderColor: '#007bff',
      borderWidth: '2px',
      shadow: 'medium',
      hoverEffect: 'lift', // none, lift, glow, scale, slide
      animation: 'fade-in' // none, fade-in, slide-up, bounce, pulse
    },
    positioning: {
      alignment: 'center', // left, center, right, full-width
      margin: '16px 0',
      width: 'auto', // auto, full, custom
      customWidth: '200px'
    },
    conversion: {
      urgencyText: '', // "Limited time offer", "Only X left"
      socialProof: '', // "Join 10,000+ users"
      guarantee: '', // "30-day money back guarantee"
      tracking: {
        eventName: 'cta_click',
        eventCategory: 'conversion',
        eventLabel: ''
      }
    }
  };

  @observable
  activeTab = 'content';

  @observable
  isPreviewMode = true;

  @observable
  previewHover = false;

  buttonStyles = [
    { id: 'primary', name: 'Primary', color: '#007bff' },
    { id: 'secondary', name: 'Secondary', color: '#6c757d' },
    { id: 'success', name: 'Success', color: '#28a745' },
    { id: 'danger', name: 'Danger', color: '#dc3545' },
    { id: 'warning', name: 'Warning', color: '#ffc107' },
    { id: 'info', name: 'Info', color: '#17a2b8' },
    { id: 'light', name: 'Light', color: '#f8f9fa' },
    { id: 'dark', name: 'Dark', color: '#343a40' },
    { id: 'outline', name: 'Outline', color: 'transparent' },
    { id: 'ghost', name: 'Ghost', color: 'transparent' },
    { id: 'gradient', name: 'Gradient', color: 'linear-gradient(45deg, #007bff, #6610f2)' }
  ];

  buttonSizes = [
    { id: 'small', name: 'Small', padding: '6px 12px', fontSize: '14px' },
    { id: 'medium', name: 'Medium', padding: '10px 20px', fontSize: '16px' },
    { id: 'large', name: 'Large', padding: '12px 24px', fontSize: '18px' },
    { id: 'extra-large', name: 'Extra Large', padding: '16px 32px', fontSize: '20px' }
  ];

  buttonShapes = [
    { id: 'square', name: 'Square', borderRadius: '0' },
    { id: 'rounded', name: 'Rounded', borderRadius: '4px' },
    { id: 'pill', name: 'Pill', borderRadius: '50px' },
    { id: 'circle', name: 'Circle', borderRadius: '50%' }
  ];

  hoverEffects = [
    { id: 'none', name: 'None' },
    { id: 'lift', name: 'Lift Up' },
    { id: 'glow', name: 'Glow' },
    { id: 'scale', name: 'Scale' },
    { id: 'slide', name: 'Slide' },
    { id: 'fill', name: 'Color Fill' },
    { id: 'bounce', name: 'Bounce' }
  ];

  animations = [
    { id: 'none', name: 'None' },
    { id: 'fade-in', name: 'Fade In' },
    { id: 'slide-up', name: 'Slide Up' },
    { id: 'slide-down', name: 'Slide Down' },
    { id: 'slide-left', name: 'Slide Left' },
    { id: 'slide-right', name: 'Slide Right' },
    { id: 'bounce', name: 'Bounce' },
    { id: 'pulse', name: 'Pulse' },
    { id: 'rotate', name: 'Rotate' },
    { id: 'flip', name: 'Flip' }
  ];

  actionTypes = [
    { id: 'link', name: 'Link', icon: 'fa-external-link' },
    { id: 'modal', name: 'Open Modal', icon: 'fa-window-maximize' },
    { id: 'scroll', name: 'Scroll to Section', icon: 'fa-arrow-down' },
    { id: 'download', name: 'Download File', icon: 'fa-download' },
    { id: 'phone', name: 'Phone Call', icon: 'fa-phone' },
    { id: 'email', name: 'Send Email', icon: 'fa-envelope' }
  ];

  shadows = [
    { id: 'none', name: 'None', value: 'none' },
    { id: 'small', name: 'Small', value: '0 2px 4px rgba(0,0,0,0.1)' },
    { id: 'medium', name: 'Medium', value: '0 4px 12px rgba(0,0,0,0.15)' },
    { id: 'large', name: 'Large', value: '0 8px 24px rgba(0,0,0,0.2)' },
    { id: 'inset', name: 'Inset', value: 'inset 0 2px 4px rgba(0,0,0,0.1)' }
  ];

  @action
  updateCTAConfig = (path, value) => {
    const keys = path.split('.');
    let current = this.ctaConfig;

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
  togglePreview = () => {
    this.isPreviewMode = !this.isPreviewMode;
  };

  @action
  setPreviewHover = (hover) => {
    this.previewHover = hover;
  };

  @action
  applyCTA = () => {
    if (this.props.onCTAApply) {
      this.props.onCTAApply(this.ctaConfig);
    }
  };

  @action
  resetToDefault = () => {
    this.ctaConfig = {
      type: 'button',
      style: 'primary',
      size: 'medium',
      shape: 'rounded',
      content: {
        text: 'Get Started Today',
        subtext: '',
        icon: '',
        iconPosition: 'left'
      },
      action: {
        type: 'link',
        target: '#',
        modalId: '',
        scrollTarget: '',
        downloadUrl: '',
        phoneNumber: '',
        emailAddress: '',
        emailSubject: ''
      },
      appearance: {
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        borderColor: '#007bff',
        borderWidth: '2px',
        shadow: 'medium',
        hoverEffect: 'lift',
        animation: 'fade-in'
      },
      positioning: {
        alignment: 'center',
        margin: '16px 0',
        width: 'auto',
        customWidth: '200px'
      },
      conversion: {
        urgencyText: '',
        socialProof: '',
        guarantee: '',
        tracking: {
          eventName: 'cta_click',
          eventCategory: 'conversion',
          eventLabel: ''
        }
      }
    };
  };

  @computed
  get buttonStyle() {
    const { style, size, shape, appearance } = this.ctaConfig;
    const sizeConfig = this.buttonSizes.find(s => s.id === size);
    const shapeConfig = this.buttonShapes.find(s => s.id === shape);

    let baseStyle = {
      padding: sizeConfig.padding,
      fontSize: sizeConfig.fontSize,
      borderRadius: shapeConfig.borderRadius,
      border: `${appearance.borderWidth} solid ${appearance.borderColor}`,
      boxShadow: this.shadows.find(s => s.id === appearance.shadow)?.value || 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      textDecoration: 'none',
      fontWeight: '500'
    };

    // Style-specific properties
    switch (style) {
      case 'primary':
        baseStyle.backgroundColor = appearance.backgroundColor;
        baseStyle.color = appearance.textColor;
        break;
      case 'secondary':
        baseStyle.backgroundColor = '#6c757d';
        baseStyle.color = '#ffffff';
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.color = appearance.borderColor;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.color = appearance.textColor;
        baseStyle.border = 'none';
        break;
      case 'gradient':
        baseStyle.background = 'linear-gradient(45deg, #007bff, #6610f2)';
        baseStyle.color = '#ffffff';
        baseStyle.border = 'none';
        break;
      default:
        baseStyle.backgroundColor = appearance.backgroundColor;
        baseStyle.color = appearance.textColor;
    }

    // Hover effects
    if (this.previewHover) {
      switch (appearance.hoverEffect) {
        case 'lift':
          baseStyle.transform = 'translateY(-2px)';
          baseStyle.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          break;
        case 'glow':
          baseStyle.boxShadow = `0 0 20px ${appearance.backgroundColor}50`;
          break;
        case 'scale':
          baseStyle.transform = 'scale(1.05)';
          break;
        case 'fill':
          if (style === 'outline') {
            baseStyle.backgroundColor = appearance.borderColor;
            baseStyle.color = '#ffffff';
          }
          break;
      }
    }

    return baseStyle;
  }

  @computed
  get containerStyle() {
    const { positioning } = this.ctaConfig;

    return {
      textAlign: positioning.alignment,
      margin: positioning.margin,
      width: positioning.width === 'full' ? '100%' :
             positioning.width === 'custom' ? positioning.customWidth : 'auto'
    };
  }

  renderPreview() {
    const { content, action, positioning } = this.ctaConfig;

    const buttonContent = (
      <>
        {content.icon && content.iconPosition === 'left' && (
          <i className={`fa ${content.icon}`} />
        )}
        <span>{content.text}</span>
        {content.icon && content.iconPosition === 'right' && (
          <i className={`fa ${content.icon}`} />
        )}
      </>
    );

    const buttonElement = action.type === 'link' ? (
      <a
        href={action.target}
        style={this.buttonStyle}
        onMouseEnter={() => this.setPreviewHover(true)}
        onMouseLeave={() => this.setPreviewHover(false)}
        target={action.target.startsWith('http') ? '_blank' : '_self'}
        rel={action.target.startsWith('http') ? 'noopener noreferrer' : ''}
      >
        {buttonContent}
      </a>
    ) : (
      <button
        style={this.buttonStyle}
        onMouseEnter={() => this.setPreviewHover(true)}
        onMouseLeave={() => this.setPreviewHover(false)}
        onClick={() => {
          // Handle different action types
          switch (action.type) {
            case 'modal':
              // Trigger modal
              break;
            case 'scroll':
              // Scroll to target
              break;
            case 'download':
              // Download file
              break;
            case 'phone':
              window.location.href = `tel:${action.phoneNumber}`;
              break;
            case 'email':
              window.location.href = `mailto:${action.emailAddress}?subject=${encodeURIComponent(action.emailSubject)}`;
              break;
          }
        }}
      >
        {buttonContent}
      </button>
    );

    return (
      <div className="cta-preview-container" style={this.containerStyle}>
        <div className="cta-preview">
          {this.ctaConfig.conversion.urgencyText && (
            <div className="urgency-text">{this.ctaConfig.conversion.urgencyText}</div>
          )}

          {buttonElement}

          {this.ctaConfig.conversion.socialProof && (
            <div className="social-proof">{this.ctaConfig.conversion.socialProof}</div>
          )}

          {this.ctaConfig.conversion.guarantee && (
            <div className="guarantee">{this.ctaConfig.conversion.guarantee}</div>
          )}

          {content.subtext && (
            <div className="cta-subtext">{content.subtext}</div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('cta-builder', className)}>
        <div className="builder-header">
          <h2>Call-to-Action Builder</h2>
          <div className="header-actions">
            <button className="action-btn" onClick={this.togglePreview}>
              <i className={`fa ${this.isPreviewMode ? 'fa-edit' : 'fa-eye'}`} />
              {this.isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button className="action-btn" onClick={this.resetToDefault}>
              <i className="fa fa-refresh" /> Reset
            </button>
            <button className="action-btn primary" onClick={this.applyCTA}>
              <i className="fa fa-plus" /> Add CTA
            </button>
          </div>
        </div>

        <div className="builder-content">
          <div className="builder-tabs">
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'content' })}
              onClick={() => this.setActiveTab('content')}
            >
              <i className="fa fa-edit" /> Content
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'style' })}
              onClick={() => this.setActiveTab('style')}
            >
              <i className="fa fa-paint-brush" /> Style
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'action' })}
              onClick={() => this.setActiveTab('action')}
            >
              <i className="fa fa-mouse-pointer" /> Action
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'conversion' })}
              onClick={() => this.setActiveTab('conversion')}
            >
              <i className="fa fa-chart-line" /> Conversion
            </button>
          </div>

          <div className="builder-panel">
            {this.activeTab === 'content' && this.renderContentTab()}
            {this.activeTab === 'style' && this.renderStyleTab()}
            {this.activeTab === 'action' && this.renderActionTab()}
            {this.activeTab === 'conversion' && this.renderConversionTab()}
          </div>

          <div className="builder-preview">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <div className="preview-info">
                <span>Hover to see effects</span>
              </div>
            </div>
            <div className="preview-area">
              {this.renderPreview()}
            </div>
          </div>
        </div>

        <style jsx>{`
          .cta-builder {
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

          .preview-area {
            flex: 1;
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }

          .cta-preview-container {
            max-width: 600px;
            width: 100%;
          }

          .cta-preview {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .urgency-text {
            text-align: center;
            color: #dc3545;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .social-proof {
            text-align: center;
            color: #28a745;
            font-size: 14px;
            margin-top: 16px;
            font-weight: 500;
          }

          .guarantee {
            text-align: center;
            color: #6c757d;
            font-size: 12px;
            margin-top: 8px;
            font-style: italic;
          }

          .cta-subtext {
            text-align: center;
            color: #6c757d;
            font-size: 14px;
            margin-top: 12px;
          }

          .style-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }

          .style-option {
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            font-size: 12px;
            font-weight: 500;
          }

          .style-option.active {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .style-option:hover {
            border-color: #007bff;
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

          .form-row {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
          }

          .form-group {
            flex: 1;
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
            min-height: 60px;
          }

          .icon-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
            margin-bottom: 16px;
          }

          .icon-option {
            padding: 8px;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
          }

          .icon-option:hover,
          .icon-option.active {
            border-color: #007bff;
            background: #f8f9fa;
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
          }
        `}</style>
      </div>
    );
  }

  renderContentTab() {
    const popularIcons = [
      'fa-check', 'fa-arrow-right', 'fa-download', 'fa-phone', 'fa-envelope',
      'fa-star', 'fa-heart', 'fa-lightbulb', 'fa-rocket', 'fa-users',
      'fa-shopping-cart', 'fa-play', 'fa-external-link', 'fa-calendar', 'fa-map-marker'
    ];

    return (
      <div className="content-tab">
        <div className="form-group">
          <label>Button Text</label>
          <input
            type="text"
            value={this.ctaConfig.content.text}
            onChange={(e) => this.updateCTAConfig('content.text', e.target.value)}
            placeholder="Enter button text"
          />
        </div>

        <div className="form-group">
          <label>Subtext (Optional)</label>
          <input
            type="text"
            value={this.ctaConfig.content.subtext}
            onChange={(e) => this.updateCTAConfig('content.subtext', e.target.value)}
            placeholder="Additional text below button"
          />
        </div>

        <div className="form-group">
          <label>Icon (Optional)</label>
          <div className="icon-grid">
            <div
              className={classnames('icon-option', { active: !this.ctaConfig.content.icon })}
              onClick={() => this.updateCTAConfig('content.icon', '')}
            >
              <i className="fa fa-ban" />
            </div>
            {popularIcons.map(icon => (
              <div
                key={icon}
                className={classnames('icon-option', {
                  active: this.ctaConfig.content.icon === icon
                })}
                onClick={() => this.updateCTAConfig('content.icon', icon)}
              >
                <i className={`fa ${icon}`} />
              </div>
            ))}
          </div>
        </div>

        {this.ctaConfig.content.icon && (
          <div className="form-group">
            <label>Icon Position</label>
            <select
              value={this.ctaConfig.content.iconPosition}
              onChange={(e) => this.updateCTAConfig('content.iconPosition', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        )}
      </div>
    );
  }

  renderStyleTab() {
    return (
      <div className="style-tab">
        <div className="style-section">
          <h4>Button Style</h4>
          <div className="style-grid">
            {this.buttonStyles.map(style => (
              <div
                key={style.id}
                className={classnames('style-option', {
                  active: this.ctaConfig.style === style.id
                })}
                onClick={() => this.updateCTAConfig('style', style.id)}
                style={{
                  backgroundColor: style.color.startsWith('linear-gradient') ? undefined : style.color,
                  background: style.color.startsWith('linear-gradient') ? style.color : undefined,
                  color: ['light', 'outline', 'ghost'].includes(style.id) ? '#212529' : '#ffffff'
                }}
              >
                {style.name}
              </div>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Size</label>
            <select
              value={this.ctaConfig.size}
              onChange={(e) => this.updateCTAConfig('size', e.target.value)}
            >
              {this.buttonSizes.map(size => (
                <option key={size.id} value={size.id}>{size.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Shape</label>
            <select
              value={this.ctaConfig.shape}
              onChange={(e) => this.updateCTAConfig('shape', e.target.value)}
            >
              {this.buttonShapes.map(shape => (
                <option key={shape.id} value={shape.id}>{shape.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="style-section">
          <h4>Colors</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Background</label>
              <input
                type="color"
                className="color-input"
                value={this.ctaConfig.appearance.backgroundColor}
                onChange={(e) => this.updateCTAConfig('appearance.backgroundColor', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Text</label>
              <input
                type="color"
                className="color-input"
                value={this.ctaConfig.appearance.textColor}
                onChange={(e) => this.updateCTAConfig('appearance.textColor', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Border</label>
              <input
                type="color"
                className="color-input"
                value={this.ctaConfig.appearance.borderColor}
                onChange={(e) => this.updateCTAConfig('appearance.borderColor', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Border Width</label>
              <input
                type="text"
                value={this.ctaConfig.appearance.borderWidth}
                onChange={(e) => this.updateCTAConfig('appearance.borderWidth', e.target.value)}
                placeholder="2px"
              />
            </div>
          </div>
        </div>

        <div className="style-section">
          <h4>Effects</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Shadow</label>
              <select
                value={this.ctaConfig.appearance.shadow}
                onChange={(e) => this.updateCTAConfig('appearance.shadow', e.target.value)}
              >
                {this.shadows.map(shadow => (
                  <option key={shadow.id} value={shadow.id}>{shadow.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hover Effect</label>
              <select
                value={this.ctaConfig.appearance.hoverEffect}
                onChange={(e) => this.updateCTAConfig('appearance.hoverEffect', e.target.value)}
              >
                {this.hoverEffects.map(effect => (
                  <option key={effect.id} value={effect.id}>{effect.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Animation</label>
            <select
              value={this.ctaConfig.appearance.animation}
              onChange={(e) => this.updateCTAConfig('appearance.animation', e.target.value)}
            >
              {this.animations.map(anim => (
                <option key={anim.id} value={anim.id}>{anim.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="style-section">
          <h4>Positioning</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Alignment</label>
              <select
                value={this.ctaConfig.positioning.alignment}
                onChange={(e) => this.updateCTAConfig('positioning.alignment', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="full-width">Full Width</option>
              </select>
            </div>

            <div className="form-group">
              <label>Width</label>
              <select
                value={this.ctaConfig.positioning.width}
                onChange={(e) => this.updateCTAConfig('positioning.width', e.target.value)}
              >
                <option value="auto">Auto</option>
                <option value="full">Full Width</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {this.ctaConfig.positioning.width === 'custom' && (
            <div className="form-group">
              <label>Custom Width</label>
              <input
                type="text"
                value={this.ctaConfig.positioning.customWidth}
                onChange={(e) => this.updateCTAConfig('positioning.customWidth', e.target.value)}
                placeholder="200px"
              />
            </div>
          )}

          <div className="form-group">
            <label>Margin</label>
            <input
              type="text"
              value={this.ctaConfig.positioning.margin}
              onChange={(e) => this.updateCTAConfig('positioning.margin', e.target.value)}
              placeholder="16px 0"
            />
          </div>
        </div>
      </div>
    );
  }

  renderActionTab() {
    return (
      <div className="action-tab">
        <div className="form-group">
          <label>Action Type</label>
          <div className="action-types">
            {this.actionTypes.map(actionType => (
              <div
                key={actionType.id}
                className={classnames('action-type-option', {
                  active: this.ctaConfig.action.type === actionType.id
                })}
                onClick={() => this.updateCTAConfig('action.type', actionType.id)}
              >
                <i className={`fa ${actionType.icon}`} />
                <span>{actionType.name}</span>
              </div>
            ))}
          </div>
        </div>

        {this.ctaConfig.action.type === 'link' && (
          <div className="form-group">
            <label>URL</label>
            <input
              type="url"
              value={this.ctaConfig.action.target}
              onChange={(e) => this.updateCTAConfig('action.target', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        )}

        {this.ctaConfig.action.type === 'modal' && (
          <div className="form-group">
            <label>Modal ID</label>
            <input
              type="text"
              value={this.ctaConfig.action.modalId}
              onChange={(e) => this.updateCTAConfig('action.modalId', e.target.value)}
              placeholder="modal-1"
            />
          </div>
        )}

        {this.ctaConfig.action.type === 'scroll' && (
          <div className="form-group">
            <label>Scroll Target</label>
            <input
              type="text"
              value={this.ctaConfig.action.scrollTarget}
              onChange={(e) => this.updateCTAConfig('action.scrollTarget', e.target.value)}
              placeholder="#section-2"
            />
          </div>
        )}

        {this.ctaConfig.action.type === 'download' && (
          <div className="form-group">
            <label>File URL</label>
            <input
              type="url"
              value={this.ctaConfig.action.downloadUrl}
              onChange={(e) => this.updateCTAConfig('action.downloadUrl', e.target.value)}
              placeholder="/files/document.pdf"
            />
          </div>
        )}

        {this.ctaConfig.action.type === 'phone' && (
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={this.ctaConfig.action.phoneNumber}
              onChange={(e) => this.updateCTAConfig('action.phoneNumber', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        )}

        {this.ctaConfig.action.type === 'email' && (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={this.ctaConfig.action.emailAddress}
                onChange={(e) => this.updateCTAConfig('action.emailAddress', e.target.value)}
                placeholder="hello@example.com"
              />
            </div>

            <div className="form-group">
              <label>Email Subject</label>
              <input
                type="text"
                value={this.ctaConfig.action.emailSubject}
                onChange={(e) => this.updateCTAConfig('action.emailSubject', e.target.value)}
                placeholder="Let's work together"
              />
            </div>
          </>
        )}
      </div>
    );
  }

  renderConversionTab() {
    return (
      <div className="conversion-tab">
        <div className="form-group">
          <label>Urgency Text</label>
          <input
            type="text"
            value={this.ctaConfig.conversion.urgencyText}
            onChange={(e) => this.updateCTAConfig('conversion.urgencyText', e.target.value)}
            placeholder="Limited time offer!"
          />
        </div>

        <div className="form-group">
          <label>Social Proof</label>
          <input
            type="text"
            value={this.ctaConfig.conversion.socialProof}
            onChange={(e) => this.updateCTAConfig('conversion.socialProof', e.target.value)}
            placeholder="Join 10,000+ happy customers"
          />
        </div>

        <div className="form-group">
          <label>Guarantee</label>
          <input
            type="text"
            value={this.ctaConfig.conversion.guarantee}
            onChange={(e) => this.updateCTAConfig('conversion.guarantee', e.target.value)}
            placeholder="30-day money back guarantee"
          />
        </div>

        <div className="tracking-section">
          <h4>Analytics Tracking</h4>

          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              value={this.ctaConfig.conversion.tracking.eventName}
              onChange={(e) => this.updateCTAConfig('conversion.tracking.eventName', e.target.value)}
              placeholder="cta_click"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={this.ctaConfig.conversion.tracking.eventCategory}
                onChange={(e) => this.updateCTAConfig('conversion.tracking.eventCategory', e.target.value)}
                placeholder="conversion"
              />
            </div>

            <div className="form-group">
              <label>Label</label>
              <input
                type="text"
                value={this.ctaConfig.conversion.tracking.eventLabel}
                onChange={(e) => this.updateCTAConfig('conversion.tracking.eventLabel', e.target.value)}
                placeholder="primary_cta"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CTABuilder.propTypes = {
  onCTAApply: PropTypes.func,
  className: PropTypes.string
};