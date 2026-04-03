import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class HeroSectionBuilder extends Component {
  @observable
  heroConfig = {
    layout: 'centered', // centered, left-aligned, right-aligned, split
    background: {
      type: 'color', // color, image, gradient, video
      value: '#007bff',
      overlay: false,
      overlayOpacity: 0.5
    },
    content: {
      headline: 'Welcome to Our Amazing Product',
      subheadline: 'Discover how we can transform your business with innovative solutions',
      description: 'Our platform provides everything you need to succeed in today\'s competitive market.',
      primaryCTA: {
        text: 'Get Started',
        url: '#',
        style: 'primary' // primary, secondary, outline
      },
      secondaryCTA: {
        text: 'Learn More',
        url: '#',
        style: 'outline'
      }
    },
    styling: {
      textColor: '#ffffff',
      fontSize: 'large', // small, medium, large, extra-large
      alignment: 'center',
      padding: 'large', // small, medium, large, extra-large
      maxWidth: '800px'
    }
  };

  @observable
  activeTab = 'content';

  @observable
  isPreviewMode = false;

  layouts = [
    { id: 'centered', name: 'Centered', icon: 'fa-align-center' },
    { id: 'left-aligned', name: 'Left Aligned', icon: 'fa-align-left' },
    { id: 'right-aligned', name: 'Right Aligned', icon: 'fa-align-right' },
    { id: 'split', name: 'Split Layout', icon: 'fa-columns' }
  ];

  backgroundTypes = [
    { id: 'color', name: 'Solid Color', icon: 'fa-paint-brush' },
    { id: 'gradient', name: 'Gradient', icon: 'fa-tint' },
    { id: 'image', name: 'Background Image', icon: 'fa-image' },
    { id: 'video', name: 'Background Video', icon: 'fa-video' }
  ];

  fontSizes = [
    { id: 'small', name: 'Small', size: '24px' },
    { id: 'medium', name: 'Medium', size: '32px' },
    { id: 'large', name: 'Large', size: '48px' },
    { id: 'extra-large', name: 'Extra Large', size: '64px' }
  ];

  paddings = [
    { id: 'small', name: 'Small', value: '40px' },
    { id: 'medium', name: 'Medium', value: '60px' },
    { id: 'large', name: 'Large', value: '80px' },
    { id: 'extra-large', name: 'Extra Large', value: '120px' }
  ];

  @action
  updateHeroConfig = (path, value) => {
    const keys = path.split('.');
    let current = this.heroConfig;

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
  applyHeroSection = () => {
    if (this.props.onHeroApply) {
      this.props.onHeroApply(this.heroConfig);
    }
  };

  @action
  resetToDefault = () => {
    this.heroConfig = {
      layout: 'centered',
      background: {
        type: 'color',
        value: '#007bff',
        overlay: false,
        overlayOpacity: 0.5
      },
      content: {
        headline: 'Welcome to Our Amazing Product',
        subheadline: 'Discover how we can transform your business with innovative solutions',
        description: 'Our platform provides everything you need to succeed in today\'s competitive market.',
        primaryCTA: {
          text: 'Get Started',
          url: '#',
          style: 'primary'
        },
        secondaryCTA: {
          text: 'Learn More',
          url: '#',
          style: 'outline'
        }
      },
      styling: {
        textColor: '#ffffff',
        fontSize: 'large',
        alignment: 'center',
        padding: 'large',
        maxWidth: '800px'
      }
    };
  };

  renderLayoutPreview() {
    const { layout } = this.heroConfig;
    const style = this.getHeroStyle();

    return (
      <div className="hero-preview" style={style}>
        <div className={`hero-content layout-${layout}`}>
          {layout === 'split' && (
            <div className="hero-visual">
              <div className="visual-placeholder">
                <i className="fa fa-image" />
                <span>Hero Visual</span>
              </div>
            </div>
          )}

          <div className="hero-text">
            <h1>{this.heroConfig.content.headline}</h1>
            <h2>{this.heroConfig.content.subheadline}</h2>
            <p>{this.heroConfig.content.description}</p>

            <div className="hero-ctas">
              <button className={`cta-btn ${this.heroConfig.content.primaryCTA.style}`}>
                {this.heroConfig.content.primaryCTA.text}
              </button>
              {this.heroConfig.content.secondaryCTA.text && (
                <button className={`cta-btn ${this.heroConfig.content.secondaryCTA.style}`}>
                  {this.heroConfig.content.secondaryCTA.text}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getHeroStyle() {
    const { background, styling } = this.heroConfig;
    let style = {
      color: styling.textColor,
      padding: this.paddings.find(p => p.id === styling.padding)?.value || '80px 20px',
      textAlign: styling.alignment
    };

    switch (background.type) {
      case 'color':
        style.backgroundColor = background.value;
        break;
      case 'gradient':
        style.background = `linear-gradient(135deg, ${background.value}, ${background.value}aa)`;
        break;
      case 'image':
        style.backgroundImage = `url(${background.value})`;
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
        if (background.overlay) {
          style.backgroundColor = `rgba(0, 0, 0, ${background.overlayOpacity})`;
          style.backgroundBlendMode = 'overlay';
        }
        break;
      case 'video':
        // Video background would be handled differently
        style.backgroundColor = '#000';
        break;
    }

    return style;
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('hero-builder', className)}>
        <div className="builder-header">
          <h2>Hero Section Builder</h2>
          <div className="builder-actions">
            <button className="preview-toggle" onClick={this.togglePreview}>
              <i className={`fa ${this.isPreviewMode ? 'fa-edit' : 'fa-eye'}`} />
              {this.isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button className="reset-btn" onClick={this.resetToDefault}>
              <i className="fa fa-refresh" /> Reset
            </button>
            <button className="apply-btn" onClick={this.applyHeroSection}>
              <i className="fa fa-plus" /> Add to Page
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
              className={classnames('tab-btn', { active: this.activeTab === 'layout' })}
              onClick={() => this.setActiveTab('layout')}
            >
              <i className="fa fa-th-large" /> Layout
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'background' })}
              onClick={() => this.setActiveTab('background')}
            >
              <i className="fa fa-paint-brush" /> Background
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'styling' })}
              onClick={() => this.setActiveTab('styling')}
            >
              <i className="fa fa-magic" /> Styling
            </button>
          </div>

          <div className="builder-panel">
            {this.activeTab === 'content' && this.renderContentTab()}
            {this.activeTab === 'layout' && this.renderLayoutTab()}
            {this.activeTab === 'background' && this.renderBackgroundTab()}
            {this.activeTab === 'styling' && this.renderStylingTab()}
          </div>

          <div className="builder-preview">
            {this.renderLayoutPreview()}
          </div>
        </div>

        <style jsx>{`
          .hero-builder {
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

          .builder-actions {
            display: flex;
            gap: 8px;
          }

          .preview-toggle, .reset-btn, .apply-btn {
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .preview-toggle {
            background: #6c757d;
            color: white;
            border: 1px solid #6c757d;
          }

          .preview-toggle:hover {
            background: #5a6268;
          }

          .reset-btn {
            background: #ffc107;
            color: #212529;
            border: 1px solid #ffc107;
          }

          .reset-btn:hover {
            background: #e0a800;
          }

          .apply-btn {
            background: #007bff;
            color: white;
            border: 1px solid #007bff;
          }

          .apply-btn:hover {
            background: #0056b3;
          }

          .builder-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .builder-tabs {
            width: 280px;
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
            overflow: hidden;
          }

          .hero-preview {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          .hero-content {
            max-width: ${this.heroConfig.styling.maxWidth};
            width: 100%;
          }

          .layout-centered {
            text-align: center;
          }

          .layout-left-aligned {
            text-align: left;
          }

          .layout-right-aligned {
            text-align: right;
          }

          .layout-split {
            display: flex;
            align-items: center;
            gap: 40px;
          }

          .layout-split .hero-text {
            flex: 1;
          }

          .layout-split .hero-visual {
            flex: 1;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .visual-placeholder {
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
          }

          .visual-placeholder i {
            font-size: 48px;
            margin-bottom: 8px;
          }

          .hero-text h1 {
            font-size: ${this.fontSizes.find(f => f.id === this.heroConfig.styling.fontSize)?.size || '48px'};
            font-weight: 700;
            margin: 0 0 16px 0;
            line-height: 1.2;
          }

          .hero-text h2 {
            font-size: 24px;
            font-weight: 400;
            margin: 0 0 16px 0;
            opacity: 0.9;
            line-height: 1.3;
          }

          .hero-text p {
            font-size: 18px;
            margin: 0 0 32px 0;
            opacity: 0.8;
            line-height: 1.5;
          }

          .hero-ctas {
            display: flex;
            gap: 16px;
            justify-content: ${this.heroConfig.styling.alignment === 'center' ? 'center' : this.heroConfig.styling.alignment === 'right' ? 'flex-end' : 'flex-start'};
            flex-wrap: wrap;
          }

          .cta-btn {
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
          }

          .cta-btn.primary {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .cta-btn.primary:hover {
            background: #0056b3;
            border-color: #0056b3;
          }

          .cta-btn.secondary {
            background: #6c757d;
            color: white;
            border-color: #6c757d;
          }

          .cta-btn.secondary:hover {
            background: #5a6268;
            border-color: #5a6268;
          }

          .cta-btn.outline {
            background: transparent;
            color: white;
            border-color: white;
          }

          .cta-btn.outline:hover {
            background: white;
            color: #007bff;
          }

          @media (max-width: 1200px) {
            .builder-content {
              flex-direction: column;
            }

            .builder-tabs, .builder-panel {
              width: 100%;
              height: auto;
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
    return (
      <div className="content-tab">
        <div className="form-group">
          <label>Headline</label>
          <input
            type="text"
            value={this.heroConfig.content.headline}
            onChange={(e) => this.updateHeroConfig('content.headline', e.target.value)}
            placeholder="Enter your main headline"
          />
        </div>

        <div className="form-group">
          <label>Subheadline</label>
          <input
            type="text"
            value={this.heroConfig.content.subheadline}
            onChange={(e) => this.updateHeroConfig('content.subheadline', e.target.value)}
            placeholder="Enter your subheadline"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={this.heroConfig.content.description}
            onChange={(e) => this.updateHeroConfig('content.description', e.target.value)}
            placeholder="Enter your description"
            rows={3}
          />
        </div>

        <div className="cta-section">
          <h4>Call-to-Action Buttons</h4>

          <div className="form-group">
            <label>Primary CTA Text</label>
            <input
              type="text"
              value={this.heroConfig.content.primaryCTA.text}
              onChange={(e) => this.updateHeroConfig('content.primaryCTA.text', e.target.value)}
              placeholder="Get Started"
            />
          </div>

          <div className="form-group">
            <label>Primary CTA URL</label>
            <input
              type="url"
              value={this.heroConfig.content.primaryCTA.url}
              onChange={(e) => this.updateHeroConfig('content.primaryCTA.url', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>Primary CTA Style</label>
            <select
              value={this.heroConfig.content.primaryCTA.style}
              onChange={(e) => this.updateHeroConfig('content.primaryCTA.style', e.target.value)}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
          </div>

          <div className="form-group">
            <label>Secondary CTA Text (Optional)</label>
            <input
              type="text"
              value={this.heroConfig.content.secondaryCTA.text}
              onChange={(e) => this.updateHeroConfig('content.secondaryCTA.text', e.target.value)}
              placeholder="Learn More"
            />
          </div>

          <div className="form-group">
            <label>Secondary CTA URL</label>
            <input
              type="url"
              value={this.heroConfig.content.secondaryCTA.url}
              onChange={(e) => this.updateHeroConfig('content.secondaryCTA.url', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>Secondary CTA Style</label>
            <select
              value={this.heroConfig.content.secondaryCTA.style}
              onChange={(e) => this.updateHeroConfig('content.secondaryCTA.style', e.target.value)}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  renderLayoutTab() {
    return (
      <div className="layout-tab">
        <div className="option-group">
          <h4>Layout Style</h4>
          <div className="layout-options">
            {this.layouts.map(layout => (
              <button
                key={layout.id}
                className={classnames('layout-option', {
                  active: this.heroConfig.layout === layout.id
                })}
                onClick={() => this.updateHeroConfig('layout', layout.id)}
              >
                <i className={`fa ${layout.icon}`} />
                <span>{layout.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Content Alignment</label>
          <select
            value={this.heroConfig.styling.alignment}
            onChange={(e) => this.updateHeroConfig('styling.alignment', e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="form-group">
          <label>Maximum Width</label>
          <input
            type="text"
            value={this.heroConfig.styling.maxWidth}
            onChange={(e) => this.updateHeroConfig('styling.maxWidth', e.target.value)}
            placeholder="800px"
          />
        </div>
      </div>
    );
  }

  renderBackgroundTab() {
    return (
      <div className="background-tab">
        <div className="option-group">
          <h4>Background Type</h4>
          <div className="background-options">
            {this.backgroundTypes.map(type => (
              <button
                key={type.id}
                className={classnames('background-option', {
                  active: this.heroConfig.background.type === type.id
                })}
                onClick={() => this.updateHeroConfig('background.type', type.id)}
              >
                <i className={`fa ${type.icon}`} />
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {this.heroConfig.background.type === 'color' && (
          <div className="form-group">
            <label>Background Color</label>
            <input
              type="color"
              value={this.heroConfig.background.value}
              onChange={(e) => this.updateHeroConfig('background.value', e.target.value)}
            />
          </div>
        )}

        {this.heroConfig.background.type === 'gradient' && (
          <div className="form-group">
            <label>Gradient Color</label>
            <input
              type="color"
              value={this.heroConfig.background.value}
              onChange={(e) => this.updateHeroConfig('background.value', e.target.value)}
            />
            <small>Gradient will be created from this color</small>
          </div>
        )}

        {(this.heroConfig.background.type === 'image' || this.heroConfig.background.type === 'video') && (
          <div className="form-group">
            <label>{this.heroConfig.background.type === 'image' ? 'Image' : 'Video'} URL</label>
            <input
              type="url"
              value={this.heroConfig.background.value}
              onChange={(e) => this.updateHeroConfig('background.value', e.target.value)}
              placeholder={`Enter ${this.heroConfig.background.type} URL`}
            />
          </div>
        )}

        {(this.heroConfig.background.type === 'image' || this.heroConfig.background.type === 'video') && (
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={this.heroConfig.background.overlay}
                onChange={(e) => this.updateHeroConfig('background.overlay', e.target.checked)}
              />
              Add Dark Overlay
            </label>
          </div>
        )}

        {this.heroConfig.background.overlay && (
          <div className="form-group">
            <label>Overlay Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={this.heroConfig.background.overlayOpacity}
              onChange={(e) => this.updateHeroConfig('background.overlayOpacity', parseFloat(e.target.value))}
            />
            <span>{Math.round(this.heroConfig.background.overlayOpacity * 100)}%</span>
          </div>
        )}
      </div>
    );
  }

  renderStylingTab() {
    return (
      <div className="styling-tab">
        <div className="form-group">
          <label>Text Color</label>
          <input
            type="color"
            value={this.heroConfig.styling.textColor}
            onChange={(e) => this.updateHeroConfig('styling.textColor', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Font Size</label>
          <select
            value={this.heroConfig.styling.fontSize}
            onChange={(e) => this.updateHeroConfig('styling.fontSize', e.target.value)}
          >
            {this.fontSizes.map(size => (
              <option key={size.id} value={size.id}>{size.name} ({size.size})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Padding</label>
          <select
            value={this.heroConfig.styling.padding}
            onChange={(e) => this.updateHeroConfig('styling.padding', e.target.value)}
          >
            {this.paddings.map(padding => (
              <option key={padding.id} value={padding.id}>{padding.name} ({padding.value})</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

HeroSectionBuilder.propTypes = {
  onHeroApply: PropTypes.func,
  className: PropTypes.string
};