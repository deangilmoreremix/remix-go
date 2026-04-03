class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.maxMemorySize = 50; // Max items in memory cache
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  // Set cache item with optional TTL
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    const cacheItem = { value, expiresAt };

    // Memory cache
    this.memoryCache.set(key, cacheItem);

    // Keep memory cache size in check
    if (this.memoryCache.size > this.maxMemorySize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    // Local storage for persistence (only serializable data)
    try {
      if (this.isSerializable(value)) {
        localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
      }
    } catch (error) {
      console.warn('Failed to cache to localStorage:', error);
    }
  }

  // Get cache item
  get(key) {
    // Check memory cache first
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.value;
    }

    // Check local storage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!this.isExpired(parsed)) {
          // Restore to memory cache
          this.memoryCache.set(key, parsed);
          return parsed.value;
        } else {
          // Remove expired item
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      console.warn('Failed to read from localStorage cache:', error);
    }

    return null;
  }

  // Delete cache item
  delete(key) {
    this.memoryCache.delete(key);
    localStorage.removeItem(`cache_${key}`);
  }

  // Clear all cache
  clear() {
    this.memoryCache.clear();
    
    // Clear localStorage cache items
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Check if cache item is expired
  isExpired(cacheItem) {
    return Date.now() > cacheItem.expiresAt;
  }

  // Check if value is serializable for localStorage
  isSerializable(value) {
    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  // Get or set with function (cache-aside pattern)
  async getOrSet(key, fetcher, ttl = this.defaultTTL) {
    let value = this.get(key);
    
    if (value === null) {
      value = await fetcher();
      this.set(key, value, ttl);
    }
    
    return value;
  }

  // Get cache stats
  getStats() {
    return {
      memoryCacheSize: this.memoryCache.size,
      localStorageItems: Object.keys(localStorage).filter(key => key.startsWith('cache_')).length,
      maxMemorySize: this.maxMemorySize,
      defaultTTL: this.defaultTTL,
    };
  }
}

// Create singleton instance
const cache = new CacheService();

// API-specific caching methods
export class APICache extends CacheService {
  constructor() {
    super();
    this.apiTTL = 10 * 60 * 1000; // 10 minutes for API responses
  }

  // Cache API response
  async cacheAPIResponse(url, method = 'GET', response, customTTL) {
    const key = `api_${method}_${btoa(url)}`;
    const ttl = customTTL || this.apiTTL;
    this.set(key, response, ttl);
    return response;
  }

  // Get cached API response
  getCachedAPIResponse(url, method = 'GET') {
    const key = `api_${method}_${btoa(url)}`;
    return this.get(key);
  }

  // Clear API cache for specific endpoint
  clearAPICache(url, method = 'GET') {
    const key = `api_${method}_${btoa(url)}`;
    this.delete(key);
  }

  // Clear all API cache
  clearAllAPICache() {
    const keys = Array.from(this.memoryCache.keys());
    keys.forEach(key => {
      if (key.startsWith('api_')) {
        this.delete(key);
      }
    });
  }
}

// Project-specific caching
export class ProjectCache extends CacheService {
  constructor() {
    super();
    this.projectTTL = 30 * 60 * 1000; // 30 minutes for project data
  }

  // Cache project data
  cacheProject(projectId, projectData) {
    const key = `project_${projectId}`;
    this.set(key, projectData, this.projectTTL);
  }

  // Get cached project
  getCachedProject(projectId) {
    const key = `project_${projectId}`;
    return this.get(key);
  }

  // Cache project list for user
  cacheProjectList(userId, projects) {
    const key = `projects_user_${userId}`;
    this.set(key, projects, this.projectTTL);
  }

  // Get cached project list
  getCachedProjectList(userId) {
    const key = `projects_user_${userId}`;
    return this.get(key);
  }

  // Invalidate user projects cache
  invalidateUserProjects(userId) {
    const key = `projects_user_${userId}`;
    this.delete(key);
  }
}

// User preferences caching
export class UserPreferencesCache extends CacheService {
  constructor() {
    super();
    this.preferencesTTL = 60 * 60 * 1000; // 1 hour for preferences
  }

  // Cache user preferences
  cachePreferences(userId, preferences) {
    const key = `preferences_${userId}`;
    this.set(key, preferences, this.preferencesTTL);
  }

  // Get cached preferences
  getCachedPreferences(userId) {
    const key = `preferences_${userId}`;
    return this.get(key);
  }

  // Update specific preference
  updatePreference(userId, key, value) {
    const preferences = this.getCachedPreferences(userId) || {};
    preferences[key] = value;
    this.cachePreferences(userId, preferences);
  }
}

// Export instances
export const apiCache = new APICache();
export const projectCache = new ProjectCache();
export const userPreferencesCache = new UserPreferencesCache();
export default cache;

// Cleanup expired items periodically
setInterval(() => {
  // Clean up expired localStorage items
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('cache_')) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (Date.now() > item.expiresAt) {
          localStorage.removeItem(key);
        }
      } catch {
        // Remove corrupted items
        localStorage.removeItem(key);
      }
    }
  });
}, 5 * 60 * 1000); // Clean up every 5 minutes
