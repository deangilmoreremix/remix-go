export default function BehavioralAnalytics({ analyticsData = {} }) {
  const defaultData = {
    views: 12345,
    uniqueVisitors: 8762,
    avgWatchTime: 156,
    completionRate: 0.68,
    interactions: 3421,
    clicks: 1892,
    conversions: 456,
    bounceRate: 0.24,
    deviceBreakdown: { desktop: 0.45, mobile: 0.42, tablet: 0.13 },
    trafficSources: { organic: 0.35, social: 0.28, direct: 0.20, referral: 0.17 },
    topPages: [
      { path: '/home', views: 5200 },
      { path: '/about', views: 1800 },
      { path: '/contact', views: 1200 },
      { path: '/products', views: 980 }
    ],
    geographic: [
      { country: 'US', visitors: 3500, percentage: 0.40 },
      { country: 'UK', visitors: 1800, percentage: 0.21 },
      { country: 'CA', visitors: 1200, percentage: 0.14 },
      { country: 'AU', visitors: 800, percentage: 0.09 }
    ],
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: Math.random() * 100 + (i >= 9 && i <= 17 ? 50 : 20)
    })),
    daily: Array.from({ length: 7 }, (_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      visits: Math.floor(Math.random() * 2000 + 500)
    })),
    events: [
      { name: 'CTA Click', count: 1892, conversion: 0.24 },
      { name: 'Video Play', count: 8762, conversion: 1.00 },
      { name: 'Form Submit', count: 456, conversion: 0.05 },
      { name: 'Share', count: 234, conversion: 0.03 },
      { name: 'Download', count: 189, conversion: 0.02 }
    ]
  };

  const data = { ...defaultData, ...analyticsData };

  const state = {
    timeRange: '7d',
    activeTab: 'overview',
    selectedMetric: 'visitors'
  };

  const container = document.createElement('div');
  container.className = 'behavioral-analytics flex flex-col h-full bg-gray-900';

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function createSparkline(data, width = 100, height = 30) {
    const max = Math.max(...data) || 1;
    const min = Math.min(...data) || 0;
    const range = max - min || 1;
    
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return `<svg width="${width}" height="${height}" class="sparkline">
      <polyline fill="none" stroke="currentColor" stroke-width="1.5" points="${points}"/>
    </svg>`;
  }

  function render() {
    container.innerHTML = `
      <div class="analytics-header p-4 border-b border-gray-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">Behavioral Analytics</h2>
            <p class="text-xs text-gray-400">Track user engagement and interactions</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <select id="time-range" class="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm">
            <option value="24h">Last 24 hours</option>
            <option value="7d" selected>Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button id="export-btn" class="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2">
            <i class="fa fa-download"></i> Export
          </button>
        </div>
      </div>

      <div class="flex border-b border-gray-800">
        ${[
          ['overview', 'Overview', 'fa-chart-pie'],
          ['engagement', 'Engagement', 'fa-chart-line'],
          ['audience', 'Audience', 'fa-users'],
          ['events', 'Events', 'fa-bolt']
        ].map(([tab, label, icon]) => `
          <button class="tab-btn flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${state.activeTab === tab ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'}"
                  data-tab="${tab}">
            <i class="fa ${icon}"></i>
            ${label}
          </button>
        `).join('')}
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        ${state.activeTab === 'overview' ? `
          <div class="space-y-6">
            <div class="grid grid-cols-4 gap-4">
              ${[
                { label: 'Total Views', value: formatNumber(data.views), change: '+12.5%', positive: true, icon: 'fa-eye', color: 'blue' },
                { label: 'Unique Visitors', value: formatNumber(data.uniqueVisitors), change: '+8.3%', positive: true, icon: 'fa-user', color: 'green' },
                { label: 'Avg Watch Time', value: formatDuration(data.avgWatchTime), change: '+5.2%', positive: true, icon: 'fa-clock', color: 'purple' },
                { label: 'Completion Rate', value: (data.completionRate * 100).toFixed(0) + '%', change: '-2.1%', positive: false, icon: 'fa-check-circle', color: 'orange' }
              ].map(stat => `
                <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wider">${stat.label}</p>
                      <p class="text-2xl font-bold text-white mt-1">${stat.value}</p>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-${stat.color}-500/20 text-${stat.color}-400 flex items-center justify-center">
                      <i class="fa ${stat.icon}"></i>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 mt-3">
                    <span class="text-xs ${stat.positive ? 'text-green-400' : 'text-red-400'}">
                      <i class="fa ${stat.positive ? 'fa-arrow-up' : 'fa-arrow-down'}"></i> ${stat.change}
                    </span>
                    <span class="text-xs text-gray-500">vs last period</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <i class="fa fa-chart-area text-violet-400"></i>
                  Activity Over Time
                </h3>
                <div class="h-48 flex items-end justify-between gap-1">
                  ${data.daily.map(d => `
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <div class="w-full bg-violet-500/30 rounded-t hover:bg-violet-500/50 transition-colors relative group"
                           style="height: ${(d.visits / Math.max(...data.daily.map(x => x.visits))) * 100}%">
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${formatNumber(d.visits)} visits
                        </div>
                      </div>
                      <span class="text-xs text-gray-500">${d.day}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <i class="fa fa-clock text-violet-400"></i>
                  Hourly Activity
                </h3>
                <div class="h-48 flex items-end justify-between gap-px">
                  ${data.hourly.map(h => `
                    <div class="flex-1 relative group">
                      <div class="w-full bg-fuchsia-500/30 rounded-t hover:bg-fuchsia-500/50 transition-colors"
                           style="height: ${(h.activity / Math.max(...data.hourly.map(x => x.activity))) * 100}%">
                      </div>
                      ${h.hour % 4 === 0 ? `<span class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">${h.hour}:00</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Device Breakdown</h3>
                <div class="space-y-3">
                  ${[
                    { device: 'Desktop', value: data.deviceBreakdown.desktop, icon: 'fa-desktop', color: 'blue' },
                    { device: 'Mobile', value: data.deviceBreakdown.mobile, icon: 'fa-mobile-alt', color: 'green' },
                    { device: 'Tablet', value: data.deviceBreakdown.tablet, icon: 'fa-tablet-alt', color: 'purple' }
                  ].map(d => `
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-400 flex items-center gap-2">
                          <i class="fa ${d.icon}"></i>
                          ${d.device}
                        </span>
                        <span class="text-white">${(d.value * 100).toFixed(0)}%</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-${d.color}-500 rounded-full" style="width: ${d.value * 100}%"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Traffic Sources</h3>
                <div class="space-y-3">
                  ${[
                    { source: 'Organic Search', value: data.trafficSources.organic, icon: 'fa-search', color: 'green' },
                    { source: 'Social Media', value: data.trafficSources.social, icon: 'fa-share-alt', color: 'blue' },
                    { source: 'Direct', value: data.trafficSources.direct, icon: 'fa-link', color: 'purple' },
                    { source: 'Referral', value: data.trafficSources.referral, icon: 'fa-share', color: 'orange' }
                  ].map(s => `
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-400 flex items-center gap-2">
                          <i class="fa ${s.icon}"></i>
                          ${s.source}
                        </span>
                        <span class="text-white">${(s.value * 100).toFixed(0)}%</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-${s.color}-500 rounded-full" style="width: ${s.value * 100}%"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Top Pages</h3>
                <div class="space-y-3">
                  ${data.topPages.map((page, i) => `
                    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div class="flex items-center gap-3">
                        <span class="w-5 h-5 rounded-full bg-gray-700 text-gray-400 text-xs flex items-center justify-center">${i + 1}</span>
                        <span class="text-sm text-gray-300">${page.path}</span>
                      </div>
                      <span class="text-sm text-gray-500">${formatNumber(page.views)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        ${state.activeTab === 'engagement' ? `
          <div class="space-y-6">
            <div class="grid grid-cols-3 gap-4">
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Interactions</p>
                <p class="text-3xl font-bold text-white mt-2">${formatNumber(data.interactions)}</p>
                <div class="text-xs text-green-400 mt-1">
                  <i class="fa fa-arrow-up"></i> 15.3% vs last week
                </div>
              </div>
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Click Rate</p>
                <p class="text-3xl font-bold text-white mt-2">${(data.clicks / data.views * 100).toFixed(1)}%</p>
                <div class="text-xs text-green-400 mt-1">
                  <i class="fa fa-arrow-up"></i> 3.2% vs last week
                </div>
              </div>
              <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p class="text-xs text-gray-500 uppercase">Conversion Rate</p>
                <p class="text-3xl font-bold text-white mt-2">${(data.conversions / data.views * 100).toFixed(1)}%</p>
                <div class="text-xs text-red-400 mt-1">
                  <i class="fa fa-arrow-down"></i> 1.1% vs last week
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
              <h3 class="text-sm font-semibold text-white mb-4">Engagement Funnel</h3>
              <div class="space-y-4">
                ${[
                  { stage: 'Views', value: data.views, percent: 100, color: 'violet' },
                  { stage: 'Watched > 10s', value: Math.floor(data.views * 0.72), percent: 72, color: 'fuchsia' },
                  { stage: 'Watched > 50%', value: Math.floor(data.views * 0.45), percent: 45, color: 'pink' },
                  { stage: 'Watched to End', value: Math.floor(data.views * data.completionRate), percent: Math.floor(data.completionRate * 100), color: 'rose' },
                  { stage: 'Click CTA', value: data.clicks, percent: Math.floor(data.clicks / data.views * 100), color: 'red' },
                  { stage: 'Converted', value: data.conversions, percent: Math.floor(data.conversions / data.views * 100), color: 'orange' }
                ].map((step, i) => `
                  <div class="relative">
                    <div class="flex items-center gap-4">
                      <div class="w-32 text-sm text-gray-400 text-right">${step.stage}</div>
                      <div class="flex-1">
                        <div class="h-8 bg-gray-700/50 rounded-lg overflow-hidden">
                          <div class="h-full bg-${step.color}-500/80 rounded-lg flex items-center px-3 transition-all duration-500"
                               style="width: ${step.percent}%">
                            <span class="text-white text-sm font-medium">${formatNumber(step.value)}</span>
                          </div>
                        </div>
                      </div>
                      <div class="w-16 text-sm text-white font-medium">${step.percent}%</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        ${state.activeTab === 'audience' ? `
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Geographic Distribution</h3>
                <div class="space-y-2">
                  ${data.geographic.map(geo => `
                    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">${geo.country}</div>
                      <div class="flex-1">
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-400">${geo.country === 'US' ? 'United States' : geo.country === 'UK' ? 'United Kingdom' : geo.country === 'CA' ? 'Canada' : geo.country === 'AU' ? 'Australia' : geo.country}</span>
                          <span class="text-white">${formatNumber(geo.visitors)}</span>
                        </div>
                        <div class="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div class="h-full bg-violet-500 rounded-full" style="width: ${geo.percentage * 100}%"></div>
                        </div>
                      </div>
                      <span class="text-sm text-gray-500">${(geo.percentage * 100).toFixed(0)}%</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                <h3 class="text-sm font-semibold text-white mb-4">Device Analytics</h3>
                <div class="grid grid-cols-3 gap-4 mb-6">
                  ${[
                    { device: 'Desktop', percent: 45, sessions: 3943, avgTime: '4:32', icon: 'fa-desktop' },
                    { device: 'Mobile', percent: 42, sessions: 3680, avgTime: '2:18', icon: 'fa-mobile-alt' },
                    { device: 'Tablet', percent: 13, sessions: 1139, avgTime: '3:45', icon: 'fa-tablet-alt' }
                  ].map(d => `
                    <div class="text-center p-4 rounded-lg bg-gray-700/50">
                      <i class="fa ${d.icon} text-2xl text-violet-400 mb-2"></i>
                      <p class="text-lg font-semibold text-white">${d.percent}%</p>
                      <p class="text-xs text-gray-500">${d.sessions.toLocaleString()}</p>
                    </div>
                  `).join('')}
                </div>
                <div class="space-y-3">
                  <h4 class="text-sm font-medium text-gray-400">Browser Distribution</h4>
                  ${[
                    { browser: 'Chrome', share: 0.62 },
                    { browser: 'Safari', share: 0.19 },
                    { browser: 'Firefox', share: 0.09 },
                    { browser: 'Edge', share: 0.06 },
                    { browser: 'Other', share: 0.04 }
                  ].map(b => `
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-400">${b.browser}</span>
                      <div class="flex items-center gap-2">
                        <div class="w-24 h-1.5 bg-gray-700 rounded-full">
                          <div class="h-full bg-violet-500 rounded-full" style="width: ${b.share * 100}%"></div>
                        </div>
                        <span class="text-sm text-white w-10 text-right">${(b.share * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        ${state.activeTab === 'events' ? `
          <div class="space-y-6">
            <div class="grid grid-cols-5 gap-4">
              ${data.events.map(event => `
                <div class="p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-center">
                  <p class="text-2xl font-bold text-white">${formatNumber(event.count)}</p>
                  <p class="text-xs text-gray-500 mt-1">${event.name}</p>
                  <p class="text-sm text-violet-400 mt-2">${(event.conversion * 100).toFixed(1)}%</p>
                </div>
              `).join('')}
            </div>

            <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/30">
              <h3 class="text-sm font-semibold text-white mb-4">Event Timeline</h3>
              <div class="space-y-4">
                ${data.events.map((event, i) => `
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center">
                      <span class="text-sm font-bold">${i + 1}</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-white">${event.name}</span>
                        <span class="text-sm text-gray-400">${formatNumber(event.count)} events</span>
                      </div>
                      <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style="width: ${Math.min(event.count / data.views * 100 * 3, 100)}%"></div>
                      </div>
                    </div>
                    <span class="text-sm font-medium text-violet-400">${(event.conversion * 100).toFixed(1)}%</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeTab = btn.dataset.tab;
        render();
      });
    });

    const timeRange = container.querySelector('#time-range');
    if (timeRange) {
      timeRange.addEventListener('change', (e) => {
        state.timeRange = e.target.value;
      });
    }

    const exportBtn = container.querySelector('#export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const exportData = {
          ...data,
          exportedAt: new Date().toISOString(),
          timeRange: state.timeRange
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${state.timeRange}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  render();

  container.api = {
    refresh: () => render(),
    setTimeRange: (range) => { state.timeRange = range; render(); }
  };

  return container;
}
