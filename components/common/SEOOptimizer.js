import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class SEOOptimizer extends Component {
  @observable
  seoConfig = {
    meta: {
      title: '',
      description: '',
      keywords: '',
      author: '',
      robots: 'index,follow',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogUrl: '',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: ''
    },
    content: {
      h1Count: 0,
      h2Count: 0,
      wordCount: 0,
      readingTime: 0,
      keywordDensity: {},
      readabilityScore: 0,
      internalLinks: 0,
      externalLinks: 0,
      imagesWithAlt: 0,
      totalImages: 0
    },
    technical: {
      pageSpeedScore: 0,
      mobileFriendly: true,
      sslEnabled: true,
      sitemap: true,
      robotsTxt: true,
      structuredData: [],
      coreWebVitals: {
        lcp: 0,
        fid: 0,
        cls: 0
      }
    },
    keywords: {
      primary: '',
      secondary: [],
      longTail: [],
      searchVolume: 0,
      competition: 'low'
    },
    recommendations: []
  };

  @observable
  activeTab = 'meta';

  @observable
  contentAnalysis = '';

  @observable
  isAnalyzing = false;

  @observable
  analysisResults = null;

  structuredDataTypes = [
    { id: 'organization', name: 'Organization', icon: 'fa-building' },
    { id: 'website', name: 'Website', icon: 'fa-globe' },
    { id: 'article', name: 'Article', icon: 'fa-newspaper' },
    { id: 'product', name: 'Product', icon: 'fa-shopping-cart' },
    { id: 'event', name: 'Event', icon: 'fa-calendar' },
    { id: 'local-business', name: 'Local Business', icon: 'fa-map-marker' },
    { id: 'breadcrumb', name: 'Breadcrumb', icon: 'fa-link' },
    { id: 'faq', name: 'FAQ', icon: 'fa-question-circle' },
    { id: 'review', name: 'Review', icon: 'fa-star' }
  ];

  @action
  updateSEOConfig = (path, value) => {
    const keys = path.split('.');
    let current = this.seoConfig;

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
  analyzeContent = async () => {
    this.isAnalyzing = true;

    try {
      // Simulate content analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      const content = this.contentAnalysis;
      const words = content.split(/\s+/).filter(word => word.length > 0);
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

      // Basic readability calculation (Flesch Reading Ease)
      const avgWordsPerSentence = words.length / sentences.length;
      const avgSyllablesPerWord = this.calculateAverageSyllables(words);
      const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

      // Keyword density analysis
      const keywordDensity = this.analyzeKeywordDensity(words);

      // Update SEO config with analysis results
      this.updateSEOConfig('content.wordCount', words.length);
      this.updateSEOConfig('content.readingTime', Math.ceil(words.length / 200)); // 200 words per minute
      this.updateSEOConfig('content.readabilityScore', Math.max(0, Math.min(100, readabilityScore)));
      this.updateSEOConfig('content.keywordDensity', keywordDensity);

      // Generate recommendations
      this.generateRecommendations();

      this.analysisResults = {
        score: Math.round((readabilityScore + (keywordDensity.primary ? 20 : 0) + (words.length > 300 ? 20 : 0)) / 3),
        issues: this.generateIssuesList(),
        suggestions: this.generateSuggestions()
      };

    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      this.isAnalyzing = false;
    }
  };

  calculateAverageSyllables = (words) => {
    const syllableCount = words.reduce((total, word) => {
      return total + this.countSyllables(word.toLowerCase());
    }, 0);
    return syllableCount / words.length;
  };

  countSyllables = (word) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    const vowels = 'aeiouy';
    let syllableCount = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllableCount++;
      }
      previousWasVowel = isVowel;
    }

    // Adjust for silent 'e'
    if (word.endsWith('e')) {
      syllableCount--;
    }

    // Ensure at least one syllable
    return Math.max(1, syllableCount);
  };

  analyzeKeywordDensity = (words) => {
    const wordFreq = {};
    const totalWords = words.length;

    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 2) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    const density = {};
    Object.entries(wordFreq).forEach(([word, count]) => {
      density[word] = ((count / totalWords) * 100).toFixed(2);
    });

    return density;
  };

  generateRecommendations = () => {
    const recommendations = [];

    if (this.seoConfig.meta.title.length === 0) {
      recommendations.push({
        type: 'error',
        message: 'Meta title is missing',
        fix: 'Add a compelling title (50-60 characters)'
      });
    } else if (this.seoConfig.meta.title.length > 60) {
      recommendations.push({
        type: 'warning',
        message: 'Meta title is too long',
        fix: 'Shorten to 50-60 characters'
      });
    }

    if (this.seoConfig.meta.description.length === 0) {
      recommendations.push({
        type: 'error',
        message: 'Meta description is missing',
        fix: 'Add a description (150-160 characters)'
      });
    } else if (this.seoConfig.meta.description.length > 160) {
      recommendations.push({
        type: 'warning',
        message: 'Meta description is too long',
        fix: 'Shorten to 150-160 characters'
      });
    }

    if (this.seoConfig.content.readabilityScore < 60) {
      recommendations.push({
        type: 'warning',
        message: 'Content readability can be improved',
        fix: 'Use shorter sentences and simpler words'
      });
    }

    if (this.seoConfig.content.wordCount < 300) {
      recommendations.push({
        type: 'info',
        message: 'Content is quite short',
        fix: 'Consider adding more content for better SEO'
      });
    }

    this.seoConfig.recommendations = recommendations;
  };

  generateIssuesList = () => {
    const issues = [];

    if (!this.seoConfig.meta.title) issues.push('Missing meta title');
    if (!this.seoConfig.meta.description) issues.push('Missing meta description');
    if (!this.seoConfig.meta.ogImage) issues.push('Missing Open Graph image');
    if (this.seoConfig.content.h1Count === 0) issues.push('No H1 tag found');
    if (this.seoConfig.content.h1Count > 1) issues.push('Multiple H1 tags found');

    return issues;
  };

  generateSuggestions = () => {
    return [
      'Add more internal links to improve site structure',
      'Optimize images with descriptive alt text',
      'Include long-tail keywords naturally in content',
      'Add schema markup for better rich snippets',
      'Improve page load speed for better user experience',
      'Create compelling meta descriptions for better CTR'
    ];
  };

  @action
  addStructuredData = (type) => {
    const newData = {
      id: `sd_${Date.now()}`,
      type,
      data: this.getDefaultStructuredData(type)
    };

    this.seoConfig.technical.structuredData.push(newData);
  };

  @action
  removeStructuredData = (index) => {
    this.seoConfig.technical.structuredData.splice(index, 1);
  };

  getDefaultStructuredData = (type) => {
    const defaults = {
      organization: {
        '@type': 'Organization',
        name: 'Your Company Name',
        url: 'https://yourwebsite.com',
        logo: 'https://yourwebsite.com/logo.png'
      },
      website: {
        '@type': 'WebSite',
        name: 'Your Website Name',
        url: 'https://yourwebsite.com'
      },
      article: {
        '@type': 'Article',
        headline: 'Article Title',
        author: { '@type': 'Person', name: 'Author Name' },
        datePublished: new Date().toISOString().split('T')[0]
      }
    };

    return defaults[type] || {};
  };

  @action
  exportSEOData = () => {
    const seoData = {
      metaTags: this.generateMetaTags(),
      structuredData: this.seoConfig.technical.structuredData,
      recommendations: this.seoConfig.recommendations
    };

    const dataStr = JSON.stringify(seoData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'seo-optimization.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  generateMetaTags = () => {
    const { meta } = this.seoConfig;
    const tags = [];

    if (meta.title) tags.push(`<title>${meta.title}</title>`);
    if (meta.description) tags.push(`<meta name="description" content="${meta.description}">`);
    if (meta.keywords) tags.push(`<meta name="keywords" content="${meta.keywords}">`);
    if (meta.author) tags.push(`<meta name="author" content="${meta.author}">`);
    if (meta.robots) tags.push(`<meta name="robots" content="${meta.robots}">`);
    if (meta.canonical) tags.push(`<link rel="canonical" href="${meta.canonical}">`);

    // Open Graph
    if (meta.ogTitle) tags.push(`<meta property="og:title" content="${meta.ogTitle}">`);
    if (meta.ogDescription) tags.push(`<meta property="og:description" content="${meta.ogDescription}">`);
    if (meta.ogImage) tags.push(`<meta property="og:image" content="${meta.ogImage}">`);
    if (meta.ogUrl) tags.push(`<meta property="og:url" content="${meta.ogUrl}">`);

    // Twitter Card
    tags.push(`<meta name="twitter:card" content="${meta.twitterCard}">`);
    if (meta.twitterTitle) tags.push(`<meta name="twitter:title" content="${meta.twitterTitle}">`);
    if (meta.twitterDescription) tags.push(`<meta name="twitter:description" content="${meta.twitterDescription}">`);
    if (meta.twitterImage) tags.push(`<meta name="twitter:image" content="${meta.twitterImage}">`);

    return tags;
  };

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('seo-optimizer', className)}>
        <div className="optimizer-header">
          <h2>SEO Optimizer</h2>
          <div className="header-actions">
            <button className="action-btn" onClick={this.exportSEOData}>
              <i className="fa fa-download" /> Export
            </button>
            <button className="action-btn primary" onClick={() => this.props.onSEOApply?.(this.seoConfig)}>
              <i className="fa fa-plus" /> Apply SEO
            </button>
          </div>
        </div>

        <div className="optimizer-content">
          <div className="optimizer-tabs">
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'meta' })}
              onClick={() => this.setActiveTab('meta')}
            >
              <i className="fa fa-tag" /> Meta Tags
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'content' })}
              onClick={() => this.setActiveTab('content')}
            >
              <i className="fa fa-file-text" /> Content
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'keywords' })}
              onClick={() => this.setActiveTab('keywords')}
            >
              <i className="fa fa-search" /> Keywords
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'technical' })}
              onClick={() => this.setActiveTab('technical')}
            >
              <i className="fa fa-cog" /> Technical
            </button>
            <button
              className={classnames('tab-btn', { active: this.activeTab === 'analysis' })}
              onClick={() => this.setActiveTab('analysis')}
            >
              <i className="fa fa-chart-bar" /> Analysis
            </button>
          </div>

          <div className="optimizer-panel">
            {this.activeTab === 'meta' && this.renderMetaTab()}
            {this.activeTab === 'content' && this.renderContentTab()}
            {this.activeTab === 'keywords' && this.renderKeywordsTab()}
            {this.activeTab === 'technical' && this.renderTechnicalTab()}
            {this.activeTab === 'analysis' && this.renderAnalysisTab()}
          </div>

          <div className="optimizer-preview">
            <div className="seo-score">
              <div className="score-circle">
                <div className="score-number">
                  {this.analysisResults?.score || 0}
                </div>
                <div className="score-label">SEO Score</div>
              </div>
            </div>

            <div className="seo-metrics">
              <div className="metric">
                <div className="metric-value">{this.seoConfig.content.wordCount}</div>
                <div className="metric-label">Words</div>
              </div>
              <div className="metric">
                <div className="metric-value">{this.seoConfig.content.readingTime}min</div>
                <div className="metric-label">Read Time</div>
              </div>
              <div className="metric">
                <div className="metric-value">{Math.round(this.seoConfig.content.readabilityScore)}</div>
                <div className="metric-label">Readability</div>
              </div>
            </div>

            {this.analysisResults && (
              <div className="analysis-results">
                <h4>Analysis Results</h4>

                {this.analysisResults.issues.length > 0 && (
                  <div className="issues-section">
                    <h5>Issues Found</h5>
                    <ul>
                      {this.analysisResults.issues.map((issue, index) => (
                        <li key={index} className="issue-item error">
                          <i className="fa fa-exclamation-triangle" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="suggestions-section">
                  <h5>Suggestions</h5>
                  <ul>
                    {this.analysisResults.suggestions.map((suggestion, index) => (
                      <li key={index} className="suggestion-item">
                        <i className="fa fa-lightbulb" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .seo-optimizer {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .optimizer-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .optimizer-header h2 {
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

          .optimizer-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .optimizer-tabs {
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

          .optimizer-panel {
            width: 400px;
            background: white;
            border-right: 1px solid #e9ecef;
            overflow-y: auto;
            padding: 20px;
          }

          .optimizer-preview {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          .seo-score {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
          }

          .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .score-number {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 4px;
          }

          .score-label {
            font-size: 12px;
            opacity: 0.9;
          }

          .seo-metrics {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 30px;
          }

          .metric {
            text-align: center;
          }

          .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 4px;
          }

          .metric-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
          }

          .analysis-results {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .analysis-results h4 {
            margin: 0 0 20px 0;
            color: #212529;
          }

          .issues-section, .suggestions-section {
            margin-bottom: 20px;
          }

          .issues-section h5, .suggestions-section h5 {
            margin: 0 0 10px 0;
            color: #495057;
            font-size: 14px;
          }

          .issues-section ul, .suggestions-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .issue-item, .suggestion-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 8px 0;
            font-size: 14px;
          }

          .issue-item.error {
            color: #dc3545;
          }

          .suggestion-item {
            color: #17a2b8;
          }

          .issue-item i, .suggestion-item i {
            margin-top: 2px;
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

          .character-count {
            font-size: 12px;
            color: #6c757d;
            text-align: right;
            margin-top: 4px;
          }

          .keyword-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
          }

          .keyword-tag {
            background: #e9ecef;
            color: #495057;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .keyword-tag.primary {
            background: #007bff;
            color: white;
          }

          .structured-data-list {
            margin-top: 12px;
          }

          .structured-data-item {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 8px;
          }

          .structured-data-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .structured-data-type {
            font-weight: 500;
            color: #495057;
          }

          .remove-sd {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
          }

          .add-sd-btn {
            padding: 8px 12px;
            border: 1px solid #007bff;
            background: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }

          .analysis-input {
            margin-bottom: 16px;
          }

          .analyze-btn {
            padding: 12px 24px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
          }

          .analyze-btn:hover {
            background: #218838;
          }

          .analyze-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
          }

          @media (max-width: 1200px) {
            .optimizer-content {
              flex-direction: column;
            }

            .optimizer-tabs, .optimizer-panel {
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #e9ecef;
            }

            .optimizer-tabs {
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

            .seo-metrics {
              flex-wrap: wrap;
              gap: 20px;
            }
          }
        `}</style>
      </div>
    );
  }

  renderMetaTab() {
    const { meta } = this.seoConfig;

    return (
      <div className="meta-tab">
        <div className="form-group">
          <label>Page Title</label>
          <input
            type="text"
            value={meta.title}
            onChange={(e) => this.updateSEOConfig('meta.title', e.target.value)}
            placeholder="Your page title (50-60 characters)"
          />
          <div className="character-count">
            {meta.title.length}/60 characters
          </div>
        </div>

        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            value={meta.description}
            onChange={(e) => this.updateSEOConfig('meta.description', e.target.value)}
            placeholder="Brief description of your page (150-160 characters)"
            rows={3}
          />
          <div className="character-count">
            {meta.description.length}/160 characters
          </div>
        </div>

        <div className="form-group">
          <label>Keywords</label>
          <input
            type="text"
            value={meta.keywords}
            onChange={(e) => this.updateSEOConfig('meta.keywords', e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            value={meta.author}
            onChange={(e) => this.updateSEOConfig('meta.author', e.target.value)}
            placeholder="Your name or company"
          />
        </div>

        <div className="form-group">
          <label>Robots</label>
          <select
            value={meta.robots}
            onChange={(e) => this.updateSEOConfig('meta.robots', e.target.value)}
          >
            <option value="index,follow">Index, Follow</option>
            <option value="noindex,follow">No Index, Follow</option>
            <option value="index,nofollow">Index, No Follow</option>
            <option value="noindex,nofollow">No Index, No Follow</option>
          </select>
        </div>

        <div className="form-group">
          <label>Canonical URL</label>
          <input
            type="url"
            value={meta.canonical}
            onChange={(e) => this.updateSEOConfig('meta.canonical', e.target.value)}
            placeholder="https://yourwebsite.com/page"
          />
        </div>

        <div className="social-section">
          <h4>Open Graph (Facebook)</h4>
          <div className="form-group">
            <label>OG Title</label>
            <input
              type="text"
              value={meta.ogTitle}
              onChange={(e) => this.updateSEOConfig('meta.ogTitle', e.target.value)}
              placeholder="Title for social sharing"
            />
          </div>

          <div className="form-group">
            <label>OG Description</label>
            <textarea
              value={meta.ogDescription}
              onChange={(e) => this.updateSEOConfig('meta.ogDescription', e.target.value)}
              placeholder="Description for social sharing"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>OG Image URL</label>
            <input
              type="url"
              value={meta.ogImage}
              onChange={(e) => this.updateSEOConfig('meta.ogImage', e.target.value)}
              placeholder="https://yourwebsite.com/image.jpg"
            />
          </div>

          <h4>Twitter Cards</h4>
          <div className="form-group">
            <label>Twitter Card Type</label>
            <select
              value={meta.twitterCard}
              onChange={(e) => this.updateSEOConfig('meta.twitterCard', e.target.value)}
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="app">App</option>
              <option value="player">Player</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  renderContentTab() {
    return (
      <div className="content-tab">
        <div className="analysis-input">
          <h4>Content Analysis</h4>
          <textarea
            value={this.contentAnalysis}
            onChange={(e) => this.contentAnalysis = e.target.value}
            placeholder="Paste your content here for SEO analysis..."
            rows={8}
          />
          <button
            className="analyze-btn"
            onClick={this.analyzeContent}
            disabled={this.isAnalyzing || !this.contentAnalysis.trim()}
          >
            <i className="fa fa-search" />
            {this.isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
          </button>
        </div>

        <div className="content-metrics">
          <h4>Content Metrics</h4>
          <div className="metric-grid">
            <div className="metric-item">
              <div className="metric-value">{this.seoConfig.content.wordCount}</div>
              <div className="metric-label">Word Count</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{this.seoConfig.content.readingTime}min</div>
              <div className="metric-label">Reading Time</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{Math.round(this.seoConfig.content.readabilityScore)}</div>
              <div className="metric-label">Readability Score</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderKeywordsTab() {
    return (
      <div className="keywords-tab">
        <div className="form-group">
          <label>Primary Keyword</label>
          <input
            type="text"
            value={this.seoConfig.keywords.primary}
            onChange={(e) => this.updateSEOConfig('keywords.primary', e.target.value)}
            placeholder="your main keyword"
          />
        </div>

        <div className="form-group">
          <label>Secondary Keywords</label>
          <textarea
            value={this.seoConfig.keywords.secondary.join(', ')}
            onChange={(e) => this.updateSEOConfig('keywords.secondary', e.target.value.split(',').map(k => k.trim()))}
            placeholder="keyword1, keyword2, keyword3"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Long-tail Keywords</label>
          <textarea
            value={this.seoConfig.keywords.longTail.join('\n')}
            onChange={(e) => this.updateSEOConfig('keywords.longTail', e.target.value.split('\n').map(k => k.trim()))}
            placeholder="how to do something specific&#10;best way to achieve goal&#10;specific long tail keyword"
            rows={4}
          />
        </div>

        <div className="keyword-density">
          <h4>Keyword Density</h4>
          {Object.entries(this.seoConfig.content.keywordDensity).slice(0, 10).map(([keyword, density]) => (
            <div key={keyword} className="density-item">
              <span className="keyword">{keyword}</span>
              <span className="density">{density}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderTechnicalTab() {
    return (
      <div className="technical-tab">
        <div className="technical-metrics">
          <h4>Performance Metrics</h4>
          <div className="metric-item">
            <label>Page Speed Score</label>
            <input
              type="number"
              min="0"
              max="100"
              value={this.seoConfig.technical.pageSpeedScore}
              onChange={(e) => this.updateSEOConfig('technical.pageSpeedScore', parseInt(e.target.value))}
            />
          </div>

          <div className="metric-item">
            <label>Mobile Friendly</label>
            <input
              type="checkbox"
              checked={this.seoConfig.technical.mobileFriendly}
              onChange={(e) => this.updateSEOConfig('technical.mobileFriendly', e.target.checked)}
            />
          </div>

          <div className="metric-item">
            <label>SSL Enabled</label>
            <input
              type="checkbox"
              checked={this.seoConfig.technical.sslEnabled}
              onChange={(e) => this.updateSEOConfig('technical.sslEnabled', e.target.checked)}
            />
          </div>
        </div>

        <div className="structured-data-section">
          <h4>Structured Data</h4>
          <div className="structured-data-list">
            {this.seoConfig.technical.structuredData.map((sd, index) => (
              <div key={sd.id} className="structured-data-item">
                <div className="structured-data-header">
                  <span className="structured-data-type">{sd.type}</span>
                  <button
                    className="remove-sd"
                    onClick={() => this.removeStructuredData(index)}
                  >
                    Remove
                  </button>
                </div>
                <pre>{JSON.stringify(sd.data, null, 2)}</pre>
              </div>
            ))}
          </div>

          <div className="add-structured-data">
            <h5>Add Structured Data</h5>
            <div className="sd-types">
              {this.structuredDataTypes.map(type => (
                <button
                  key={type.id}
                  className="add-sd-btn"
                  onClick={() => this.addStructuredData(type.id)}
                >
                  <i className={`fa ${type.icon}`} />
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderAnalysisTab() {
    return (
      <div className="analysis-tab">
        <div className="recommendations-section">
          <h4>SEO Recommendations</h4>
          {this.seoConfig.recommendations.length === 0 ? (
            <p>No recommendations yet. Add content and meta tags to get personalized suggestions.</p>
          ) : (
            <div className="recommendations-list">
              {this.seoConfig.recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-item ${rec.type}`}>
                  <div className="rec-icon">
                    <i className={`fa ${
                      rec.type === 'error' ? 'fa-exclamation-triangle' :
                      rec.type === 'warning' ? 'fa-exclamation-circle' :
                      'fa-info-circle'
                    }`} />
                  </div>
                  <div className="rec-content">
                    <div className="rec-message">{rec.message}</div>
                    <div className="rec-fix">{rec.fix}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="seo-checklist">
          <h4>SEO Checklist</h4>
          <div className="checklist-items">
            <div className="checklist-item">
              <input type="checkbox" checked={!!this.seoConfig.meta.title} readOnly />
              <label>Meta title optimized (50-60 chars)</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" checked={!!this.seoConfig.meta.description} readOnly />
              <label>Meta description added (150-160 chars)</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" checked={!!this.seoConfig.keywords.primary} readOnly />
              <label>Primary keyword selected</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" checked={this.seoConfig.content.wordCount > 300} readOnly />
              <label>Content length sufficient (>300 words)</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" checked={this.seoConfig.content.h1Count === 1} readOnly />
              <label>Single H1 tag present</label>
            </div>
            <div className="checklist-item">
              <input type="checkbox" checked={!!this.seoConfig.meta.ogImage} readOnly />
              <label>Open Graph image set</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SEOOptimizer.propTypes = {
  onSEOApply: PropTypes.func,
  className: PropTypes.string
};