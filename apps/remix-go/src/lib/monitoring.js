import { getSupabase } from './supabase.js';

class MonitoringService {
  constructor() {
    this.supabase = getSupabase();
    this.queue = [];
    this.flushInterval = setInterval(() => this.flushQueue(), 30000); // Flush every 30 seconds
  }

  // Track application errors
  async trackError(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context: JSON.stringify({
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        app: 'remix-go',
        version: '1.0.0'
      })
    };

    // Add to queue for batch processing
    this.queue.push({
      table: 'error_logs',
      data: errorData
    });

    // Immediate console logging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Tracked error:', errorData);
    }
  }

  // Track performance metrics
  async trackPerformance(metric, value, context = {}) {
    const perfData = {
      metric,
      value,
      context: JSON.stringify({
        ...context,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        app: 'remix-go'
      })
    };

    this.queue.push({
      table: 'performance_metrics', 
      data: perfData
    });
  }

  // Track user interactions
  async trackEvent(eventName, properties = {}) {
    const eventData = {
      event: eventName,
      properties: JSON.stringify({
        ...properties,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        app: 'remix-go'
      })
    };

    this.queue.push({
      table: 'user_events',
      data: eventData
    });
  }

  // Track page views
  async trackPageView(page, properties = {}) {
    await this.trackEvent('page_view', {
      page,
      ...properties
    });
  }

  // Flush queued data to Supabase
  async flushQueue() {
    if (this.queue.length === 0 || !this.supabase) return;

    const queueCopy = [...this.queue];
    this.queue = [];

    try {
      // Group by table for batch inserts
      const grouped = queueCopy.reduce((acc, item) => {
        if (!acc[item.table]) acc[item.table] = [];
        acc[item.table].push(item.data);
        return acc;
      }, {});

      // Execute batch inserts
      for (const [table, records] of Object.entries(grouped)) {
        await this.supabase
          .from(table)
          .insert(records)
          .then(() => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`Flushed ${records.length} records to ${table}`);
            }
          })
          .catch(error => {
            console.error(`Failed to flush to ${table}:`, error);
            // Re-queue failed items
            this.queue.unshift(...records.map(data => ({ table, data })));
          });
      }
    } catch (error) {
      console.error('Failed to flush monitoring queue:', error);
      // Re-queue all items
      this.queue.unshift(...queueCopy);
    }
  }

  // Health check
  async healthCheck() {
    if (!this.supabase) return { status: 'unhealthy', reason: 'No Supabase client' };

    try {
      const { data, error } = await this.supabase
        .from('health_check')
        .select('count')
        .single();

      return {
        status: error ? 'unhealthy' : 'healthy',
        supabase: !error,
        queueSize: this.queue.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        reason: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushQueue(); // Final flush
  }
}

// Create singleton instance
const monitoring = new MonitoringService();

// Make globally available
window.monitoring = monitoring;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  monitoring.destroy();
});

// Track page load performance
window.addEventListener('load', () => {
  const loadTime = performance.now();
  monitoring.trackPerformance('page_load_time', loadTime, {
    domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd || 0,
    fullyLoaded: loadTime
  });
});

// Track JavaScript errors
window.addEventListener('error', (event) => {
  monitoring.trackError(event.error || new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    type: 'javascript_error'
  });
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  monitoring.trackError(event.reason || new Error('Unhandled promise rejection'), {
    type: 'unhandled_rejection'
  });
});

export default monitoring;
