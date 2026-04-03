// Environment configuration management
// Load environment variables with validation and defaults

const config = {
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceKey: import.meta.env.VITE_SUPABASE_SERVICE_KEY,
  },

  // Application settings
  app: {
    name: 'Remix Go',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
    debug: import.meta.env.DEV || false,
    port: import.meta.env.PORT || 5173,
  },

  // Feature flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'false',
    performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false',
    realTimeSync: import.meta.env.VITE_ENABLE_REAL_TIME_SYNC !== 'false',
  },

  // External services
  services: {
    analytics: {
      enabled: import.meta.env.VITE_ANALYTICS_PROVIDER,
      key: import.meta.env.VITE_ANALYTICS_KEY,
    },
    cdn: {
      url: import.meta.env.VITE_CDN_URL,
    },
  },

  // Performance settings
  performance: {
    maxRetries: parseInt(import.meta.env.VITE_MAX_RETRIES) || 3,
    retryDelay: parseInt(import.meta.env.VITE_RETRY_DELAY) || 1000,
    cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT) || 300000, // 5 minutes
  },

  // Security settings
  security: {
    enableCSP: import.meta.env.VITE_ENABLE_CSP !== 'false',
    enableHSTS: import.meta.env.VITE_ENABLE_HSTS === 'true',
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
  },

  // API settings
  api: {
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000, // 30 seconds
    retries: parseInt(import.meta.env.VITE_API_RETRIES) || 3,
  }
};

// Validation
function validateConfig() {
  const errors = [];

  // Required Supabase configuration
  if (!config.supabase.url) {
    errors.push('VITE_SUPABASE_URL is required');
  }

  if (!config.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }

  // Validate URLs
  if (config.supabase.url && !config.supabase.url.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must use HTTPS');
  }

  if (config.services.cdn.url && !config.services.cdn.url.startsWith('https://')) {
    errors.push('VITE_CDN_URL must use HTTPS');
  }

  // Validate numeric values
  if (config.performance.maxRetries < 0) {
    errors.push('VITE_MAX_RETRIES must be non-negative');
  }

  if (config.api.timeout < 1000) {
    errors.push('VITE_API_TIMEOUT must be at least 1000ms');
  }

  if (errors.length > 0) {
    const errorMessage = `Configuration validation failed:\n${errors.join('\n')}`;
    console.error(errorMessage);
    
    if (config.app.environment === 'production') {
      throw new Error(errorMessage);
    }
  }

  return errors.length === 0;
}

// Validate on load
validateConfig();

// Freeze configuration in production
if (config.app.environment === 'production') {
  Object.freeze(config);
  Object.freeze(config.supabase);
  Object.freeze(config.app);
  Object.freeze(config.features);
  Object.freeze(config.services);
  Object.freeze(config.performance);
  Object.freeze(config.security);
  Object.freeze(config.api);
}

export default config;

// Helper functions
export function isProduction() {
  return config.app.environment === 'production';
}

export function isDevelopment() {
  return config.app.environment === 'development';
}

export function getEnvVar(name, defaultValue = undefined) {
  return import.meta.env[name] || defaultValue;
}

export function requireEnvVar(name) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}
