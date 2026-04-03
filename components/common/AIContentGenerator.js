import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class AIContentGenerator extends Component {
  @observable
  contentType = 'blog-post'; // blog-post, social-media, email, product-description, headline, ad-copy

  @observable
  prompt = '';

  @observable
  tone = 'professional'; // professional, casual, friendly, formal, enthusiastic, serious

  @observable
  length = 'medium'; // short, medium, long

  @observable
  audience = 'general'; // general, business, students, seniors, tech-savvy

  @observable
  keywords = '';

  @observable
  isGenerating = false;

  @observable
  generatedContent = '';

  @observable
  contentHistory = [];

  @observable
  selectedTemplate = null;

  @observable
  showTemplates = false;

  @observable
  customInstructions = '';

  contentTypes = [
    { id: 'blog-post', name: 'Blog Post', icon: 'fa-newspaper', description: 'Complete blog article with introduction, body, and conclusion' },
    { id: 'social-media', name: 'Social Media Post', icon: 'fa-share-alt', description: 'Engaging posts for platforms like Twitter, Facebook, LinkedIn' },
    { id: 'email', name: 'Email Campaign', icon: 'fa-envelope', description: 'Marketing emails, newsletters, and promotional content' },
    { id: 'product-description', name: 'Product Description', icon: 'fa-shopping-cart', description: 'Detailed product descriptions with features and benefits' },
    { id: 'headline', name: 'Headlines & Titles', icon: 'fa-heading', description: 'Attention-grabbing headlines and titles' },
    { id: 'ad-copy', name: 'Ad Copy', icon: 'fa-bullhorn', description: 'Persuasive advertising copy for campaigns' },
    { id: 'landing-page', name: 'Landing Page Copy', icon: 'fa-rocket', description: 'Conversion-focused landing page content' },
    { id: 'seo-content', name: 'SEO Content', icon: 'fa-search', description: 'Search engine optimized content with keywords' },
    { id: 'video-script', name: 'Video Script', icon: 'fa-video', description: 'Scripts for videos, tutorials, and presentations' },
    { id: 'faq', name: 'FAQ Content', icon: 'fa-question-circle', description: 'Frequently asked questions and answers' }
  ];

  tones = [
    { id: 'professional', name: 'Professional', description: 'Business-like, formal, and authoritative' },
    { id: 'casual', name: 'Casual', description: 'Relaxed, conversational, and approachable' },
    { id: 'friendly', name: 'Friendly', description: 'Warm, welcoming, and personable' },
    { id: 'formal', name: 'Formal', description: 'Traditional, proper, and structured' },
    { id: 'enthusiastic', name: 'Enthusiastic', description: 'Energetic, excited, and motivational' },
    { id: 'serious', name: 'Serious', description: 'Solemn, thoughtful, and analytical' },
    { id: 'humorous', name: 'Humorous', description: 'Funny, light-hearted, and entertaining' },
    { id: 'persuasive', name: 'Persuasive', description: 'Convincing, compelling, and influential' }
  ];

  lengths = [
    { id: 'short', name: 'Short', description: '50-150 words', words: '50-150' },
    { id: 'medium', name: 'Medium', description: '200-500 words', words: '200-500' },
    { id: 'long', name: 'Long', description: '600-1000 words', words: '600-1000' },
    { id: 'extra-long', name: 'Extra Long', description: '1000+ words', words: '1000+' }
  ];

  audiences = [
    { id: 'general', name: 'General Public', description: 'Broad audience with varied interests' },
    { id: 'business', name: 'Business Professionals', description: 'Corporate executives, managers, entrepreneurs' },
    { id: 'students', name: 'Students', description: 'College/university students and researchers' },
    { id: 'seniors', name: 'Seniors', description: 'Older adults, retirees, senior citizens' },
    { id: 'tech-savvy', name: 'Tech Enthusiasts', description: 'Technology professionals and hobbyists' },
    { id: 'parents', name: 'Parents', description: 'Families with children, parenting community' },
    { id: 'millennials', name: 'Millennials', description: 'Young adults aged 25-40' },
    { id: 'gen-z', name: 'Gen Z', description: 'Young people aged 18-24' }
  ];

  templates = [
    {
      id: 'how-to-guide',
      name: 'How-To Guide',
      type: 'blog-post',
      prompt: 'Write a comprehensive guide on [TOPIC] that includes step-by-step instructions, tips, and common mistakes to avoid.',
      keywords: ['tutorial', 'guide', 'how-to', 'step-by-step']
    },
    {
      id: 'product-review',
      name: 'Product Review',
      type: 'blog-post',
      prompt: 'Create an honest review of [PRODUCT] covering its features, pros and cons, pricing, and who it\'s best suited for.',
      keywords: ['review', 'product', 'features', 'comparison']
    },
    {
      id: 'industry-trends',
      name: 'Industry Trends',
      type: 'blog-post',
      prompt: 'Analyze the latest trends in [INDUSTRY] including emerging technologies, market changes, and future predictions.',
      keywords: ['trends', 'industry', 'analysis', 'future']
    },
    {
      id: 'social-post',
      name: 'Engaging Social Post',
      type: 'social-media',
      prompt: 'Create an engaging social media post about [TOPIC] that encourages interaction and shares.',
      keywords: ['social media', 'engagement', 'viral', 'share']
    },
    {
      id: 'email-newsletter',
      name: 'Newsletter Campaign',
      type: 'email',
      prompt: 'Write a compelling newsletter about [TOPIC] with engaging content, calls-to-action, and value for subscribers.',
      keywords: ['newsletter', 'email', 'campaign', 'subscribers']
    },
    {
      id: 'product-launch',
      name: 'Product Launch Copy',
      type: 'ad-copy',
      prompt: 'Create persuasive advertising copy for launching [PRODUCT] that highlights unique features and creates urgency.',
      keywords: ['launch', 'product', 'advertising', 'urgency']
    }
  ];

  @action
  setContentType = (type) => {
    this.contentType = type;
    this.generatedContent = '';
    this.selectedTemplate = null;
  };

  @action
  updatePrompt = (prompt) => {
    this.prompt = prompt;
  };

  @action
  setTone = (tone) => {
    this.tone = tone;
  };

  @action
  setLength = (length) => {
    this.length = length;
  };

  @action
  setAudience = (audience) => {
    this.audience = audience;
  };

  @action
  updateKeywords = (keywords) => {
    this.keywords = keywords;
  };

  @action
  updateCustomInstructions = (instructions) => {
    this.customInstructions = instructions;
  };

  @action
  selectTemplate = (template) => {
    this.selectedTemplate = template;
    this.contentType = template.type;
    this.prompt = template.prompt;
    this.showTemplates = false;
  };

  @action
  toggleTemplates = () => {
    this.showTemplates = !this.showTemplates;
  };

  @action
  generateContent = async () => {
    if (!this.prompt.trim()) return;

    this.isGenerating = true;

    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const generated = this.generateMockContent();
      this.generatedContent = generated;

      // Add to history
      this.contentHistory.unshift({
        id: Date.now(),
        type: this.contentType,
        prompt: this.prompt,
        content: generated,
        timestamp: new Date().toISOString(),
        settings: {
          tone: this.tone,
          length: this.length,
          audience: this.audience,
          keywords: this.keywords
        }
      });

      // Keep only last 10 items
      if (this.contentHistory.length > 10) {
        this.contentHistory = this.contentHistory.slice(0, 10);
      }

    } catch (error) {
      console.error('Content generation failed:', error);
      this.generatedContent = 'Error generating content. Please try again.';
    } finally {
      this.isGenerating = false;
    }
  };

  generateMockContent = () => {
    const contentTypeData = this.contentTypes.find(ct => ct.id === this.contentType);

    switch (this.contentType) {
      case 'blog-post':
        return `# ${this.prompt}\n\n## Introduction\n\nIn today's fast-paced digital landscape, understanding ${this.prompt.toLowerCase()} has become crucial for success. This comprehensive guide will walk you through everything you need to know.\n\n## Key Benefits\n\n1. **Improved Efficiency**: Streamline your workflow\n2. **Cost Reduction**: Save time and resources\n3. **Better Results**: Achieve higher quality outcomes\n4. **Competitive Advantage**: Stay ahead of the curve\n\n## Step-by-Step Implementation\n\n### Step 1: Planning Phase\nBegin by assessing your current situation and defining clear objectives.\n\n### Step 2: Execution\nImplement the strategies discussed with careful attention to detail.\n\n### Step 3: Monitoring\nTrack your progress and make adjustments as needed.\n\n### Step 4: Optimization\nRefine your approach based on real-world results.\n\n## Conclusion\n\nMastering ${this.prompt.toLowerCase()} requires commitment and continuous learning. Start small, measure your progress, and scale what works. The investment in knowledge will pay dividends in the long run.\n\n*Keywords: ${this.keywords || 'content generation, AI, automation'}*`;

      case 'social-media':
        return `🚀 Exciting News! Just discovered an amazing approach to ${this.prompt.toLowerCase()} that could transform your workflow!\n\n💡 Key insights:\n• Streamlined processes\n• Better results\n• Time-saving techniques\n\nWhat are your thoughts on this? Have you tried something similar?\n\n#${this.keywords.split(',').map(k => k.trim().replace(/\s+/g, '')).join(' #')}\n\nLink in bio 👆`;

      case 'email':
        return `Subject: Transform Your ${this.prompt} Strategy Today\n\nDear [Recipient Name],\n\nI hope this email finds you well. I'm reaching out because I believe you might be interested in revolutionizing your approach to ${this.prompt.toLowerCase()}.\n\n**Why Change Matters Now**\n\nThe digital landscape is evolving rapidly, and staying ahead requires innovative solutions. Here's what you can achieve:\n\n✓ Improved efficiency by 40%\n✓ Cost reduction of up to 30%\n✓ Enhanced user experience\n✓ Competitive advantage\n\n**Our Solution**\n\nWe offer a comprehensive platform that addresses all your ${this.prompt.toLowerCase()} needs. Our AI-powered system provides:\n\n- Real-time analytics and insights\n- Automated optimization\n- Seamless integration\n- 24/7 support\n\n**Ready to Get Started?**\n\n[CTA Button: Start Free Trial]\n\nDon't miss this opportunity to transform your business.\n\nBest regards,\n[Your Name]\n[Your Position]\n[Contact Information]\n\nP.S. This offer is available for a limited time. Contact us today to learn more.`;

      case 'product-description':
        return `# ${this.prompt}\n\n## Overview\n\nIntroducing our revolutionary ${this.prompt.toLowerCase()} solution designed to meet the evolving needs of modern businesses. Built with cutting-edge technology and user-centric design.\n\n## Key Features\n\n### Advanced Functionality\n- **Smart Automation**: AI-powered workflow optimization\n- **Real-time Analytics**: Comprehensive insights and reporting\n- **Seamless Integration**: Works with your existing tools\n- **Cloud-Based**: Access anywhere, anytime\n\n### User Experience\n- **Intuitive Interface**: Easy to learn and use\n- **Mobile Optimized**: Perfect on any device\n- **Customizable**: Adapt to your specific needs\n- **Secure**: Enterprise-grade security\n\n## Benefits\n\n**For Businesses:**\n- Increase productivity by 300%\n- Reduce operational costs by 40%\n- Improve customer satisfaction\n- Scale efficiently\n\n**For Users:**\n- Simplified workflow\n- Faster results\n- Better collaboration\n- Enhanced creativity\n\n## Technical Specifications\n\n- **Compatibility**: Windows, macOS, Linux, Web\n- **Storage**: Unlimited cloud storage\n- **Security**: SSL encryption, GDPR compliant\n- **Support**: 24/7 customer service\n- **Updates**: Automatic feature updates\n\n## Pricing\n\nStarting from $29/month with a 14-day free trial. Enterprise plans available.\n\n## Get Started Today\n\nTransform your ${this.prompt.toLowerCase()} experience with our innovative solution. Start your free trial now!\n\n*Keywords: ${this.keywords || 'product, solution, innovation, technology'}*`;

      case 'headline':
        return `10 Compelling Headlines About ${this.prompt}:\n\n1. "The Ultimate Guide to ${this.prompt}: Everything You Need to Know"\n2. "How ${this.prompt} Can Transform Your Business in 30 Days"\n3. "The Secret to Mastering ${this.prompt} That Experts Don't Want You to Know"\n4. "${this.prompt}: The Game-Changing Strategy Your Competitors Fear"\n5. "Why ${this.prompt} Is the Future of Digital Success"\n6. "From Zero to Hero: Your Complete ${this.prompt} Journey"\n7. "${this.prompt} Hacks That Will 10x Your Results"\n8. "The Definitive ${this.prompt} Framework for 2024"\n9. "Unlock the Power of ${this.prompt}: A Step-by-Step Approach"\n10. "${this.prompt}: The Missing Piece in Your Success Puzzle"`;

      case 'ad-copy':
        return `🎯 **STOP STRUGGLING WITH ${this.prompt.toUpperCase()}!**\n\nAre you tired of mediocre results? Frustrated with complicated solutions?\n\n**Introducing the ULTIMATE ${this.prompt} Solution!**\n\n✅ **Proven Results**: 300% improvement in just 30 days\n✅ **Easy to Use**: No technical skills required\n✅ **Money-Back Guarantee**: 100% satisfaction or your money back\n✅ **Expert Support**: 24/7 customer service\n\n**🔥 LIMITED TIME OFFER: 50% OFF FIRST MONTH!**\n\nDon't wait! Transform your ${this.prompt.toLowerCase()} today!\n\n👉 [CLAIM YOUR DISCOUNT NOW]\n\n*Offer ends in 24 hours. Terms and conditions apply.*`;

      default:
        return `Generated content for: ${this.prompt}\n\n[Tone: ${this.tone}, Length: ${this.length}, Audience: ${this.audience}]\n\nThis is placeholder content that would be generated by AI based on your specifications. The actual content would be tailored to your exact requirements and optimized for the selected content type.`;
    }
  };

  @action
  copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(this.generatedContent);
      // Show success message
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  @action
  saveToHistory = () => {
    // Already saved in generateContent
  };

  @action
  loadFromHistory = (historyItem) => {
    this.contentType = historyItem.type;
    this.prompt = historyItem.prompt;
    this.generatedContent = historyItem.content;
    this.tone = historyItem.settings.tone;
    this.length = historyItem.settings.length;
    this.audience = historyItem.settings.audience;
    this.keywords = historyItem.settings.keywords;
  };

  @action
  clearHistory = () => {
    this.contentHistory = [];
  };

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('ai-content-generator', className)}>
        <div className="generator-header">
          <h2>AI Content Generator</h2>
          <div className="header-info">
            <span className="ai-badge">
              <i className="fa fa-robot" /> Powered by AI
            </span>
            <span className="credit-counter">
              <i className="fa fa-coins" /> 50 credits remaining
            </span>
          </div>
        </div>

        <div className="generator-content">
          <div className="generator-sidebar">
            <div className="content-types-section">
              <h3>Content Types</h3>
              <div className="content-types-grid">
                {this.contentTypes.map(type => (
                  <div
                    key={type.id}
                    className={classnames('content-type-card', {
                      selected: this.contentType === type.id
                    })}
                    onClick={() => this.setContentType(type.id)}
                  >
                    <div className="type-icon">
                      <i className={`fa ${type.icon}`} />
                    </div>
                    <div className="type-info">
                      <h4>{type.name}</h4>
                      <p>{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {this.showTemplates && (
              <div className="templates-section">
                <h3>Templates</h3>
                <div className="templates-list">
                  {this.templates.filter(t => t.type === this.contentType).map(template => (
                    <div
                      key={template.id}
                      className="template-item"
                      onClick={() => this.selectTemplate(template)}
                    >
                      <h4>{template.name}</h4>
                      <p>{template.prompt.substring(0, 60)}...</p>
                      <div className="template-keywords">
                        {template.keywords.map(keyword => (
                          <span key={keyword} className="keyword-tag">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="generator-main">
            <div className="generator-controls">
              <div className="control-row">
                <div className="control-group">
                  <label>Tone</label>
                  <select value={this.tone} onChange={(e) => this.setTone(e.target.value)}>
                    {this.tones.map(tone => (
                      <option key={tone.id} value={tone.id}>{tone.name}</option>
                    ))}
                  </select>
                </div>

                <div className="control-group">
                  <label>Length</label>
                  <select value={this.length} onChange={(e) => this.setLength(e.target.value)}>
                    {this.lengths.map(length => (
                      <option key={length.id} value={length.id}>{length.name}</option>
                    ))}
                  </select>
                </div>

                <div className="control-group">
                  <label>Audience</label>
                  <select value={this.audience} onChange={(e) => this.setAudience(e.target.value)}>
                    {this.audiences.map(audience => (
                      <option key={audience.id} value={audience.id}>{audience.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  className="templates-btn"
                  onClick={this.toggleTemplates}
                >
                  <i className="fa fa-bookmark" /> Templates
                </button>
              </div>

              <div className="prompt-section">
                <label>Prompt or Topic</label>
                <textarea
                  value={this.prompt}
                  onChange={(e) => this.updatePrompt(e.target.value)}
                  placeholder={`Describe what you want to generate... (e.g., "Write about the benefits of remote work")`}
                  rows={3}
                />
              </div>

              <div className="keywords-section">
                <label>Keywords (Optional)</label>
                <input
                  type="text"
                  value={this.keywords}
                  onChange={(e) => this.updateKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="custom-instructions">
                <label>Custom Instructions (Optional)</label>
                <textarea
                  value={this.customInstructions}
                  onChange={(e) => this.updateCustomInstructions(e.target.value)}
                  placeholder="Any specific requirements or style preferences..."
                  rows={2}
                />
              </div>

              <div className="generate-section">
                <button
                  className="generate-btn"
                  onClick={this.generateContent}
                  disabled={this.isGenerating || !this.prompt.trim()}
                >
                  {this.isGenerating ? (
                    <>
                      <i className="fa fa-spinner fa-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-magic" /> Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="generated-content-section">
              {this.generatedContent && (
                <div className="content-header">
                  <h3>Generated Content</h3>
                  <div className="content-actions">
                    <button className="action-btn" onClick={this.copyToClipboard}>
                      <i className="fa fa-copy" /> Copy
                    </button>
                    <button className="action-btn" onClick={this.saveToHistory}>
                      <i className="fa fa-save" /> Save
                    </button>
                    <button className="action-btn" onClick={() => this.generatedContent = ''}>
                      <i className="fa fa-trash" /> Clear
                    </button>
                  </div>
                </div>
              )}

              <div className="content-display">
                {this.generatedContent ? (
                  <div className="generated-content">
                    <pre>{this.generatedContent}</pre>
                  </div>
                ) : (
                  <div className="content-placeholder">
                    <i className="fa fa-file-text" />
                    <h4>Your generated content will appear here</h4>
                    <p>Enter a prompt and click "Generate Content" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="generator-sidebar-right">
            <div className="history-section">
              <div className="history-header">
                <h3>Generation History</h3>
                <button className="clear-history" onClick={this.clearHistory}>
                  <i className="fa fa-trash" /> Clear
                </button>
              </div>

              <div className="history-list">
                {this.contentHistory.map(item => (
                  <div
                    key={item.id}
                    className="history-item"
                    onClick={() => this.loadFromHistory(item)}
                  >
                    <div className="history-type">
                      <i className={`fa ${this.contentTypes.find(ct => ct.id === item.type)?.icon}`} />
                    </div>
                    <div className="history-info">
                      <div className="history-prompt">{item.prompt.substring(0, 40)}...</div>
                      <div className="history-meta">
                        {new Date(item.timestamp).toLocaleDateString()} • {item.settings.tone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .ai-content-generator {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .generator-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .generator-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .header-info {
            display: flex;
            gap: 16px;
            align-items: center;
          }

          .ai-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .credit-counter {
            color: #6c757d;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .generator-content {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .generator-sidebar {
            width: 280px;
            background: white;
            border-right: 1px solid #e9ecef;
            overflow-y: auto;
          }

          .content-types-section {
            padding: 20px;
          }

          .content-types-section h3 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
          }

          .content-types-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .content-type-card {
            padding: 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }

          .content-type-card:hover {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .content-type-card.selected {
            border-color: #007bff;
            background: #e7f3ff;
          }

          .type-icon {
            width: 32px;
            height: 32px;
            background: #007bff;
            color: white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .type-info h4 {
            margin: 0 0 4px 0;
            font-size: 14px;
            font-weight: 600;
          }

          .type-info p {
            margin: 0;
            font-size: 12px;
            color: #6c757d;
            line-height: 1.4;
          }

          .templates-section {
            padding: 20px;
            border-top: 1px solid #e9ecef;
          }

          .templates-section h3 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
          }

          .templates-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .template-item {
            padding: 12px;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .template-item:hover {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .template-item h4 {
            margin: 0 0 6px 0;
            font-size: 14px;
            font-weight: 600;
          }

          .template-item p {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #6c757d;
          }

          .template-keywords {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
          }

          .keyword-tag {
            background: #e9ecef;
            color: #495057;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
          }

          .generator-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .generator-controls {
            background: white;
            border-bottom: 1px solid #e9ecef;
            padding: 20px;
          }

          .control-row {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            flex-wrap: wrap;
          }

          .control-group {
            flex: 1;
            min-width: 120px;
          }

          .control-group label {
            display: block;
            margin-bottom: 4px;
            font-size: 12px;
            font-weight: 500;
            color: #495057;
            text-transform: uppercase;
          }

          .control-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
          }

          .control-group select:focus {
            outline: none;
            border-color: #007bff;
          }

          .templates-btn {
            background: #6c757d;
            color: white;
            border: 1px solid #6c757d;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            transition: all 0.2s;
          }

          .templates-btn:hover {
            background: #5a6268;
          }

          .prompt-section,
          .keywords-section,
          .custom-instructions {
            margin-bottom: 16px;
          }

          .prompt-section textarea,
          .keywords-section input,
          .custom-instructions textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 14px;
            resize: vertical;
          }

          .prompt-section textarea:focus,
          .keywords-section input:focus,
          .custom-instructions textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .generate-section {
            text-align: center;
          }

          .generate-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }

          .generate-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }

          .generate-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .generated-content-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .content-header {
            padding: 16px 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .content-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          }

          .content-actions {
            display: flex;
            gap: 8px;
          }

          .action-btn {
            padding: 6px 12px;
            border: 1px solid #ced4da;
            background: white;
            color: #6c757d;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .action-btn:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
          }

          .content-display {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }

          .generated-content {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }

          .generated-content pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.6;
          }

          .content-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #6c757d;
            text-align: center;
          }

          .content-placeholder i {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
          }

          .content-placeholder h4 {
            margin: 0 0 8px 0;
            font-size: 18px;
          }

          .content-placeholder p {
            margin: 0;
            font-size: 14px;
          }

          .generator-sidebar-right {
            width: 250px;
            background: white;
            border-left: 1px solid #e9ecef;
            overflow-y: auto;
          }

          .history-section {
            padding: 20px;
          }

          .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .history-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .clear-history {
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .history-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .history-item {
            padding: 12px;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }

          .history-item:hover {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .history-type {
            width: 24px;
            height: 24px;
            background: #007bff;
            color: white;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            flex-shrink: 0;
          }

          .history-info {
            flex: 1;
            min-width: 0;
          }

          .history-prompt {
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .history-meta {
            font-size: 10px;
            color: #6c757d;
          }

          @media (max-width: 1200px) {
            .generator-content {
              flex-direction: column;
            }

            .generator-sidebar, .generator-sidebar-right {
              width: 100%;
              border-right: none;
              border-left: none;
              border-bottom: 1px solid #e9ecef;
              max-height: 200px;
            }

            .content-types-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 768px) {
            .control-row {
              flex-direction: column;
              gap: 12px;
            }

            .control-group {
              min-width: auto;
            }

            .content-actions {
              flex-direction: column;
              gap: 4px;
            }

            .action-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    );
  }
}

AIContentGenerator.propTypes = {
  onContentGenerated: PropTypes.func,
  className: PropTypes.string
};