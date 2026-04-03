import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

// Import enhanced GrapesJS configuration with ALL free plugins
import {
  initializeCompleteGrapesJS,
  createVideoBlock,
  createPersonalizationBlocks,
  createSendsparkVideoPlayer,
  addVideoAnalytics,
  addABTesting,
  addConversionTracking
} from '../../lib/grapesjs/enhanced-config';

@inject('store')
@observer
export default class GrapesJSPluginManager extends Component {
  @observable installedPlugins = [];

  @observable availablePlugins = [];

  @observable activePlugins = [];

  @observable currentEditor = null;

  @observable isInitialized = false;

  @observable videoIntegration = {
    enabled: true,
    sendsparkVideos: [],
    personalizationRules: [],
    analyticsEnabled: true
  };

  // VERIFIED FREE PLUGINS AVAILABLE
  FREE_PLUGIN_LIST = [
    // Official Core Plugins (Verified Working)
    { id: 'grapesjs-blocks-basic', name: 'Basic Blocks', category: 'core', installed: true },
    { id: 'grapesjs-preset-webpage', name: 'Webpage Preset', category: 'core', installed: true },
    { id: 'grapesjs-preset-newsletter', name: 'Newsletter Preset', category: 'core', installed: true },
    { id: 'grapesjs-plugin-forms', name: 'Forms Plugin', category: 'core', installed: true },

    // UI Components (Available)
    { id: 'grapesjs-navbar', name: 'Navigation Bar', category: 'ui', installed: true },
    { id: 'grapesjs-lory-slider', name: 'Slider/Carousel', category: 'ui', installed: true },

    // AI Plugins (Free Community)
    { id: 'grapesjs-ai-copilot', name: 'AI Copilot', category: 'ai', installed: true }
  ];

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.initializePlugins();
  }

  componentDidMount() {
    if (this.containerRef.current) {
      this.initializeGrapesJS();
    }
  }

  @action
  initializePlugins = () => {
    // Mark all plugins as available (they're in package.json)
    this.availablePlugins = [...this.FREE_PLUGIN_LIST];

    // Load user's plugin preferences from localStorage
    const savedPlugins = localStorage.getItem('grapesjs-active-plugins');
    if (savedPlugins) {
      try {
        this.activePlugins = JSON.parse(savedPlugins);
      } catch (error) {
        console.warn('Failed to load saved plugins:', error);
      }
    }

    // Enable video integration by default
    this.videoIntegration.enabled = true;
  };

  @action
  initializeGrapesJS = () => {
    if (!this.containerRef.current || this.isInitialized) return;

    try {
      // Initialize with ALL free plugins and enhanced configuration
      this.currentEditor = initializeCompleteGrapesJS(this.containerRef.current.id, {
        aiApiKey: process.env.OPENAI_API_KEY,
        thumbApiKey: process.env.THUMBAI_API_KEY,

        // Video and personalization settings
        videoIntegration: this.videoIntegration,
        personalizationEnabled: true,
        sendsparkIntegration: true,

        // Enhanced callbacks
        onLoad: this.onEditorLoad,
        onUpdate: this.onEditorUpdate,
        onAssetAdd: this.onAssetAdd
      });

      this.isInitialized = true;

      // Add video and personalization features
      this.addVideoPersonalizationFeatures();

    } catch (error) {
      console.error('Failed to initialize GrapesJS:', error);
    }
  };

  @action
  addVideoPersonalizationFeatures = () => {
    if (!this.currentEditor) return;

    // Add Sendspark video integration
    this.currentEditor.on('component:add', (component) => {
      if (component.get('attributes')['data-sendspark-video']) {
        this.connectVideoToSendspark(component);
      }
    });

    // Add personalization logic
    this.currentEditor.on('component:selected', (component) => {
      if (component.get('attributes')['data-personalized']) {
        this.applyPersonalization(component);
      }
    });

    // Add analytics tracking
    this.currentEditor.on('canvas:drop', () => {
      // Track template usage
      this.trackAnalytics('template_used', {
        templateId: this.currentEditor.getProjectData().id,
        timestamp: Date.now()
      });
    });
  };

  @action
  connectVideoToSendspark = (videoComponent) => {
    const videoUrl = videoComponent.get('attributes').src;

    if (videoUrl && videoUrl.includes('sendspark')) {
      // Connect to Sendspark API for video data
      this.fetchSendsparkVideoData(videoUrl).then(videoData => {
        // Apply video metadata
        videoComponent.set('attributes', {
          ...videoComponent.get('attributes'),
          'data-video-id': videoData.id,
          'data-video-title': videoData.title,
          'data-video-duration': videoData.duration,
          poster: videoData.thumbnail
        });

        // Add to video integration list
        this.videoIntegration.sendsparkVideos.push(videoData);
      });
    }
  };

  @action
  applyPersonalization = (component) => {
    const personalizationType = component.get('attributes')['data-personalized'];

    // Apply personalization based on user data
    const userData = this.getCurrentUserData();

    switch (personalizationType) {
      case 'user-name':
        component.set('content', component.get('content').replace('{{user.name}}', userData.name || 'Guest'));
        break;
      case 'company':
        component.set('content', component.get('content').replace('{{company.name}}', userData.company || 'Our Company'));
        break;
      case 'location':
        component.set('content', component.get('content').replace('{{user.location}}', userData.location || 'your area'));
        break;
    }
  };

  getCurrentUserData = () => {
    // Get user data from store or context
    return {
      name: this.props.store?.user?.name || 'Valued User',
      company: this.props.store?.user?.company || 'Your Company',
      location: this.props.store?.user?.location || 'your location',
      interests: this.props.store?.user?.interests || []
    };
  };

  fetchSendsparkVideoData = async (videoUrl) => {
    // Simulate API call to Sendspark
    // In real implementation, this would call the Sendspark API
    return {
      id: 'video_' + Date.now(),
      title: 'Sample Sendspark Video',
      duration: '2:30',
      thumbnail: '/video-thumbnail.jpg',
      url: videoUrl,
      tags: ['marketing', 'product'],
      createdAt: new Date().toISOString()
    };
  };

  @action
  installPlugin = async (pluginId) => {
    const plugin = this.availablePlugins.find(p => p.id === pluginId);
    if (!plugin || plugin.installed) return;

    try {
      // Mark as installed
      plugin.installed = true;
      this.installedPlugins.push(pluginId);

      // Reinitialize editor with new plugin
      if (this.currentEditor) {
        // In a real implementation, you'd dynamically load the plugin
        // For now, just mark it as active
        this.activatePlugin(pluginId);
      }

    } catch (error) {
      console.error(`Failed to install plugin ${pluginId}:`, error);
    }
  };

  @action
  activatePlugin = (pluginId) => {
    if (!this.activePlugins.includes(pluginId)) {
      this.activePlugins.push(pluginId);

      // Save to localStorage
      localStorage.setItem('grapesjs-active-plugins', JSON.stringify(this.activePlugins));

      // Reinitialize editor if needed
      if (this.currentEditor && this.isInitialized) {
        this.reinitializeWithPlugins();
      }
    }
  };

  @action
  deactivatePlugin = (pluginId) => {
    this.activePlugins = this.activePlugins.filter(id => id !== pluginId);
    localStorage.setItem('grapesjs-active-plugins', JSON.stringify(this.activePlugins));

    if (this.currentEditor && this.isInitialized) {
      this.reinitializeWithPlugins();
    }
  };

  reinitializeWithPlugins = () => {
    // Save current project data
    const projectData = this.currentEditor.getProjectData();

    // Destroy current editor
    this.currentEditor.destroy();
    this.isInitialized = false;

    // Reinitialize with updated plugins
    setTimeout(() => {
      this.initializeGrapesJS();

      // Restore project data
      if (this.currentEditor) {
        this.currentEditor.loadProjectData(projectData);
      }
    }, 100);
  };

  @action
  addSendsparkVideo = (videoData) => {
    if (!this.currentEditor) return;

    // Add video block to editor
    const videoBlock = {
      type: 'sendspark-video',
      attributes: {
        'data-sendspark-video': 'true',
        src: videoData.url,
        poster: videoData.thumbnail,
        'data-video-id': videoData.id,
        'data-video-title': videoData.title
      }
    };

    this.currentEditor.BlockManager.get('sendspark-video').set('content', videoBlock);
    this.currentEditor.BlockManager.render();

    // Add to video integration
    this.videoIntegration.sendsparkVideos.push(videoData);
  };

  @action
  createPersonalizationRule = (rule) => {
    this.videoIntegration.personalizationRules.push(rule);

    // Apply rule to current content
    if (this.currentEditor) {
      this.applyPersonalizationRule(rule);
    }
  };

  applyPersonalizationRule = (rule) => {
    // Apply personalization rule to editor content
    const components = this.currentEditor.getComponents();

    components.forEach(component => {
      if (this.matchesPersonalizationRule(component, rule)) {
        this.applyPersonalizationToComponent(component, rule);
      }
    });
  };

  matchesPersonalizationRule = (component, rule) => {
    // Check if component matches rule conditions
    const attributes = component.get('attributes');

    switch (rule.trigger) {
      case 'user-property':
        return attributes['data-personalized'] === rule.property;
      case 'page-visit':
        return attributes['data-page-element'] === rule.pageElement;
      case 'behavior':
        return attributes['data-behavior'] === rule.behavior;
      default:
        return false;
    }
  };

  applyPersonalizationToComponent = (component, rule) => {
    // Apply personalization content
    let content = component.get('content') || '';

    // Replace personalization tokens
    Object.entries(rule.replacements || {}).forEach(([token, value]) => {
      content = content.replace(new RegExp(`{{${token}}}`, 'g'), value);
    });

    component.set('content', content);
  };

  trackAnalytics = (event, data) => {
    if (!this.videoIntegration.analyticsEnabled) return;

    // Send analytics data
    const analyticsData = {
      event,
      timestamp: Date.now(),
      userId: this.getCurrentUserData().id,
      data
    };

    // Send to analytics service
    if (window.analytics) {
      window.analytics.track(event, analyticsData);
    }

    console.log('Analytics tracked:', analyticsData);
  };

  onEditorLoad = () => {
    console.log('GrapesJS editor loaded with all free plugins');
    this.trackAnalytics('editor_loaded', { pluginCount: this.activePlugins.length });
  };

  onEditorUpdate = () => {
    this.trackAnalytics('editor_updated', { timestamp: Date.now() });
  };

  onAssetAdd = (asset) => {
    this.trackAnalytics('asset_added', { assetType: asset.type, assetId: asset.id });
  };

  @computed
  get activePluginDetails() {
    return this.activePlugins.map(pluginId =>
      this.availablePlugins.find(p => p.id === pluginId)
    ).filter(Boolean);
  }

  @computed
  get pluginsByCategory() {
    const categories = {};

    this.availablePlugins.forEach(plugin => {
      if (!categories[plugin.category]) {
        categories[plugin.category] = [];
      }
      categories[plugin.category].push(plugin);
    });

    return categories;
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('grapesjs-plugin-manager', className)}>
        <div className="plugin-manager-header">
          <h2>GrapesJS Plugin Manager</h2>
          <div className="header-stats">
            <span className="stat">
              <i className="fa fa-puzzle-piece" />
              {this.activePlugins.length} Active Plugins
            </span>
            <span className="stat">
              <i className="fa fa-video" />
              {this.videoIntegration.sendsparkVideos.length} Sendspark Videos
            </span>
            <span className="stat">
              <i className="fa fa-magic" />
              {this.videoIntegration.personalizationRules.length} Personalization Rules
            </span>
          </div>
        </div>

        <div className="plugin-manager-content">
          <div className="plugins-sidebar">
            <div className="plugins-categories">
              {Object.entries(this.pluginsByCategory).map(([category, plugins]) => (
                <div key={category} className="category-section">
                  <h3 className="category-title">
                    {category.charAt(0).toUpperCase() + category.slice(1)} Plugins
                    <span className="category-count">({plugins.length})</span>
                  </h3>

                  <div className="category-plugins">
                    {plugins.map(plugin => (
                      <div key={plugin.id} className="plugin-item">
                        <div className="plugin-info">
                          <h4>{plugin.name}</h4>
                          <div className="plugin-status">
                            {this.activePlugins.includes(plugin.id) ? (
                              <span className="status active">
                                <i className="fa fa-check" /> Active
                              </span>
                            ) : (
                              <span className="status inactive">Inactive</span>
                            )}
                          </div>
                        </div>

                        <div className="plugin-controls">
                          {this.activePlugins.includes(plugin.id) ? (
                            <button
                              className="control-btn deactivate"
                              onClick={() => this.deactivatePlugin(plugin.id)}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              className="control-btn activate"
                              onClick={() => this.activatePlugin(plugin.id)}
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="editor-container">
            <div className="editor-toolbar">
              <div className="video-integration">
                <h4>Sendspark Video Integration</h4>
                <button
                  className="add-video-btn"
                  onClick={() => {
                    // Simulate adding a video from Sendspark
                    const mockVideo = {
                      id: 'video_' + Date.now(),
                      title: 'New Sendspark Video',
                      url: 'https://sendspark.com/video/sample.mp4',
                      thumbnail: '/video-thumb.jpg'
                    };
                    this.addSendsparkVideo(mockVideo);
                  }}
                >
                  <i className="fa fa-plus" /> Add Sendspark Video
                </button>
              </div>

              <div className="personalization-integration">
                <h4>Personalization Rules</h4>
                <button
                  className="add-rule-btn"
                  onClick={() => {
                    const mockRule = {
                      id: 'rule_' + Date.now(),
                      name: 'User Name Personalization',
                      trigger: 'user-property',
                      property: 'user-name',
                      replacements: { 'user.name': 'John Doe' }
                    };
                    this.createPersonalizationRule(mockRule);
                  }}
                >
                  <i className="fa fa-plus" /> Add Personalization Rule
                </button>
              </div>
            </div>

            <div
              id="grapesjs-editor"
              ref={this.containerRef}
              className="grapesjs-editor"
              style={{ height: '600px', border: '1px solid #ddd' }}
            >
              {/* GrapesJS will initialize here */}
            </div>
          </div>
        </div>

        <style jsx>{`
          .grapesjs-plugin-manager {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .plugin-manager-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .plugin-manager-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .header-stats {
            display: flex;
            gap: 20px;
          }

          .stat {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #6c757d;
          }

          .plugin-manager-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .plugins-sidebar {
            width: 300px;
            background: white;
            border-right: 1px solid #e9ecef;
            overflow-y: auto;
          }

          .plugins-categories {
            padding: 20px;
          }

          .category-section {
            margin-bottom: 24px;
          }

          .category-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 12px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .category-count {
            font-size: 12px;
            color: #6c757d;
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 10px;
          }

          .category-plugins {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .plugin-item {
            padding: 12px;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .plugin-info h4 {
            margin: 0 0 4px 0;
            font-size: 14px;
            font-weight: 500;
          }

          .plugin-status .status {
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 10px;
          }

          .status.active {
            background: #d4edda;
            color: #155724;
          }

          .status.inactive {
            background: #f8f9fa;
            color: #6c757d;
          }

          .plugin-controls {
            display: flex;
            gap: 6px;
          }

          .control-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
          }

          .control-btn.activate {
            background: #007bff;
            color: white;
          }

          .control-btn.deactivate {
            background: #6c757d;
            color: white;
          }

          .editor-container {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .editor-toolbar {
            padding: 16px 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            gap: 24px;
          }

          .video-integration h4,
          .personalization-integration h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
          }

          .add-video-btn,
          .add-rule-btn {
            padding: 8px 16px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .add-video-btn:hover,
          .add-rule-btn:hover {
            background: #218838;
          }

          .grapesjs-editor {
            flex: 1;
            background: white;
          }

          @media (max-width: 1200px) {
            .plugin-manager-content {
              flex-direction: column;
            }

            .plugins-sidebar {
              width: 100%;
              max-height: 300px;
            }

            .editor-toolbar {
              flex-direction: column;
              gap: 16px;
            }
          }
        `}</style>
      </div>
    );
  }
}

GrapesJSPluginManager.propTypes = {
  onPluginUpdate: PropTypes.func,
  className: PropTypes.string
};