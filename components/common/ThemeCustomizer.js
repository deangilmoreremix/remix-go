import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class ThemeCustomizer extends Component {
  @observable
  activeTab = 'colors';

  @observable
  themeConfig = {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#ffc107',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#e9ecef',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8'
    },
    typography: {
      fontFamily: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif'
      },
      fontSize: {
        h1: '48px',
        h2: '36px',
        h3: '28px',
        h4: '24px',
        h5: '20px',
        h6: '18px',
        body: '16px',
        small: '14px'
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeight: {
        heading: 1.2,
        body: 1.6,
        small: 1.4
      }
    },
    spacing: {
      container: {
        maxWidth: '1200px',
        padding: '20px'
      },
      section: {
        padding: '80px 0',
        margin: '0 0 40px 0'
      },
      element: {
        margin: '16px 0',
        padding: '16px'
      }
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      round: '50%'
    },
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
      large: '0 8px 24px rgba(0, 0, 0, 0.2)',
      inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    animations: {
      duration: {
        fast: '0.15s',
        normal: '0.3s',
        slow: '0.5s'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  };

  @observable
  selectedColorGroup = 'primary';

  @observable
  previewMode = 'light'; // light, dark, auto

  @observable
  showAdvanced = false;

  colorGroups = [
    { id: 'primary', name: 'Primary', colors: ['primary'] },
    { id: 'secondary', name: 'Secondary', colors: ['secondary'] },
    { id: 'accent', name: 'Accent', colors: ['accent'] },
    { id: 'background', name: 'Background', colors: ['background', 'surface'] },
    { id: 'text', name: 'Text', colors: ['text', 'textSecondary'] },
    { id: 'borders', name: 'Borders', colors: ['border'] },
    { id: 'status', name: 'Status', colors: ['success', 'warning', 'error', 'info'] }
  ];

  fontStacks = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' }
  ];

  presetThemes = [
    {
      name: 'Default',
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#ffc107',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#212529',
        textSecondary: '#6c757d',
        border: '#e9ecef',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8'
      }
    },
    {
      name: 'Dark',
      colors: {
        primary: '#4dabf7',
        secondary: '#868e96',
        accent: '#ffd43b',
        background: '#212529',
        surface: '#343a40',
        text: '#ffffff',
        textSecondary: '#adb5bd',
        border: '#495057',
        success: '#51cf66',
        warning: '#ffd43b',
        error: '#ff6b6b',
        info: '#74c0fc'
      }
    },
    {
      name: 'Minimal',
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#ffffff',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#000000',
        textSecondary: '#666666',
        border: '#e0e0e0',
        success: '#00aa00',
        warning: '#ffaa00',
        error: '#aa0000',
        info: '#0088aa'
      }
    },
    {
      name: 'Ocean',
      colors: {
        primary: '#0066cc',
        secondary: '#0088aa',
        accent: '#00aaff',
        background: '#ffffff',
        surface: '#f0f8ff',
        text: '#003366',
        textSecondary: '#006699',
        border: '#99ccff',
        success: '#00aa66',
        warning: '#ffaa00',
        error: '#cc3300',
        info: '#0066cc'
      }
    },
    {
      name: 'Forest',
      colors: {
        primary: '#2d5a27',
        secondary: '#4a7c3a',
        accent: '#6fbf4a',
        background: '#ffffff',
        surface: '#f0f9f0',
        text: '#1a3a1a',
        textSecondary: '#2d5a27',
        border: '#a8d5a8',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#2196f3'
      }
    }
  ];

  @action
  setActiveTab = (tab) => {
    this.activeTab = tab;
  };

  @action
  updateColor = (colorKey, value) => {
    this.themeConfig.colors[colorKey] = value;
    this.notifyThemeChange();
  };

  @action
  updateTypography = (category, property, value) => {
    this.themeConfig.typography[category][property] = value;
    this.notifyThemeChange();
  };

  @action
  updateSpacing = (category, property, value) => {
    this.themeConfig.spacing[category][property] = value;
    this.notifyThemeChange();
  };

  @action
  updateBorderRadius = (size, value) => {
    this.themeConfig.borderRadius[size] = value;
    this.notifyThemeChange();
  };

  @action
  updateShadow = (size, value) => {
    this.themeConfig.shadows[size] = value;
    this.notifyThemeChange();
  };

  @action
  updateAnimation = (category, property, value) => {
    this.themeConfig.animations[category][property] = value;
    this.notifyThemeChange();
  };

  @action
  applyPresetTheme = (preset) => {
    this.themeConfig.colors = { ...preset.colors };
    this.notifyThemeChange();
  };

  @action
  setPreviewMode = (mode) => {
    this.previewMode = mode;
  };

  @action
  toggleAdvanced = () => {
    this.showAdvanced = !this.showAdvanced;
  };

  @action
  resetToDefault = () => {
    this.applyPresetTheme(this.presetThemes[0]);
  };

  @action
  exportTheme = () => {
    const themeData = JSON.stringify(this.themeConfig, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  @action
  importTheme = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target.result);
          this.themeConfig = themeData;
          this.notifyThemeChange();
        } catch (error) {
          console.error('Invalid theme file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  notifyThemeChange = () => {
    if (this.props.onThemeChange) {
      this.props.onThemeChange(this.themeConfig);
    }
  };

  @computed
  get themeCSS() {
    const { colors, typography, spacing, borderRadius, shadows, animations } = this.themeConfig;

    return `
:root {
  /* Colors */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-background: ${colors.background};
  --color-surface: ${colors.surface};
  --color-text: ${colors.text};
  --color-text-secondary: ${colors.textSecondary};
  --color-border: ${colors.border};
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-error: ${colors.error};
  --color-info: ${colors.info};

  /* Typography */
  --font-heading: ${typography.fontFamily.heading};
  --font-body: ${typography.fontFamily.body};
  --font-size-h1: ${typography.fontSize.h1};
  --font-size-h2: ${typography.fontSize.h2};
  --font-size-h3: ${typography.fontSize.h3};
  --font-size-h4: ${typography.fontSize.h4};
  --font-size-h5: ${typography.fontSize.h5};
  --font-size-h6: ${typography.fontSize.h6};
  --font-size-body: ${typography.fontSize.body};
  --font-size-small: ${typography.fontSize.small};
  --line-height-heading: ${typography.lineHeight.heading};
  --line-height-body: ${typography.lineHeight.body};
  --line-height-small: ${typography.lineHeight.small};

  /* Spacing */
  --container-max-width: ${spacing.container.maxWidth};
  --container-padding: ${spacing.container.padding};
  --section-padding: ${spacing.section.padding};
  --section-margin: ${spacing.section.margin};
  --element-margin: ${spacing.element.margin};
  --element-padding: ${spacing.element.padding};

  /* Border Radius */
  --border-radius-small: ${borderRadius.small};
  --border-radius-medium: ${borderRadius.medium};
  --border-radius-large: ${borderRadius.large};
  --border-radius-round: ${borderRadius.round};

  /* Shadows */
  --shadow-small: ${shadows.small};
  --shadow-medium: ${shadows.medium};
  --shadow-large: ${shadows.large};
  --shadow-inset: ${shadows.inset};

  /* Animations */
  --animation-fast: ${animations.duration.fast};
  --animation-normal: ${animations.duration.normal};
  --animation-slow: ${animations.duration.slow};
  --animation-ease: ${animations.easing.ease};
  --animation-ease-in: ${animations.easing.easeIn};
  --animation-ease-out: ${animations.easing.easeOut};
  --animation-ease-in-out: ${animations.easing.easeInOut};
}

/* Base styles */
body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-background);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-text);
  line-height: var(--line-height-heading);
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }
h3 { font-size: var(--font-size-h3); }
h4 { font-size: var(--font-size-h4); }
h5 { font-size: var(--font-size-h5); }
h6 { font-size: var(--font-size-h6); }

p { line-height: var(--line-height-body); }
small { line-height: var(--line-height-small); }

/* Component styles */
.btn-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.btn-secondary {
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
  color: white;
}

.card {
  background-color: var(--color-surface);
  border-color: var(--color-border);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-small);
}
`;
  }

  renderPreview() {
    const style = {
      backgroundColor: this.themeConfig.colors.background,
      color: this.themeConfig.colors.text,
      fontFamily: this.themeConfig.typography.fontFamily.body,
      padding: '20px',
      borderRadius: '8px',
      border: `1px solid ${this.themeConfig.colors.border}`
    };

    return (
      <div className="theme-preview" style={style}>
        <h1 style={{
          fontFamily: this.themeConfig.typography.fontFamily.heading,
          color: this.themeConfig.colors.text,
          fontSize: this.themeConfig.typography.fontSize.h1,
          lineHeight: this.themeConfig.typography.lineHeight.heading
        }}>
          Amazing Headline
        </h1>

        <p style={{
          fontSize: this.themeConfig.typography.fontSize.body,
          lineHeight: this.themeConfig.typography.lineHeight.body,
          color: this.themeConfig.colors.textSecondary
        }}>
          This is a sample paragraph showing how your theme will look. The colors, typography, and spacing are all customizable to match your brand perfectly.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button style={{
            backgroundColor: this.themeConfig.colors.primary,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: this.themeConfig.borderRadius.medium,
            cursor: 'pointer'
          }}>
            Primary Button
          </button>

          <button style={{
            backgroundColor: this.themeConfig.colors.secondary,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: this.themeConfig.borderRadius.medium,
            cursor: 'pointer'
          }}>
            Secondary Button
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: this.themeConfig.colors.surface,
          borderRadius: this.themeConfig.borderRadius.medium,
          border: `1px solid ${this.themeConfig.colors.border}`
        }}>
          <h3 style={{
            fontSize: this.themeConfig.typography.fontSize.h3,
            margin: '0 0 12px 0',
            color: this.themeConfig.colors.text
          }}>
            Sample Card
          </h3>
          <p style={{
            margin: 0,
            fontSize: this.themeConfig.typography.fontSize.small,
            color: this.themeConfig.colors.textSecondary
          }}>
            This is how cards and content blocks will appear with your theme.
          </p>
        </div>
      </div>
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('theme-customizer', className)}>
        <div className="customizer-header">
          <h2>Theme Customizer</h2>
          <div className="header-actions">
            <button className="action-btn" onClick={this.toggleAdvanced}>
              <i className={`fa ${this.showAdvanced ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
              Advanced
            </button>
            <button className="action-btn" onClick={this.resetToDefault}>
              <i className="fa fa-refresh" /> Reset
            </button>
            <button className="action-btn" onClick={this.exportTheme}>
              <i className="fa fa-download" /> Export
            </button>
            <label className="action-btn file-input-label">
              <i className="fa fa-upload" /> Import
              <input
                type="file"
                accept=".json"
                onChange={this.importTheme}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="customizer-content">
          <div className="customizer-tabs">
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'colors' })}
              onClick={() => this.setActiveTab('colors')}
            >
              <i className="fa fa-palette" /> Colors
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'typography' })}
              onClick={() => this.setActiveTab('typography')}
            >
              <i className="fa fa-font" /> Typography
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'spacing' })}
              onClick={() => this.setActiveTab('spacing')}
            >
              <i className="fa fa-arrows-alt" /> Spacing
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'presets' })}
              onClick={() => this.setActiveTab('presets')}
            >
              <i className="fa fa-magic" /> Presets
            </button>
            {this.showAdvanced && (
              <>
                <button
                  className={classnames('tab-btn', { active: this.activeTab === 'borders' })}
                  onClick={() => this.setActiveTab('borders')}
                >
                  <i className="fa fa-square" /> Borders
                </button>
                <button
                  className={classnames('tab-btn', { active: this.activeTab === 'shadows' })}
                  onClick={() => this.setActiveTab('shadows')}
                >
                  <i className="fa fa-clone" /> Shadows
                </button>
                <button
                  className={classnames('tab-btn', { active: this.activeTab === 'animations' })}
                  onClick={() => this.setActiveTab('animations')}
                >
                  <i className="fa fa-play" /> Animations
                </button>
              </>
            )}
          </div>

          <div className="customizer-panel">
            {this.activeTab === 'colors' && this.renderColorsTab()}
            {this.activeTab === 'typography' && this.renderTypographyTab()}
            {this.activeTab === 'spacing' && this.renderSpacingTab()}
            {this.activeTab === 'presets' && this.renderPresetsTab()}
            {this.activeTab === 'borders' && this.renderBordersTab()}
            {this.activeTab === 'shadows' && this.renderShadowsTab()}
            {this.activeTab === 'animations' && this.renderAnimationsTab()}
          </div>

          <div className="customizer-preview">
            <div className="preview-controls">
              <div className="preview-modes">
                <button
                  className={classnames('mode-btn', { active: this.previewMode === 'light' })}
                  onClick={() => this.setPreviewMode('light')}
                >
                  <i className="fa fa-sun" /> Light
                </button>
                <button
                  className={classnames('mode-btn', { active: this.previewMode === 'dark' })}
                  onClick={() => this.setPreviewMode('dark')}
                >
                  <i className="fa fa-moon" /> Dark
                </button>
                <button
                  className={classnames('mode-btn', { active: this.previewMode === 'auto' })}
                  onClick={() => this.setPreviewMode('auto')}
                >
                  <i className="fa fa-adjust" /> Auto
                </button>
              </div>
            </div>
            {this.renderPreview()}
          </div>
        </div>

        <style jsx>{`
          .theme-customizer {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .customizer-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .customizer-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .header-actions {
            display: flex;
            gap: 8px;
          }

          .action-btn, .file-input-label {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            background: white;
            color: #6c757d;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .action-btn:hover, .file-input-label:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
          }

          .customizer-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .customizer-tabs {
            width: 200px;
            background: white;
            border-right: 1px solid #e9ecef;
            display: flex;
            flex-direction: column;
          }

          .tab-btn {
            padding: 12px 16px;
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

          .customizer-panel {
            width: 320px;
            background: white;
            border-right: 1px solid #e9ecef;
            overflow-y: auto;
            padding: 20px;
          }

          .customizer-preview {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #f8f9fa;
          }

          .preview-controls {
            padding: 16px;
            background: white;
            border-bottom: 1px solid #e9ecef;
          }

          .preview-modes {
            display: flex;
            gap: 8px;
          }

          .mode-btn {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            background: white;
            color: #6c757d;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            transition: all 0.2s;
          }

          .mode-btn.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .mode-btn:hover {
            border-color: #007bff;
          }

          .theme-preview {
            flex: 1;
            margin: 20px;
            overflow-y: auto;
          }

          .color-picker {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
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

          .color-label {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
          }

          .color-value {
            font-size: 12px;
            color: #6c757d;
            font-family: monospace;
          }

          .preset-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
          }

          .preset-card {
            padding: 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
          }

          .preset-card:hover {
            border-color: #007bff;
            transform: translateY(-2px);
          }

          .preset-colors {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin-bottom: 12px;
          }

          .color-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 0 1px #e9ecef;
          }

          .preset-name {
            font-size: 14px;
            font-weight: 500;
            margin: 0;
          }

          @media (max-width: 1200px) {
            .customizer-content {
              flex-direction: column;
            }

            .customizer-tabs, .customizer-panel {
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #e9ecef;
            }

            .customizer-tabs {
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

  renderColorsTab() {
    return (
      <div className="colors-tab">
        <div className="color-groups">
          {this.colorGroups.map(group => (
            <div key={group.id} className="color-group">
              <h4>{group.name}</h4>
              {group.colors.map(colorKey => (
                <div key={colorKey} className="color-picker">
                  <input
                    type="color"
                    className="color-input"
                    value={this.themeConfig.colors[colorKey]}
                    onChange={(e) => this.updateColor(colorKey, e.target.value)}
                  />
                  <span className="color-label">
                    {colorKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="color-value">{this.themeConfig.colors[colorKey]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderTypographyTab() {
    return (
      <div className="typography-tab">
        <div className="typography-section">
          <h4>Font Families</h4>
          <div className="form-group">
            <label>Heading Font</label>
            <select
              value={this.themeConfig.typography.fontFamily.heading}
              onChange={(e) => this.updateTypography('fontFamily', 'heading', e.target.value)}
            >
              {this.fontStacks.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Body Font</label>
            <select
              value={this.themeConfig.typography.fontFamily.body}
              onChange={(e) => this.updateTypography('fontFamily', 'body', e.target.value)}
            >
              {this.fontStacks.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="typography-section">
          <h4>Font Sizes</h4>
          {Object.entries(this.themeConfig.typography.fontSize).map(([key, value]) => (
            <div key={key} className="form-group">
              <label>{key.toUpperCase()}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => this.updateTypography('fontSize', key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="typography-section">
          <h4>Line Heights</h4>
          {Object.entries(this.themeConfig.typography.lineHeight).map(([key, value]) => (
            <div key={key} className="form-group">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="3"
                value={value}
                onChange={(e) => this.updateTypography('lineHeight', key, parseFloat(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderSpacingTab() {
    return (
      <div className="spacing-tab">
        <div className="spacing-section">
          <h4>Container</h4>
          <div className="form-group">
            <label>Max Width</label>
            <input
              type="text"
              value={this.themeConfig.spacing.container.maxWidth}
              onChange={(e) => this.updateSpacing('container', 'maxWidth', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Padding</label>
            <input
              type="text"
              value={this.themeConfig.spacing.container.padding}
              onChange={(e) => this.updateSpacing('container', 'padding', e.target.value)}
            />
          </div>
        </div>

        <div className="spacing-section">
          <h4>Sections</h4>
          <div className="form-group">
            <label>Padding</label>
            <input
              type="text"
              value={this.themeConfig.spacing.section.padding}
              onChange={(e) => this.updateSpacing('section', 'padding', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Margin</label>
            <input
              type="text"
              value={this.themeConfig.spacing.section.margin}
              onChange={(e) => this.updateSpacing('section', 'margin', e.target.value)}
            />
          </div>
        </div>

        <div className="spacing-section">
          <h4>Elements</h4>
          <div className="form-group">
            <label>Margin</label>
            <input
              type="text"
              value={this.themeConfig.spacing.element.margin}
              onChange={(e) => this.updateSpacing('element', 'margin', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Padding</label>
            <input
              type="text"
              value={this.themeConfig.spacing.element.padding}
              onChange={(e) => this.updateSpacing('element', 'padding', e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  renderPresetsTab() {
    return (
      <div className="presets-tab">
        <h4>Theme Presets</h4>
        <div className="preset-grid">
          {this.presetThemes.map(preset => (
            <div
              key={preset.name}
              className="preset-card"
              onClick={() => this.applyPresetTheme(preset)}
            >
              <div className="preset-colors">
                <div
                  className="color-dot"
                  style={{ backgroundColor: preset.colors.primary }}
                />
                <div
                  className="color-dot"
                  style={{ backgroundColor: preset.colors.secondary }}
                />
                <div
                  className="color-dot"
                  style={{ backgroundColor: preset.colors.accent }}
                />
              </div>
              <h5 className="preset-name">{preset.name}</h5>
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderBordersTab() {
    return (
      <div className="borders-tab">
        <h4>Border Radius</h4>
        {Object.entries(this.themeConfig.borderRadius).map(([size, value]) => (
          <div key={size} className="form-group">
            <label>{size.charAt(0).toUpperCase() + size.slice(1)}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => this.updateBorderRadius(size, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  }

  renderShadowsTab() {
    return (
      <div className="shadows-tab">
        <h4>Box Shadows</h4>
        {Object.entries(this.themeConfig.shadows).map(([size, value]) => (
          <div key={size} className="form-group">
            <label>{size.charAt(0).toUpperCase() + size.slice(1)}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => this.updateShadow(size, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  }

  renderAnimationsTab() {
    return (
      <div className="animations-tab">
        <div className="animation-section">
          <h4>Duration</h4>
          {Object.entries(this.themeConfig.animations.duration).map(([speed, value]) => (
            <div key={speed} className="form-group">
              <label>{speed.charAt(0).toUpperCase() + speed.slice(1)}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => this.updateAnimation('duration', speed, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="animation-section">
          <h4>Easing</h4>
          {Object.entries(this.themeConfig.animations.easing).map(([type, value]) => (
            <div key={type} className="form-group">
              <label>{type}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => this.updateAnimation('easing', type, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

ThemeCustomizer.propTypes = {
  onThemeChange: PropTypes.func,
  className: PropTypes.string
};