export default function AIContentGenerator({ onGenerate, onSave }) {
  const state = {
    contentType: 'blog-post',
    prompt: '',
    tone: 'professional',
    length: 'medium',
    audience: 'general',
    keywords: '',
    customInstructions: '',
    isGenerating: false,
    generatedContent: '',
    contentHistory: [],
    selectedTemplate: null,
    showTemplates: false
  };

  const contentTypes = [
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

  const tones = [
    { id: 'professional', name: 'Professional', description: 'Business-like, formal, and authoritative' },
    { id: 'casual', name: 'Casual', description: 'Relaxed, conversational, and approachable' },
    { id: 'friendly', name: 'Friendly', description: 'Warm, welcoming, and personable' },
    { id: 'formal', name: 'Formal', description: 'Traditional, proper, and structured' },
    { id: 'enthusiastic', name: 'Enthusiastic', description: 'Energetic, excited, and motivational' },
    { id: 'serious', name: 'Serious', description: 'Solemn, thoughtful, and analytical' },
    { id: 'humorous', name: 'Humorous', description: 'Funny, light-hearted, and entertaining' },
    { id: 'persuasive', name: 'Persuasive', description: 'Convincing, compelling, and influential' }
  ];

  const lengths = [
    { id: 'short', name: 'Short', description: '50-150 words' },
    { id: 'medium', name: 'Medium', description: '200-500 words' },
    { id: 'long', name: 'Long', description: '600-1000 words' },
    { id: 'extra-long', name: 'Extra Long', description: '1000+ words' }
  ];

  const audiences = [
    { id: 'general', name: 'General Public', description: 'Broad audience with varied interests' },
    { id: 'business', name: 'Business Professionals', description: 'Corporate executives, managers, entrepreneurs' },
    { id: 'students', name: 'Students', description: 'College/university students and researchers' },
    { id: 'seniors', name: 'Seniors', description: 'Older adults, retirees, senior citizens' },
    { id: 'tech-savvy', name: 'Tech Enthusiasts', description: 'Technology professionals and hobbyists' },
    { id: 'parents', name: 'Parents', description: 'Families with children, parenting community' },
    { id: 'millennials', name: 'Millennials', description: 'Young adults aged 25-40' },
    { id: 'gen-z', name: 'Gen Z', description: 'Young people aged 18-24' }
  ];

  const templates = [
    { id: 'how-to-guide', name: 'How-To Guide', type: 'blog-post', prompt: 'Write a comprehensive guide on [TOPIC] that includes step-by-step instructions, tips, and common mistakes to avoid.', keywords: ['tutorial', 'guide', 'how-to', 'step-by-step'] },
    { id: 'product-review', name: 'Product Review', type: 'blog-post', prompt: 'Create an honest review of [PRODUCT] covering its features, pros and cons, pricing, and who it\'s best suited for.', keywords: ['review', 'product', 'features', 'comparison'] },
    { id: 'industry-trends', name: 'Industry Trends', type: 'blog-post', prompt: 'Analyze the latest trends in [INDUSTRY] including emerging technologies, market changes, and future predictions.', keywords: ['trends', 'industry', 'analysis', 'future'] },
    { id: 'social-post', name: 'Engaging Social Post', type: 'social-media', prompt: 'Create an engaging social media post about [TOPIC] that encourages interaction and shares.', keywords: ['social media', 'engagement', 'viral', 'share'] },
    { id: 'email-newsletter', name: 'Newsletter Campaign', type: 'email', prompt: 'Write a compelling newsletter about [TOPIC] with engaging content, calls-to-action, and value for subscribers.', keywords: ['newsletter', 'email', 'campaign', 'subscribers'] },
    { id: 'product-launch', name: 'Product Launch Copy', type: 'ad-copy', prompt: 'Create persuasive advertising copy for launching [PRODUCT] that highlights unique features and creates urgency.', keywords: ['launch', 'product', 'advertising', 'urgency'] }
  ];

  const container = document.createElement('div');
  container.className = 'ai-content-generator flex flex-col h-full bg-gray-900';

  function render() {
    const currentType = contentTypes.find(t => t.id === state.contentType);
    const filteredTemplates = templates.filter(t => t.type === state.contentType);

    container.innerHTML = `
      <div class="generator-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">AI Content Generator</h2>
            <p class="text-xs text-gray-400">Create content with AI assistance</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium">
            <i class="fa fa-coins mr-1"></i> 50 credits
          </span>
        </div>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <div class="w-72 border-r border-gray-800 p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Content Type</h3>
            <div class="space-y-2">
              ${contentTypes.map(type => `
                <div class="content-type-card p-3 rounded-lg border border-gray-700 cursor-pointer transition-all hover:border-violet-500 ${state.contentType === type.id ? 'border-violet-500 bg-violet-500/10' : 'bg-gray-800/50'}"
                     data-type="${type.id}">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <i class="fa ${type.icon} text-gray-400"></i>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-white">${type.name}</h4>
                      <p class="text-xs text-gray-500 mt-1">${type.description}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          ${state.showTemplates ? `
            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Templates</h3>
              <div class="space-y-2">
                ${filteredTemplates.map(template => `
                  <div class="template-item p-3 rounded-lg border border-gray-700 cursor-pointer transition-all hover:border-violet-500 bg-gray-800/50"
                       data-template="${template.id}">
                    <h4 class="text-sm font-medium text-white">${template.name}</h4>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">${template.prompt}</p>
                    <div class="flex gap-1 mt-2">
                      ${template.keywords.map(kw => `<span class="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs">${kw}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="flex-1 flex flex-col p-6 overflow-y-auto">
          <div class="space-y-6 max-w-3xl">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Tone</label>
                <select id="tone-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${tones.map(tone => `<option value="${tone.id}" ${state.tone === tone.id ? 'selected' : ''}>${tone.name}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Length</label>
                <select id="length-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${lengths.map(length => `<option value="${length.id}" ${state.length === length.id ? 'selected' : ''}>${length.name}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Audience</label>
                <select id="audience-select" class="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500">
                  ${audiences.map(audience => `<option value="${audience.id}" ${state.audience === audience.id ? 'selected' : ''}>${audience.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-4 items-end">
              <div class="col-span-3">
                <label class="block text-xs text-gray-500 mb-2">Prompt or Topic</label>
                <textarea id="prompt-input" rows="3"
                  class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
                  placeholder="Describe what you want to generate... (e.g., 'Write about the benefits of remote work')">${state.prompt}</textarea>
              </div>
              <button id="templates-toggle" class="px-4 py-3 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                <i class="fa fa-bookmark"></i> Templates
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-2">Keywords (Optional)</label>
                <input id="keywords-input" type="text" value="${state.keywords}"
                  class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="keyword1, keyword2, keyword3">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-2">Custom Instructions (Optional)</label>
                <input id="custom-input" type="text" value="${state.customInstructions}"
                  class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Any specific requirements...">
              </div>
            </div>

            <button id="generate-btn"
              class="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-3 ${state.isGenerating || !state.prompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-violet-500/25'}"
              ${state.isGenerating || !state.prompt.trim() ? 'disabled' : ''}>
              ${state.isGenerating ? `
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              ` : `
                <i class="fa fa-magic"></i>
                Generate Content
              `}
            </button>

            ${state.generatedContent ? `
              <div class="border border-gray-700 rounded-xl bg-gray-800/50 overflow-hidden">
                <div class="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 class="text-sm font-semibold text-white">Generated Content</h3>
                  <div class="flex gap-2">
                    <button id="copy-btn" class="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition-colors flex items-center gap-1">
                      <i class="fa fa-copy"></i> Copy
                    </button>
                    <button id="save-btn" class="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs hover:bg-violet-500 transition-colors flex items-center gap-1">
                      <i class="fa fa-save"></i> Save
                    </button>
                    <button id="clear-btn" class="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition-colors flex items-center gap-1">
                      <i class="fa fa-trash"></i> Clear
                    </button>
                  </div>
                </div>
                <div class="p-4 max-h-64 overflow-y-auto">
                  <pre class="text-sm text-gray-300 whitespace-pre-wrap font-sans">${state.generatedContent}</pre>
                </div>
              </div>
            ` : `
              <div class="border border-gray-700 rounded-xl bg-gray-800/30 p-8 text-center">
                <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <i class="fa fa-file-text text-gray-500 text-2xl"></i>
                </div>
                <h4 class="text-white font-medium mb-2">Your generated content will appear here</h4>
                <p class="text-sm text-gray-500">Enter a prompt and click "Generate Content" to get started</p>
              </div>
            `}
          </div>
        </div>

        ${state.contentHistory.length > 0 ? `
          <div class="w-72 border-l border-gray-800 p-4 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">History</h3>
              <button id="clear-history" class="text-xs text-gray-500 hover:text-red-400 transition-colors">
                <i class="fa fa-trash"></i> Clear
              </button>
            </div>
            <div class="space-y-2">
              ${state.contentHistory.map(item => `
                <div class="history-item p-3 rounded-lg bg-gray-800/50 border border-gray-700 cursor-pointer hover:border-violet-500 transition-all"
                     data-history-id="${item.id}">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs text-gray-500">${new Date(item.id).toLocaleTimeString()}</span>
                    <span class="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs">${item.type}</span>
                  </div>
                  <p class="text-xs text-gray-400 line-clamp-2">${item.prompt}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    container.querySelectorAll('.content-type-card').forEach(card => {
      card.addEventListener('click', () => {
        state.contentType = card.dataset.type;
        state.selectedTemplate = null;
        state.generatedContent = '';
        render();
      });
    });

    container.querySelectorAll('.template-item').forEach(item => {
      item.addEventListener('click', () => {
        const template = templates.find(t => t.id === item.dataset.template);
        if (template) {
          state.selectedTemplate = template;
          state.contentType = template.type;
          state.prompt = template.prompt;
          state.showTemplates = false;
          render();
        }
      });
    });

    const toneSelect = container.querySelector('#tone-select');
    if (toneSelect) toneSelect.addEventListener('change', (e) => { state.tone = e.target.value; });

    const lengthSelect = container.querySelector('#length-select');
    if (lengthSelect) lengthSelect.addEventListener('change', (e) => { state.length = e.target.value; });

    const audienceSelect = container.querySelector('#audience-select');
    if (audienceSelect) audienceSelect.addEventListener('change', (e) => { state.audience = e.target.value; });

    const promptInput = container.querySelector('#prompt-input');
    if (promptInput) promptInput.addEventListener('input', (e) => { state.prompt = e.target.value; });

    const keywordsInput = container.querySelector('#keywords-input');
    if (keywordsInput) keywordsInput.addEventListener('input', (e) => { state.keywords = e.target.value; });

    const customInput = container.querySelector('#custom-input');
    if (customInput) customInput.addEventListener('input', (e) => { state.customInstructions = e.target.value; });

    const templatesToggle = container.querySelector('#templates-toggle');
    if (templatesToggle) {
      templatesToggle.addEventListener('click', () => {
        state.showTemplates = !state.showTemplates;
        render();
      });
    }

    const generateBtn = container.querySelector('#generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', generateContent);
    }

    const copyBtn = container.querySelector('#copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(state.generatedContent);
      });
    }

    const saveBtn = container.querySelector('#save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (onSave) onSave(state.generatedContent);
        saveToHistory();
      });
    }

    const clearBtn = container.querySelector('#clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.generatedContent = '';
        render();
      });
    }

    const clearHistoryBtn = container.querySelector('#clear-history');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        state.contentHistory = [];
        render();
      });
    }

    container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const historyItem = state.contentHistory.find(h => h.id === parseInt(item.dataset.historyId));
        if (historyItem) {
          state.generatedContent = historyItem.content;
          render();
        }
      });
    });
  }

  async function generateContent() {
    if (!state.prompt.trim() || state.isGenerating) return;

    state.isGenerating = true;
    render();

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const generatedTexts = {
        'blog-post': `# The Power of Remote Work\\n\\nRemote work has transformed how businesses operate across the globe. Here are key benefits you should know:\\n\\n## Flexibility and Work-Life Balance\\n\\nEmployees gain autonomy over their schedules, leading to improved satisfaction and retention rates. Studies show 77% of remote workers report higher satisfaction.\\n\\n## Cost Savings\\n\\nOrganizations save an average of $11,000 per employee annually on office space and related expenses.`,
        'social-media': `🚀 Remote work is here to stay! \\n\\nDid you know that 77% of remote workers report higher job satisfaction? \\n\\nHere are 3 reasons why:\\n✅ Better work-life balance\\n✅ Increased productivity\\n✅ Reduced commute stress\\n\\nWhat's your favorite benefit of remote work? 👇`,
        'email': `Subject: Unlock Your Team's Potential with Remote Work\\n\\nHi there,\\n\\nI hope this email finds you well. I wanted to share some insights about remote work that could benefit your team.\\n\\nRecent studies show that remote workers are 47% more productive and take shorter breaks.\\n\\nReady to learn more? Reply to this email and let's chat.`,
        'product-description': `Transform your workspace with our Remote Work Essentials Bundle.\\n\\n**What's Included:**\\n- Ergonomic laptop stand\\n- Wireless noise-canceling headphones\\n- Blue light blocking glasses\\n- Adjustable desk lamp\\n\\n**Key Benefits:**\\n✓ Improve posture and comfort\\n✓ Block distractions\\n✓ Reduce eye strain\\n\\nPerfect for professionals working from home.`,
        'headline': `10 Proven Strategies to Maximize Productivity in Remote Work\\n\\nThe Ultimate Guide to Thriving as a Remote Employee\\n\\nWhy Remote Work is Revolutionizing the Modern Workplace`,
        'ad-copy': `⚡️Work From Anywhere, Succeed Everywhere⚡️\\n\\nJoin 10,000+ professionals who've transformed their careers with remote work.\\n\\n✅ Flexible hours\\n✅ No commute\\n✅ Higher earning potential\\n\\n🎯 Limited time: Get 50% off your first month\\n\\n👉 [CTA Button: Start Your Remote Journey]`,
        'landing-page': `## Work Smarter, Not Harder\\n\\nDiscover the freedom of remote work with our proven framework.\\n\\n**Join thousands who have:**\\n- Increased productivity by 47%\\n- Achieved better work-life balance\\n- Advanced their careers faster\\n\\n🔐 30-day money-back guarantee\\n\\n[Get Started Now - No Credit Card Required]`,
        'seo-content': `Remote work has become essential for modern businesses. This comprehensive guide covers everything from setting up your home office to maintaining team collaboration.\\n\\n**Key Topics:**\\n1. Best practices for remote teams\\n2. Essential tools and software\\n3. Communication strategies\\n4. Productivity tips\\n5. Work-life balance\\n\\nWhether you're new to remote work or looking to optimize your current setup, this guide has you covered.`,
        'video-script': `[Opening shot: Person working from a cozy home office]\\n\\nNARRATOR: \"What if I told you that you could increase your productivity by 47%?\\n\\n[Cut to statistics screen]\\n\\nStudies show that remote workers are not just more productive—they're happier too.\\n\\n[Screenshot of remote work tools]\\n\\nLet's dive into the top 5 remote work tools that will transform your workflow...\\n\\n[Music fade out]`,
        'faq': `**Q: What is remote work?**\\nA: Remote work allows employees to work from locations outside of a traditional office, typically from home or co-working spaces.\\n\\n**Q: What equipment do I need?**\\nA: Essential equipment includes a reliable computer, high-speed internet, and a comfortable workspace. Many companies provide additional tools.\\n\\n**Q: How do teams collaborate remotely?**\\nA: Remote teams use tools like Slack, Zoom, and project management software to stay connected and productive.`
      };

      state.generatedContent = generatedTexts[state.contentType] || generatedTexts['blog-post'];

      if (onGenerate) {
        onGenerate(state.generatedContent, {
          type: state.contentType,
          prompt: state.prompt,
          tone: state.tone,
          length: state.length,
          audience: state.audience
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      state.isGenerating = false;
      render();
    }
  }

  function saveToHistory() {
    if (!state.generatedContent) return;

    state.contentHistory.unshift({
      id: Date.now(),
      type: state.contentType,
      prompt: state.prompt,
      content: state.generatedContent
    });

    if (state.contentHistory.length > 20) {
      state.contentHistory = state.contentHistory.slice(0, 20);
    }

    render();
  }

  render();
  return container;
}
