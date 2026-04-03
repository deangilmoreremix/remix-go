import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

// Import all FREE official plugins
import grapesjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
import grapesjsPresetNewsletter from 'grapesjs-preset-newsletter';
import grapesjsPluginForms from 'grapesjs-plugin-forms';

// Import VERIFIED FREE plugins only
import grapesjsNavbar from 'grapesjs-navbar';
import grapesjsLorySlider from 'grapesjs-lory-slider';

// Import AI plugins
import grapesjsAICopilot from '@silexlabs/grapesjs-ai-copilot';

// Custom video integration for Sendspark enhancements
export const createVideoBlock = (editor) => {
  editor.BlockManager.add('sendspark-video', {
    label: 'Sendspark Video',
    category: 'Media',
    content: {
      type: 'video',
      attributes: {
        'data-sendspark-video': 'true',
        controls: true,
        preload: 'metadata'
      },
      style: {
        width: '100%',
        maxWidth: '640px',
        height: 'auto'
      }
    },
    attributes: {
      title: 'Add your Sendspark video here'
    }
  });
};

// Custom personalization blocks
export const createPersonalizationBlocks = (editor) => {
  // Dynamic content block
  editor.BlockManager.add('personalized-content', {
    label: 'Personalized Content',
    category: 'Personalization',
    content: {
      type: 'text',
      content: 'Hello {{user.name}}! Welcome to {{company.name}}.',
      attributes: {
        'data-personalized': 'true'
      }
    }
  });

  // Conditional content block
  editor.BlockManager.add('conditional-content', {
    label: 'Conditional Content',
    category: 'Personalization',
    content: {
      type: 'div',
      attributes: {
        'data-condition': 'user.type === "premium"'
      },
      components: [
        {
          type: 'text',
          content: 'Premium user exclusive content!'
        }
      ]
    }
  });

  // Behavioral trigger block
  editor.BlockManager.add('behavioral-trigger', {
    label: 'Behavioral Trigger',
    category: 'Personalization',
    content: {
      type: 'div',
      attributes: {
        'data-behavior': 'scroll-depth',
        'data-threshold': '50'
      },
      components: [
        {
          type: 'text',
          content: 'You\'ve scrolled 50%! Here\'s a special offer.'
        }
      ]
    }
  });
};

// Enhanced video player with Sendspark integration
export const createSendsparkVideoPlayer = (editor) => {
  editor.DomComponents.addType('sendspark-video', {
    model: {
      defaults: {
        tagName: 'video',
        attributes: {
          'data-sendspark-video': 'true',
          controls: true,
          preload: 'metadata'
        },
        traits: [
          {
            type: 'text',
            label: 'Video URL',
            name: 'src',
            placeholder: 'Enter your Sendspark video URL'
          },
          {
            type: 'text',
            label: 'Poster Image',
            name: 'poster',
            placeholder: 'Thumbnail image URL'
          },
          {
            type: 'checkbox',
            label: 'Autoplay',
            name: 'autoplay'
          },
          {
            type: 'checkbox',
            label: 'Loop',
            name: 'loop'
          },
          {
            type: 'checkbox',
            label: 'Muted',
            name: 'muted'
          },
          {
            type: 'select',
            label: 'Personalization',
            name: 'personalization',
            options: [
              { value: '', name: 'None' },
              { value: 'user-name', name: 'Show user name' },
              { value: 'company', name: 'Company branding' },
              { value: 'location', name: 'Location-based' },
              { value: 'behavioral', name: 'Behavioral targeting' }
            ]
          }
        ]
      }
    },
    view: {
      onRender() {
        // Add Sendspark-specific styling and functionality
        this.el.style.borderRadius = '8px';
        this.el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

        // Add personalization logic
        const personalization = this.model.get('attributes').personalization;
        if (personalization) {
          this.addPersonalization(personalization);
        }
      },

      addPersonalization(type) {
        const overlay = document.createElement('div');
        overlay.className = 'sendspark-video-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 10;
        `;

        switch (type) {
          case 'user-name':
            overlay.textContent = 'Personalized for {{user.name}}';
            break;
          case 'company':
            overlay.textContent = '{{company.name}} Video';
            break;
          case 'location':
            overlay.textContent = 'Local content for {{user.location}}';
            break;
          case 'behavioral':
            overlay.textContent = 'Based on your interests';
            break;
        }

        this.el.parentNode.style.position = 'relative';
        this.el.parentNode.appendChild(overlay);
      }
    }
  });
};

// Analytics integration for video performance
export const addVideoAnalytics = (editor) => {
  editor.on('component:selected', (component) => {
    if (component.get('attributes')['data-sendspark-video']) {
      // Add analytics tracking for video engagement
      component.view.$el.on('play pause ended', (e) => {
        const event = {
          type: 'video_engagement',
          action: e.type,
          videoId: component.get('attributes').src,
          timestamp: Date.now(),
          userId: window.currentUser?.id
        };

        // Send to analytics service
        if (window.analytics) {
          window.analytics.track('Video Engagement', event);
        }
      });
    }
  });
};

// A/B testing integration for videos
export const addABTesting = (editor) => {
  editor.BlockManager.add('ab-test-video', {
    label: 'A/B Test Videos',
    category: 'Testing',
    content: {
      type: 'div',
      attributes: {
        'data-ab-test': 'video-variants',
        'data-variant-a': '',
        'data-variant-b': ''
      },
      components: [
        {
          type: 'text',
          content: 'A/B Test: Video Variant A vs B'
        }
      ]
    }
  });
};

// Conversion funnel integration
export const addConversionTracking = (editor) => {
  editor.on('component:add', (component) => {
    if (component.get('attributes')['data-sendspark-video']) {
      // Add conversion tracking
      const conversionPixel = document.createElement('img');
      conversionPixel.src = 'https://tracking.sendspark.com/pixel?event=video_view';
      conversionPixel.style.display = 'none';
      document.body.appendChild(conversionPixel);

      // Track funnel progress
      component.view.$el.on('ended', () => {
        if (window.funnelTracker) {
          window.funnelTracker.track('video_completion', {
            videoId: component.get('attributes').src,
            userJourney: window.userJourney || []
          });
        }
      });
    }
  });
};

// Complete GrapesJS configuration with ALL free plugins
export const createCompleteGrapesJSConfig = (containerId, options = {}) => {
  const defaultConfig = {
    container: containerId,
    height: '100vh',
    width: 'auto',

    // VERIFIED FREE PLUGINS INCLUDED
    plugins: [
      // Official core plugins (these are imported at the top)
      'grapesjs-blocks-basic',
      'grapesjs-preset-webpage',
      'grapesjs-preset-newsletter',
      'grapesjs-plugin-forms',

      // UI component plugins
      grapesjsNavbar,
      grapesjsLorySlider,

      // AI plugins (free)
      grapesjsAICopilot
    ],

    // Plugin configurations (only for available plugins)
    pluginsOpts: {
      'grapesjs-blocks-basic': {
        blocks: ['column1', 'column2', 'column3', 'column4', 'text', 'link', 'image', 'video', 'map'],
        flexGrid: false,
        stylePrefix: 'gjs-',
        addBasicStyle: true,
        category: 'Basic',
        labelColumn1: '1 Column',
        labelColumn2: '2 Columns',
        labelColumn3: '3 Columns',
        labelColumn4: '4 Columns'
      },

      'grapesjs-preset-webpage': {
        blocks: [],
        modalImportTitle: 'Import Template',
        modalImportButton: 'Import',
        modalImportLabel: '',
        modalImportContent: '',
        importViewerOptions: {},
        textCleanCanvas: 'Are you sure you want to clear the canvas?',
        showStylesOnLoad: 1,
        useCustomTheme: 1
      },

      [grapesjsAICopilot]: {
        apiKey: process.env.OPENAI_API_KEY || options.aiApiKey,
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 2000
      },

      [grapesjsNavbar]: {
        // Navbar plugin configuration
      },

      [grapesjsLorySlider]: {
        // Slider plugin configuration
      }
    },

    // Enhanced asset manager for videos
    assetManager: {
      assets: [],
      noAssets: 'No assets found',
      upload: '/api/upload',
      uploadName: 'files',
      headers: {},
      params: {},
      credentials: 'include',
      multiUpload: true,
      uploadFile: (e) => {
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }

        return fetch('/api/upload', {
          method: 'POST',
          body: formData
        }).then(res => res.json());
      },

      // Custom video asset handling
      customVideoAssets: true,
      videoUploadEndpoint: '/api/videos/upload',
      sendsparkIntegration: true
    },

    // Enhanced storage with video support
    storageManager: {
      type: 'remote',
      autosave: true,
      autoload: true,
      stepsBeforeSave: 1,
      urlStore: '/api/grapesjs/store',
      urlLoad: '/api/grapesjs/load',
      params: {},
      headers: {},

      // Video-specific storage
      storeVideoData: true,
      videoStorageEndpoint: '/api/videos/store'
    },

    // Device manager for responsive video testing
    deviceManager: {
      devices: [
        { name: 'Desktop', width: '' },
        { name: 'Tablet', width: '768px', widthMedia: '768px' },
        { name: 'Mobile', width: '320px', widthMedia: '320px' }
      ]
    },

    // Enhanced panels for video editing
    panels: {
      defaults: [
        {
          id: 'layers',
          el: '.panel__right',
          resizable: {
            tc: 0,
            cr: 1,
            bc: 0,
            bl: 0,
            keyWidth: 'flex-basis',
            minDim: 220,
            maxDim: 350
          }
        },
        {
          id: 'panel-switcher',
          el: '.panel__switcher',
          buttons: [
            {
              id: 'show-layers',
              active: true,
              label: 'Layers',
              command: 'show-layers',
              togglable: false
            },
            {
              id: 'show-style',
              active: true,
              label: 'Styles',
              command: 'show-styles',
              togglable: false
            },
            {
              id: 'show-traits',
              label: 'Traits',
              command: 'show-traits',
              togglable: false
            },
            {
              id: 'show-blocks',
              label: 'Blocks',
              command: 'show-blocks',
              togglable: false
            }
          ]
        }
      ]
    },

    // Enhanced canvas for video editing
    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
      ],
      scripts: [],

      // Video-specific canvas settings
      videoEditingEnabled: true,
      sendsparkVideoSupport: true,
      personalizationPreview: true
    },

    // Custom commands for video operations
    commands: {
      defaults: [
        {
          id: 'sendspark-video-insert',
          run: (editor) => {
            const selected = editor.getSelected();
            if (selected) {
              selected.components().add({
                type: 'sendspark-video',
                attributes: {
                  'data-sendspark-video': 'true',
                  controls: true
                }
              });
            }
          }
        },
        {
          id: 'personalization-toggle',
          run: (editor) => {
            const canvas = editor.Canvas;
            canvas.set('personalizationPreview', !canvas.get('personalizationPreview'));
          }
        }
      ]
    }
  };

  return { ...defaultConfig, ...options };
};

// Initialize complete GrapesJS with all features
export const initializeCompleteGrapesJS = (containerId, options = {}) => {
  const config = createCompleteGrapesJSConfig(containerId, options);
  const editor = grapesjs.init(config);

  // Add custom video blocks
  createVideoBlock(editor);
  createPersonalizationBlocks(editor);
  createSendsparkVideoPlayer(editor);

  // Add integrations
  addVideoAnalytics(editor);
  addABTesting(editor);
  addConversionTracking(editor);

  // Load free templates
  loadFreeTemplates(editor);

  return editor;
};

// Load free templates from various sources
const loadFreeTemplates = async (editor) => {
  const templateSources = [
    'https://raw.githubusercontent.com/GrapesJS/preset-webpage/master/templates/',
    'https://raw.githubusercontent.com/dipaksarkar/grapesjs-templates/main/templates/',
    'https://raw.githubusercontent.com/cofess/grapesjs-demo/master/templates/'
  ];

  for (const source of templateSources) {
    try {
      const response = await fetch(source + 'index.json');
      if (response.ok) {
        const templates = await response.json();
        templates.forEach(template => {
          editor.templates.add(template.id, template);
        });
      }
    } catch (error) {
      console.log('Template source not available:', source);
    }
  }
};

// Export everything
export default {
  initializeCompleteGrapesJS,
  createCompleteGrapesJSConfig,
  createVideoBlock,
  createPersonalizationBlocks,
  createSendsparkVideoPlayer,
  addVideoAnalytics,
  addABTesting,
  addConversionTracking
};