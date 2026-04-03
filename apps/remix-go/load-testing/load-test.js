import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Warm up to 10 users
    { duration: '5m', target: 50 },   // Ramp up to 50 users
    { duration: '10m', target: 100 }, // Sustained load at 100 users
    { duration: '5m', target: 200 },  // Stress test at 200 users
    { duration: '2m', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1s
    http_req_failed: ['rate<0.1'],     // Error rate should be below 10%
    errors: ['rate<0.1'],              // Custom error rate
  },
};

// Base URL for the application
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

// Test scenarios
export default function () {
  // Scenario 1: Home page load
  const homeResponse = http.get(`${BASE_URL}/`);
  check(homeResponse, {
    'home page status is 200': (r) => r.status === 200,
    'home page loads fast': (r) => r.timings.duration < 1000,
    'home page has content': (r) => r.body.length > 100,
  }) || errorRate.add(1);
  
  responseTime.add(homeResponse.timings.duration);
  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds

  // Scenario 2: Editor page load
  const editorResponse = http.get(`${BASE_URL}/#/editor`);
  check(editorResponse, {
    'editor page status is 200': (r) => r.status === 200,
    'editor page loads within limit': (r) => r.timings.duration < 2000,
    'editor has GrapesJS loaded': (r) => r.body.includes('grapesjs'),
  }) || errorRate.add(1);
  
  responseTime.add(editorResponse.timings.duration);
  sleep(Math.random() * 3 + 2); // Random sleep 2-5 seconds

  // Scenario 3: API simulation (if available)
  // Simulate project creation API call
  const projectData = {
    name: `Load Test Project ${Math.random()}`,
    description: 'Created during load testing',
    user_id: 'test-user-' + Math.floor(Math.random() * 1000),
  };
  
  const apiResponse = http.post(
    `${BASE_URL}/api/projects`, // This would be your actual API endpoint
    JSON.stringify(projectData),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  check(apiResponse, {
    'API responds': (r) => r.status !== 0, // Not a network error
    'API response time acceptable': (r) => r.timings.duration < 3000,
  }) || errorRate.add(1);
  
  responseTime.add(apiResponse.timings.duration);
  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds

  // Scenario 4: Static asset loading
  const assetUrls = [
    '/assets/index.css',
    '/assets/index.js',
    '/assets/vendor.js',
  ];
  
  assetUrls.forEach(url => {
    const assetResponse = http.get(`${BASE_URL}${url}`);
    check(assetResponse, {
      'asset loads': (r) => r.status === 200,
      'asset loads fast': (r) => r.timings.duration < 500,
      'asset has content': (r) => r.body.length > 0,
    }) || errorRate.add(1);
    
    responseTime.add(assetResponse.timings.duration);
  });

  // Scenario 5: Error simulation (test error handling)
  const errorResponse = http.get(`${BASE_URL}/non-existent-page`);
  check(errorResponse, {
    'error page handled': (r) => r.status === 404 || r.status === 200, // 200 might be SPA fallback
  }) || errorRate.add(1);
  
  responseTime.add(errorResponse.timings.duration);
}

// Setup function (runs before the test starts)
export function setup() {
  console.log('Starting load test setup...');
  
  // Warm up the application
  const warmupResponse = http.get(`${BASE_URL}/`);
  if (warmupResponse.status !== 200) {
    console.error('Warmup failed:', warmupResponse.status);
    return;
  }
  
  console.log('Load test setup complete');
  return { timestamp: new Date().toISOString() };
}

// Teardown function (runs after the test ends)
export function teardown(data) {
  console.log('Load test completed at:', new Date().toISOString());
  console.log('Test started at:', data.timestamp);
}

// Handle summary (runs after all tests complete)
export function handleSummary(data) {
  const summary = {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'load-test-results.json': JSON.stringify(data, null, 2),
    'load-test-report.html': htmlReport(data),
  };
  
  return summary;
}

function textSummary(data, options) {
  return `
Load Test Summary
==================

Test Duration: ${data.metrics.duration.values.avg}ms
Total Requests: ${data.metrics.http_reqs.values.count}
Failed Requests: ${data.metrics.http_req_failed.values.rate * 100}%

Response Time (avg): ${Math.round(data.metrics.http_req_duration.values.avg)}ms
Response Time (95th): ${Math.round(data.metrics.http_req_duration.values['p(95)']}ms
Response Time (99th): ${Math.round(data.metrics.http_req_duration.values['p(99)']}ms

Error Rate: ${(data.metrics.errors ? data.metrics.errors.values.rate * 100 : 0).toFixed(2)}%

Custom Metrics:
- Response Time Trend: ${Math.round(data.metrics.response_time.values.avg)}ms avg
  `;
}

function htmlReport(data) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Remix Go Load Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .pass { color: green; }
        .fail { color: red; }
        .warn { color: orange; }
    </style>
</head>
<body>
    <h1>Remix Go Load Test Report</h1>
    <div class="metric">
        <h3>Test Results</h3>
        <p>Duration: ${Math.round(data.metrics.duration.values.avg)}ms</p>
        <p>Requests: ${data.metrics.http_reqs.values.count}</p>
        <p>Failed: <span class="${data.metrics.http_req_failed.values.rate > 0.1 ? 'fail' : 'pass'}">${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</span></p>
        <p>Avg Response Time: <span class="${data.metrics.http_req_duration.values.avg > 1000 ? 'warn' : 'pass'}">${Math.round(data.metrics.http_req_duration.values.avg)}ms</span></p>
        <p>95th Percentile: <span class="${data.metrics.http_req_duration.values['p(95)'] > 2000 ? 'fail' : 'pass'}">${Math.round(data.metrics.http_req_duration.values['p(95)']}ms</span></p>
    </div>
</body>
</html>
  `;
}
