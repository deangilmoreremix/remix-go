import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class ResponsiveLayoutSystem extends Component {
  @observable
  selectedBreakpoint = 'desktop'; // desktop, tablet, mobile

  @observable
  layoutConfig = {
    container: {
      maxWidth: '1200px',
      padding: { desktop: '20px', tablet: '16px', mobile: '12px' }
    },
    grid: {
      columns: 12,
      gutter: { desktop: '20px', tablet: '16px', mobile: '12px' }
    },
    breakpoints: {
      desktop: { min: '1024px', max: '100%' },
      tablet: { min: '768px', max: '1023px' },
      mobile: { min: '320px', max: '767px' }
    }
  };

  @observable
  previewDevice = 'desktop';

  @observable
  showGridOverlay = false;

  @observable
  snapToGrid = true;

  breakpoints = [
    { id: 'desktop', name: 'Desktop', icon: 'fa-desktop', width: '1200px' },
    { id: 'tablet', name: 'Tablet', icon: 'fa-tablet', width: '768px' },
    { id: 'mobile', name: 'Mobile', icon: 'fa-mobile', width: '375px' }
  ];

  layoutPresets = [
    {
      id: 'single-column',
      name: 'Single Column',
      icon: 'fa-square',
      description: 'Full-width single column layout',
      grid: [
        { span: 12, offset: 0 }
      ]
    },
    {
      id: 'two-column',
      name: 'Two Columns',
      icon: 'fa-columns',
      description: '50/50 two column split',
      grid: [
        { span: 6, offset: 0 },
        { span: 6, offset: 0 }
      ]
    },
    {
      id: 'three-column',
      name: 'Three Columns',
      icon: 'fa-th',
      description: 'Equal three column layout',
      grid: [
        { span: 4, offset: 0 },
        { span: 4, offset: 0 },
        { span: 4, offset: 0 }
      ]
    },
    {
      id: 'sidebar-left',
      name: 'Sidebar Left',
      icon: 'fa-arrow-left',
      description: 'Narrow sidebar with main content',
      grid: [
        { span: 3, offset: 0 },
        { span: 9, offset: 0 }
      ]
    },
    {
      id: 'sidebar-right',
      name: 'Sidebar Right',
      icon: 'fa-arrow-right',
      description: 'Main content with narrow sidebar',
      grid: [
        { span: 9, offset: 0 },
        { span: 3, offset: 0 }
      ]
    },
    {
      id: 'four-column',
      name: 'Four Columns',
      icon: 'fa-th-large',
      description: 'Equal four column layout',
      grid: [
        { span: 3, offset: 0 },
        { span: 3, offset: 0 },
        { span: 3, offset: 0 },
        { span: 3, offset: 0 }
      ]
    },
    {
      id: 'hero-centered',
      name: 'Hero Centered',
      icon: 'fa-align-center',
      description: 'Centered hero section',
      grid: [
        { span: 8, offset: 2 }
      ]
    },
    {
      id: 'asymmetric',
      name: 'Asymmetric',
      icon: 'fa-balance-scale',
      description: '2/3 and 1/3 split',
      grid: [
        { span: 8, offset: 0 },
        { span: 4, offset: 0 }
      ]
    }
  ];

  @action
  selectBreakpoint = (breakpointId) => {
    this.selectedBreakpoint = breakpointId;
  };

  @action
  updateBreakpoint = (breakpoint, property, value) => {
    this.layoutConfig.breakpoints[breakpoint][property] = value;
  };

  @action
  updateContainer = (property, value) => {
    if (property === 'padding') {
      this.layoutConfig.container.padding[this.selectedBreakpoint] = value;
    } else {
      this.layoutConfig.container[property] = value;
    }
  };

  @action
  updateGrid = (property, value) => {
    if (property === 'gutter') {
      this.layoutConfig.grid.gutter[this.selectedBreakpoint] = value;
    } else {
      this.layoutConfig.grid[property] = value;
    }
  };

  @action
  setPreviewDevice = (device) => {
    this.previewDevice = device;
  };

  @action
  toggleGridOverlay = () => {
    this.showGridOverlay = !this.showGridOverlay;
  };

  @action
  toggleSnapToGrid = () => {
    this.snapToGrid = !this.snapToGrid;
  };

  @action
  applyLayoutPreset = (preset) => {
    if (this.props.onLayoutApply) {
      this.props.onLayoutApply(preset);
    }
  };

  @action
  generateCSS = () => {
    const { container, grid, breakpoints } = this.layoutConfig;
    let css = '';

    // Container styles
    css += `
.container {
  max-width: ${container.maxWidth};
  margin: 0 auto;
  padding-left: ${container.padding.desktop};
  padding-right: ${container.padding.desktop};
}

@media (max-width: ${breakpoints.tablet.max}) {
  .container {
    padding-left: ${container.padding.tablet};
    padding-right: ${container.padding.tablet};
  }
}

@media (max-width: ${breakpoints.mobile.max}) {
  .container {
    padding-left: ${container.padding.mobile};
    padding-right: ${container.padding.mobile};
  }
}
`;

    // Grid system
    css += `
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -${grid.gutter.desktop};
  margin-right: -${grid.gutter.desktop};
}

.col {
  flex: 1;
  padding-left: ${grid.gutter.desktop};
  padding-right: ${grid.gutter.desktop};
}
`;

    // Generate column classes
    for (let i = 1; i <= grid.columns; i++) {
      css += `
.col-${i} {
  flex: 0 0 ${(i / grid.columns) * 100}%;
  max-width: ${(i / grid.columns) * 100}%;
}
`;

      // Offset classes
      for (let j = 0; j < grid.columns - i; j++) {
        css += `
.col-${i}.offset-${j} {
  margin-left: ${(j / grid.columns) * 100}%;
}
`;
      }
    }

    // Responsive breakpoints
    css += `
@media (max-width: ${breakpoints.tablet.max}) {
  .row {
    margin-left: -${grid.gutter.tablet};
    margin-right: -${grid.gutter.tablet};
  }

  .col {
    padding-left: ${grid.gutter.tablet};
    padding-right: ${grid.gutter.tablet};
  }
}

@media (max-width: ${breakpoints.mobile.max}) {
  .row {
    margin-left: -${grid.gutter.mobile};
    margin-right: -${grid.gutter.mobile};
  }

  .col {
    padding-left: ${grid.gutter.mobile};
    padding-right: ${grid.gutter.mobile};
  }
}
`;

    return css;
  };

  getPreviewWidth = () => {
    switch (this.previewDevice) {
      case 'desktop': return '1200px';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '1200px';
    }
  };

  renderGridOverlay() {
    if (!this.showGridOverlay) return null;

    const columns = this.layoutConfig.grid.columns;
    const gutter = this.layoutConfig.grid.gutter[this.selectedBreakpoint];

    return (
      <div className="grid-overlay">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} className="grid-column" />
        ))}
        <style jsx>{`
          .grid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            display: flex;
            gap: ${gutter};
            padding-left: ${gutter};
            padding-right: ${gutter};
          }

          .grid-column {
            flex: 1;
            background: rgba(0, 123, 255, 0.1);
            border: 1px solid rgba(0, 123, 255, 0.3);
          }
        `}</style>
      </div>
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('responsive-layout-system', className)}>
        <div className="layout-header">
          <h2>Responsive Layout System</h2>
          <div className="layout-controls">
            <button
              className={classnames('control-btn', { active: this.showGridOverlay })}
              onClick={this.toggleGridOverlay}
              title="Toggle grid overlay"
            >
              <i className="fa fa-th" />
            </button>
            <button
              className={classnames('control-btn', { active: this.snapToGrid })}
              onClick={this.toggleSnapToGrid}
              title="Snap to grid"
            >
              <i className="fa fa-magnet" />
            </button>
            <button
              className="control-btn"
              onClick={() => {
                const css = this.generateCSS();
                navigator.clipboard?.writeText(css);
                // Show success message
              }}
              title="Copy CSS"
            >
              <i className="fa fa-copy" />
            </button>
          </div>
        </div>

        <div className="layout-breakpoints">
          <div className="breakpoint-tabs">
            {this.breakpoints.map(breakpoint => (
              <button
                key={breakpoint.id}
                className={classnames('breakpoint-tab', {
                  active: this.selectedBreakpoint === breakpoint.id
                })}
                onClick={() => this.selectBreakpoint(breakpoint.id)}
              >
                <i className={`fa ${breakpoint.icon}`} />
                <span>{breakpoint.name}</span>
                <small>({breakpoint.width})</small>
              </button>
            ))}
          </div>

          <div className="breakpoint-settings">
            <div className="setting-group">
              <label>Min Width</label>
              <input
                type="text"
                value={this.layoutConfig.breakpoints[this.selectedBreakpoint].min}
                onChange={(e) => this.updateBreakpoint(this.selectedBreakpoint, 'min', e.target.value)}
              />
            </div>
            <div className="setting-group">
              <label>Max Width</label>
              <input
                type="text"
                value={this.layoutConfig.breakpoints[this.selectedBreakpoint].max}
                onChange={(e) => this.updateBreakpoint(this.selectedBreakpoint, 'max', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="layout-content">
          <div className="layout-settings">
            <div className="settings-section">
              <h3>Container</h3>
              <div className="setting-group">
                <label>Max Width</label>
                <input
                  type="text"
                  value={this.layoutConfig.container.maxWidth}
                  onChange={(e) => this.updateContainer('maxWidth', e.target.value)}
                />
              </div>
              <div className="setting-group">
                <label>Padding ({this.selectedBreakpoint})</label>
                <input
                  type="text"
                  value={this.layoutConfig.container.padding[this.selectedBreakpoint]}
                  onChange={(e) => this.updateContainer('padding', e.target.value)}
                />
              </div>
            </div>

            <div className="settings-section">
              <h3>Grid System</h3>
              <div className="setting-group">
                <label>Columns</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={this.layoutConfig.grid.columns}
                  onChange={(e) => this.updateGrid('columns', parseInt(e.target.value))}
                />
              </div>
              <div className="setting-group">
                <label>Gutter ({this.selectedBreakpoint})</label>
                <input
                  type="text"
                  value={this.layoutConfig.grid.gutter[this.selectedBreakpoint]}
                  onChange={(e) => this.updateGrid('gutter', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="layout-presets">
            <h3>Layout Presets</h3>
            <div className="presets-grid">
              {this.layoutPresets.map(preset => (
                <div
                  key={preset.id}
                  className="preset-card"
                  onClick={() => this.applyLayoutPreset(preset)}
                >
                  <div className="preset-icon">
                    <i className={`fa ${preset.icon}`} />
                  </div>
                  <div className="preset-info">
                    <h4>{preset.name}</h4>
                    <p>{preset.description}</p>
                  </div>
                  <div className="preset-visual">
                    <div className="preset-grid">
                      {preset.grid.map((col, index) => (
                        <div
                          key={index}
                          className="preset-column"
                          style={{ flex: col.span }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="layout-preview">
          <div className="preview-controls">
            <div className="preview-devices">
              {this.breakpoints.map(device => (
                <button
                  key={device.id}
                  className={classnames('device-btn', {
                    active: this.previewDevice === device.id
                  })}
                  onClick={() => this.setPreviewDevice(device.id)}
                >
                  <i className={`fa ${device.icon}`} />
                  <span>{device.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="preview-container">
            <div
              className="preview-frame"
              style={{ maxWidth: this.getPreviewWidth() }}
            >
              <div className="preview-content">
                {this.renderGridOverlay()}
                <div className="sample-layout">
                  <div className="sample-header">Header</div>
                  <div className="sample-content">
                    <div className="sample-sidebar">Sidebar</div>
                    <div className="sample-main">Main Content</div>
                  </div>
                  <div className="sample-footer">Footer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .responsive-layout-system {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .layout-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .layout-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .layout-controls {
            display: flex;
            gap: 8px;
          }

          .control-btn {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            background: white;
            color: #6c757d;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .control-btn:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
          }

          .control-btn.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .layout-breakpoints {
            background: white;
            border-bottom: 1px solid #e9ecef;
          }

          .breakpoint-tabs {
            display: flex;
            padding: 0 20px;
          }

          .breakpoint-tab {
            padding: 12px 20px;
            border: none;
            background: none;
            color: #6c757d;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            flex: 1;
          }

          .breakpoint-tab.active {
            color: #007bff;
            border-bottom-color: #007bff;
          }

          .breakpoint-tab:hover {
            color: #007bff;
            background: #f8f9fa;
          }

          .breakpoint-tab small {
            font-size: 11px;
            opacity: 0.7;
          }

          .breakpoint-settings {
            padding: 16px 20px;
            display: flex;
            gap: 16px;
            border-top: 1px solid #f8f9fa;
          }

          .setting-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
          }

          .setting-group label {
            font-size: 12px;
            font-weight: 500;
            color: #495057;
            text-transform: uppercase;
          }

          .setting-group input {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
          }

          .setting-group input:focus {
            outline: none;
            border-color: #007bff;
          }

          .layout-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .layout-settings {
            width: 300px;
            background: white;
            border-right: 1px solid #e9ecef;
            padding: 20px;
            overflow-y: auto;
          }

          .settings-section {
            margin-bottom: 24px;
          }

          .settings-section h3 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
            color: #212529;
          }

          .layout-presets {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          .layout-presets h3 {
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
          }

          .presets-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }

          .preset-card {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .preset-card:hover {
            border-color: #007bff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }

          .preset-icon {
            width: 40px;
            height: 40px;
            background: #007bff;
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            margin-bottom: 12px;
          }

          .preset-info h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
          }

          .preset-info p {
            margin: 0;
            font-size: 12px;
            color: #6c757d;
          }

          .preset-visual {
            margin-top: 12px;
          }

          .preset-grid {
            display: flex;
            height: 20px;
            gap: 2px;
          }

          .preset-column {
            background: #e9ecef;
            border-radius: 2px;
          }

          .layout-preview {
            width: 400px;
            background: #f8f9fa;
            border-left: 1px solid #e9ecef;
            display: flex;
            flex-direction: column;
          }

          .preview-controls {
            padding: 16px;
            background: white;
            border-bottom: 1px solid #e9ecef;
          }

          .preview-devices {
            display: flex;
            gap: 8px;
          }

          .device-btn {
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
            flex: 1;
            justify-content: center;
          }

          .device-btn.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .device-btn:hover {
            border-color: #007bff;
          }

          .preview-container {
            flex: 1;
            padding: 20px;
            display: flex;
            justify-content: center;
          }

          .preview-frame {
            width: 100%;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .preview-content {
            position: relative;
            min-height: 400px;
          }

          .sample-layout {
            padding: 20px;
          }

          .sample-header {
            background: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
            border-radius: 4px;
          }

          .sample-content {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
          }

          .sample-sidebar {
            flex: 0 0 200px;
            background: #e9ecef;
            padding: 20px;
            border-radius: 4px;
          }

          .sample-main {
            flex: 1;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
          }

          .sample-footer {
            background: #6c757d;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 4px;
          }

          @media (max-width: 1200px) {
            .layout-content {
              flex-direction: column;
            }

            .layout-settings, .layout-presets {
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #e9ecef;
            }

            .layout-preview {
              width: 100%;
              border-left: none;
            }

            .presets-grid {
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
          }

          @media (max-width: 768px) {
            .breakpoint-settings {
              flex-direction: column;
              gap: 12px;
            }

            .preview-devices {
              flex-direction: column;
            }

            .device-btn {
              justify-content: flex-start;
            }
          }
        `}</style>
      </div>
    );
  }
}

ResponsiveLayoutSystem.propTypes = {
  onLayoutApply: PropTypes.func,
  className: PropTypes.string
};