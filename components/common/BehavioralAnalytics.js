import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import PropTypes from '../../lib/PropTypes';
import classnames from 'classnames';

@inject('store')
@observer
export default class BehavioralAnalytics extends Component {
  @observable
  selectedTimeRange = '7d'; // 1d, 7d, 30d, 90d, 1y

  @observable
  selectedMetric = 'pageViews'; // pageViews, sessions, users, bounceRate, conversions

  @observable
  selectedSegment = 'all'; // all, new, returning, premium, etc.

  @observable
  analyticsData = {
    overview: {
      totalUsers: 12543,
      totalSessions: 18765,
      totalPageViews: 45231,
      avgSessionDuration: 245, // seconds
      bounceRate: 42.3,
      conversionRate: 8.7
    },
    timeSeries: [
      { date: '2024-01-01', pageViews: 1200, sessions: 890, users: 756, conversions: 45 },
      { date: '2024-01-02', pageViews: 1350, sessions: 945, users: 812, conversions: 52 },
      { date: '2024-01-03', pageViews: 1180, sessions: 876, users: 723, conversions: 38 },
      { date: '2024-01-04', pageViews: 1420, sessions: 1023, users: 876, conversions: 61 },
      { date: '2024-01-05', pageViews: 1380, sessions: 987, users: 834, conversions: 55 },
      { date: '2024-01-06', pageViews: 1520, sessions: 1089, users: 923, conversions: 68 },
      { date: '2024-01-07', pageViews: 1650, sessions: 1156, users: 987, conversions: 72 }
    ],
    topPages: [
      { path: '/', views: 8420, uniqueViews: 6543, avgTime: 180, bounceRate: 35.2 },
      { path: '/products', views: 5230, uniqueViews: 4123, avgTime: 245, bounceRate: 28.7 },
      { path: '/about', views: 3450, uniqueViews: 2890, avgTime: 156, bounceRate: 52.1 },
      { path: '/contact', views: 2890, uniqueViews: 2456, avgTime: 134, bounceRate: 48.9 },
      { path: '/blog', views: 4120, uniqueViews: 3456, avgTime: 298, bounceRate: 31.4 }
    ],
    userBehavior: {
      deviceTypes: [
        { type: 'Desktop', percentage: 58.3, sessions: 10923 },
        { type: 'Mobile', percentage: 35.2, sessions: 6589 },
        { type: 'Tablet', percentage: 6.5, sessions: 1213 }
      ],
      browsers: [
        { name: 'Chrome', percentage: 65.4, sessions: 12245 },
        { name: 'Safari', percentage: 18.7, sessions: 3508 },
        { name: 'Firefox', percentage: 9.2, sessions: 1723 },
        { name: 'Edge', percentage: 4.8, sessions: 901 },
        { name: 'Other', percentage: 1.9, sessions: 356 }
      ],
      locations: [
        { country: 'United States', percentage: 42.3, sessions: 7923 },
        { country: 'United Kingdom', percentage: 18.7, sessions: 3508 },
        { country: 'Canada', percentage: 12.1, sessions: 2267 },
        { country: 'Germany', percentage: 8.9, sessions: 1669 },
        { country: 'Australia', percentage: 6.2, sessions: 1162 },
        { country: 'Other', percentage: 11.8, sessions: 2214 }
      ],
      userJourney: [
        { step: 'Homepage', users: 10000, dropoff: 0 },
        { step: 'Product Page', users: 6500, dropoff: 35 },
        { step: 'Add to Cart', users: 2800, dropoff: 57 },
        { step: 'Checkout', users: 1800, dropoff: 36 },
        { step: 'Purchase', users: 872, dropoff: 52 }
      ]
    },
    heatmaps: {
      clickData: [
        { x: 120, y: 80, clicks: 245, element: 'header-logo' },
        { x: 350, y: 120, clicks: 189, element: 'nav-menu' },
        { x: 680, y: 200, clicks: 156, element: 'hero-cta' },
        { x: 420, y: 450, clicks: 134, element: 'feature-image' },
        { x: 720, y: 600, clicks: 98, element: 'testimonial-section' }
      ],
      scrollDepth: [
        { depth: '25%', users: 8567, percentage: 100 },
        { depth: '50%', users: 6234, percentage: 72.8 },
        { depth: '75%', users: 4123, percentage: 48.1 },
        { depth: '100%', users: 2345, percentage: 27.4 }
      ]
    },
    realtime: {
      activeUsers: 127,
      currentPageViews: 23,
      conversions: 3,
      topPages: [
        { path: '/', activeUsers: 45 },
        { path: '/products', activeUsers: 32 },
        { path: '/blog', activeUsers: 18 },
        { path: '/contact', activeUsers: 12 }
      ]
    }
  };

  @observable
  showHeatmap = false;

  @observable
  selectedHeatmapType = 'clicks'; // clicks, scroll, attention

  timeRanges = [
    { id: '1d', name: 'Last 24 Hours', days: 1 },
    { id: '7d', name: 'Last 7 Days', days: 7 },
    { id: '30d', name: 'Last 30 Days', days: 30 },
    { id: '90d', name: 'Last 90 Days', days: 90 },
    { id: '1y', name: 'Last Year', days: 365 }
  ];

  metrics = [
    { id: 'pageViews', name: 'Page Views', icon: 'fa-eye', color: '#007bff' },
    { id: 'sessions', name: 'Sessions', icon: 'fa-clock', color: '#28a745' },
    { id: 'users', name: 'Users', icon: 'fa-users', color: '#6f42c1' },
    { id: 'bounceRate', name: 'Bounce Rate', icon: 'fa-sign-out', color: '#dc3545' },
    { id: 'conversions', name: 'Conversions', icon: 'fa-trophy', color: '#ffc107' }
  ];

  segments = [
    { id: 'all', name: 'All Users', count: 12543 },
    { id: 'new', name: 'New Users', count: 4231 },
    { id: 'returning', name: 'Returning Users', count: 8312 },
    { id: 'premium', name: 'Premium Users', count: 1567 },
    { id: 'mobile', name: 'Mobile Users', count: 4423 },
    { id: 'desktop', name: 'Desktop Users', count: 7321 }
  ];

  @action
  setTimeRange = (range) => {
    this.selectedTimeRange = range;
    // In a real app, this would fetch new data
  };

  @action
  setMetric = (metric) => {
    this.selectedMetric = metric;
  };

  @action
  setSegment = (segment) => {
    this.selectedSegment = segment;
    // In a real app, this would filter data
  };

  @action
  toggleHeatmap = () => {
    this.showHeatmap = !this.showHeatmap;
  };

  @action
  setHeatmapType = (type) => {
    this.selectedHeatmapType = type;
  };

  @computed
  get chartData() {
    return this.analyticsData.timeSeries.map(point => ({
      date: new Date(point.date).toLocaleDateString(),
      [this.selectedMetric]: point[this.selectedMetric]
    }));
  }

  @computed
  get metricData() {
    const currentMetric = this.metrics.find(m => m.id === this.selectedMetric);
    const latestData = this.analyticsData.timeSeries[this.analyticsData.timeSeries.length - 1];

    return {
      value: latestData[this.selectedMetric],
      change: this.calculateChange(this.selectedMetric),
      color: currentMetric.color,
      icon: currentMetric.icon,
      name: currentMetric.name
    };
  }

  calculateChange(metric) {
    if (this.analyticsData.timeSeries.length < 2) return 0;

    const latest = this.analyticsData.timeSeries[this.analyticsData.timeSeries.length - 1][metric];
    const previous = this.analyticsData.timeSeries[this.analyticsData.timeSeries.length - 2][metric];

    return ((latest - previous) / previous * 100).toFixed(1);
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatPercentage(value) {
    return value.toFixed(1) + '%';
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('behavioral-analytics', className)}>
        <div className="analytics-header">
          <h2>Behavioral Analytics</h2>
          <div className="header-controls">
            <select
              value={this.selectedTimeRange}
              onChange={(e) => this.setTimeRange(e.target.value)}
              className="time-range-select"
            >
              {this.timeRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>

            <select
              value={this.selectedSegment}
              onChange={(e) => this.setSegment(e.target.value)}
              className="segment-select"
            >
              {this.segments.map(segment => (
                <option key={segment.id} value={segment.id}>
                  {segment.name} ({this.formatNumber(segment.count)})
                </option>
              ))}
            </select>

            <button
              className={classnames('heatmap-toggle', { active: this.showHeatmap })}
              onClick={this.toggleHeatmap}
            >
              <i className="fa fa-fire" /> Heatmap
            </button>
          </div>
        </div>

        <div className="analytics-content">
          <div className="metrics-overview">
            <div className="main-metric">
              <div className="metric-icon" style={{ backgroundColor: this.metricData.color }}>
                <i className={`fa ${this.metricData.icon}`} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{this.formatNumber(this.metricData.value)}</div>
                <div className="metric-name">{this.metricData.name}</div>
                <div className={classnames('metric-change', {
                  positive: parseFloat(this.metricData.change) > 0,
                  negative: parseFloat(this.metricData.change) < 0
                })}>
                  <i className={`fa fa-arrow-${parseFloat(this.metricData.change) > 0 ? 'up' : 'down'}`} />
                  {Math.abs(this.metricData.change)}%
                </div>
              </div>
            </div>

            <div className="overview-cards">
              <div className="overview-card">
                <div className="card-icon">
                  <i className="fa fa-users" />
                </div>
                <div className="card-content">
                  <div className="card-value">{this.formatNumber(this.analyticsData.overview.totalUsers)}</div>
                  <div className="card-label">Total Users</div>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">
                  <i className="fa fa-clock" />
                </div>
                <div className="card-content">
                  <div className="card-value">{this.formatTime(this.analyticsData.overview.avgSessionDuration)}</div>
                  <div className="card-label">Avg. Session</div>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">
                  <i className="fa fa-sign-out" />
                </div>
                <div className="card-content">
                  <div className="card-value">{this.formatPercentage(this.analyticsData.overview.bounceRate)}</div>
                  <div className="card-label">Bounce Rate</div>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">
                  <i className="fa fa-trophy" />
                </div>
                <div className="card-content">
                  <div className="card-value">{this.formatPercentage(this.analyticsData.overview.conversionRate)}</div>
                  <div className="card-label">Conversion</div>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-main">
            <div className="metric-selector">
              {this.metrics.map(metric => (
                <button
                  key={metric.id}
                  className={classnames('metric-btn', { active: this.selectedMetric === metric.id })}
                  onClick={() => this.setMetric(metric.id)}
                >
                  <i className={`fa ${metric.icon}`} />
                  {metric.name}
                </button>
              ))}
            </div>

            <div className="chart-container">
              <div className="chart-placeholder">
                <i className="fa fa-chart-line" />
                <p>Interactive Chart</p>
                <small>Chart visualization would be rendered here</small>
              </div>
            </div>
          </div>

          <div className="analytics-panels">
            <div className="analytics-panel">
              <h3>Top Pages</h3>
              <div className="pages-list">
                {this.analyticsData.topPages.map((page, index) => (
                  <div key={index} className="page-item">
                    <div className="page-info">
                      <div className="page-path">{page.path}</div>
                      <div className="page-stats">
                        <span>{this.formatNumber(page.views)} views</span>
                        <span>{this.formatTime(page.avgTime)} avg time</span>
                        <span>{this.formatPercentage(page.bounceRate)} bounce</span>
                      </div>
                    </div>
                    <div className="page-bar">
                      <div
                        className="page-bar-fill"
                        style={{ width: `${(page.views / this.analyticsData.topPages[0].views) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-panel">
              <h3>User Journey</h3>
              <div className="journey-steps">
                {this.analyticsData.userBehavior.userJourney.map((step, index) => (
                  <div key={index} className="journey-step">
                    <div className="step-info">
                      <div className="step-name">{step.step}</div>
                      <div className="step-users">{this.formatNumber(step.users)} users</div>
                    </div>
                    <div className="step-dropoff">
                      {index > 0 && (
                        <span className="dropoff-rate">-{this.formatPercentage(step.dropoff)}</span>
                      )}
                    </div>
                    {index < this.analyticsData.userBehavior.userJourney.length - 1 && (
                      <div className="step-connector">
                        <i className="fa fa-arrow-down" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-panel">
              <h3>Device Breakdown</h3>
              <div className="device-breakdown">
                {this.analyticsData.userBehavior.deviceTypes.map((device, index) => (
                  <div key={index} className="device-item">
                    <div className="device-info">
                      <div className="device-name">{device.type}</div>
                      <div className="device-percentage">{this.formatPercentage(device.percentage)}</div>
                    </div>
                    <div className="device-bar">
                      <div
                        className="device-bar-fill"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-panel">
              <h3>Real-time Activity</h3>
              <div className="realtime-stats">
                <div className="realtime-metric">
                  <div className="metric-icon">
                    <i className="fa fa-users" />
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{this.analyticsData.realtime.activeUsers}</div>
                    <div className="metric-label">Active Users</div>
                  </div>
                </div>

                <div className="realtime-metric">
                  <div className="metric-icon">
                    <i className="fa fa-eye" />
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{this.analyticsData.realtime.currentPageViews}</div>
                    <div className="metric-label">Page Views/min</div>
                  </div>
                </div>

                <div className="realtime-metric">
                  <div className="metric-icon">
                    <i className="fa fa-trophy" />
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">{this.analyticsData.realtime.conversions}</div>
                    <div className="metric-label">Conversions</div>
                  </div>
                </div>
              </div>

              <div className="realtime-pages">
                <h4>Popular Pages Right Now</h4>
                {this.analyticsData.realtime.topPages.map((page, index) => (
                  <div key={index} className="realtime-page">
                    <span className="page-path">{page.path}</span>
                    <span className="page-users">{page.activeUsers} users</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {this.showHeatmap && (
            <div className="heatmap-panel">
              <div className="heatmap-header">
                <h3>Heatmap Analysis</h3>
                <div className="heatmap-controls">
                  <select
                    value={this.selectedHeatmapType}
                    onChange={(e) => this.setHeatmapType(e.target.value)}
                  >
                    <option value="clicks">Click Heatmap</option>
                    <option value="scroll">Scroll Depth</option>
                    <option value="attention">Attention Map</option>
                  </select>
                </div>
              </div>

              <div className="heatmap-content">
                {this.selectedHeatmapType === 'clicks' && (
                  <div className="click-heatmap">
                    <div className="heatmap-placeholder">
                      <i className="fa fa-mouse-pointer" />
                      <p>Click heatmap visualization</p>
                      <small>Hotspots would be displayed here</small>
                    </div>
                    <div className="click-data">
                      <h4>Top Click Elements</h4>
                      {this.analyticsData.heatmaps.clickData.map((click, index) => (
                        <div key={index} className="click-item">
                          <span className="element-name">{click.element}</span>
                          <span className="click-count">{click.clicks} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {this.selectedHeatmapType === 'scroll' && (
                  <div className="scroll-heatmap">
                    <div className="scroll-depth-chart">
                      {this.analyticsData.heatmaps.scrollDepth.map((depth, index) => (
                        <div key={index} className="scroll-depth-item">
                          <div className="depth-label">{depth.depth}</div>
                          <div className="depth-bar">
                            <div
                              className="depth-bar-fill"
                              style={{ width: `${depth.percentage}%` }}
                            />
                          </div>
                          <div className="depth-value">{this.formatNumber(depth.users)} users</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .behavioral-analytics {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f8f9fa;
          }

          .analytics-header {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .analytics-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }

          .header-controls {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .time-range-select, .segment-select {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 14px;
          }

          .heatmap-toggle {
            padding: 8px 16px;
            border: 1px solid #ced4da;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .heatmap-toggle:hover, .heatmap-toggle.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .analytics-content {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
          }

          .metrics-overview {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
          }

          .main-metric {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
          }

          .metric-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
          }

          .metric-content {
            flex: 1;
          }

          .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: #212529;
            margin-bottom: 4px;
          }

          .metric-name {
            font-size: 16px;
            color: #6c757d;
            margin-bottom: 8px;
          }

          .metric-change {
            font-size: 14px;
            font-weight: 500;
          }

          .metric-change.positive {
            color: #28a745;
          }

          .metric-change.negative {
            color: #dc3545;
          }

          .overview-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }

          .overview-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
          }

          .card-icon {
            width: 40px;
            height: 40px;
            background: #007bff;
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card-content {
            flex: 1;
          }

          .card-value {
            font-size: 20px;
            font-weight: bold;
            color: #212529;
            margin-bottom: 2px;
          }

          .card-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
          }

          .analytics-main {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e9ecef;
          }

          .metric-selector {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .metric-btn {
            padding: 8px 16px;
            border: 2px solid #e9ecef;
            background: white;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }

          .metric-btn:hover, .metric-btn.active {
            border-color: #007bff;
            background: #f8f9fa;
          }

          .chart-container {
            height: 300px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fafafa;
          }

          .chart-placeholder {
            text-align: center;
            color: #6c757d;
          }

          .chart-placeholder i {
            font-size: 48px;
            margin-bottom: 12px;
          }

          .analytics-panels {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
            flex: 1;
            overflow-y: auto;
          }

          .analytics-panel {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .analytics-panel h3 {
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: #212529;
          }

          .pages-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .page-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .page-info {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .page-path {
            font-weight: 500;
            color: #007bff;
          }

          .page-stats {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #6c757d;
          }

          .page-bar {
            height: 4px;
            background: #e9ecef;
            border-radius: 2px;
            overflow: hidden;
          }

          .page-bar-fill {
            height: 100%;
            background: #007bff;
            border-radius: 2px;
          }

          .journey-steps {
            position: relative;
          }

          .journey-step {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            position: relative;
          }

          .step-info {
            flex: 1;
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
          }

          .step-name {
            font-weight: 500;
            margin-bottom: 4px;
          }

          .step-users {
            font-size: 12px;
            color: #6c757d;
          }

          .step-dropoff {
            font-size: 12px;
            color: #dc3545;
            font-weight: 500;
          }

          .step-connector {
            position: absolute;
            left: 50%;
            top: 100%;
            transform: translateX(-50%);
            color: #6c757d;
            z-index: 1;
          }

          .device-breakdown {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .device-item {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .device-info {
            flex: 1;
            display: flex;
            justify-content: space-between;
          }

          .device-name {
            font-weight: 500;
          }

          .device-percentage {
            color: #6c757d;
          }

          .device-bar {
            flex: 2;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
          }

          .device-bar-fill {
            height: 100%;
            background: #007bff;
            border-radius: 4px;
          }

          .realtime-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 20px;
          }

          .realtime-metric {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
          }

          .metric-icon {
            width: 32px;
            height: 32px;
            background: #007bff;
            color: white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .metric-content {
            flex: 1;
          }

          .metric-value {
            font-size: 18px;
            font-weight: bold;
            color: #212529;
          }

          .metric-label {
            font-size: 12px;
            color: #6c757d;
          }

          .realtime-pages {
            border-top: 1px solid #e9ecef;
            padding-top: 16px;
          }

          .realtime-pages h4 {
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
          }

          .realtime-page {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f8f9fa;
          }

          .page-path {
            font-size: 14px;
            color: #007bff;
          }

          .page-users {
            font-size: 12px;
            color: #6c757d;
          }

          .heatmap-panel {
            margin: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .heatmap-header {
            padding: 16px 20px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .heatmap-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          }

          .heatmap-controls select {
            padding: 6px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
          }

          .heatmap-content {
            padding: 20px;
          }

          .click-heatmap {
            display: flex;
            gap: 20px;
          }

          .heatmap-placeholder {
            flex: 1;
            height: 200px;
            border: 2px dashed #e9ecef;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #6c757d;
          }

          .heatmap-placeholder i {
            font-size: 32px;
            margin-bottom: 8px;
          }

          .click-data {
            width: 250px;
          }

          .click-data h4 {
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
          }

          .click-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f8f9fa;
          }

          .element-name {
            font-size: 14px;
          }

          .click-count {
            font-size: 12px;
            color: #6c757d;
            font-weight: 500;
          }

          .scroll-depth-chart {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .scroll-depth-item {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .depth-label {
            width: 60px;
            font-size: 14px;
            font-weight: 500;
          }

          .depth-bar {
            flex: 1;
            height: 12px;
            background: #e9ecef;
            border-radius: 6px;
            overflow: hidden;
          }

          .depth-bar-fill {
            height: 100%;
            background: #007bff;
            border-radius: 6px;
          }

          .depth-value {
            width: 80px;
            font-size: 12px;
            color: #6c757d;
            text-align: right;
          }

          @media (max-width: 1200px) {
            .analytics-panels {
              grid-template-columns: 1fr;
            }

            .main-metric {
              flex-direction: column;
              text-align: center;
              gap: 12px;
            }

            .overview-cards {
              grid-template-columns: repeat(2, 1fr);
            }

            .click-heatmap {
              flex-direction: column;
            }

            .click-data {
              width: 100%;
            }
          }

          @media (max-width: 768px) {
            .header-controls {
              flex-direction: column;
              gap: 8px;
            }

            .analytics-header {
              flex-direction: column;
              gap: 16px;
              text-align: center;
            }

            .main-metric {
              flex-direction: column;
              gap: 12px;
            }

            .overview-cards {
              grid-template-columns: 1fr;
            }

            .metric-selector {
              justify-content: center;
            }

            .realtime-stats {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }
}

BehavioralAnalytics.propTypes = {
  className: PropTypes.string
};