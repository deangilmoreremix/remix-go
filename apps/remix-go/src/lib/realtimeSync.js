import { getSupabase } from './supabase.js';

export class RealtimeSync {
  constructor() {
    this.subscriptions = new Map();
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
  }

  // Subscribe to real-time updates
  subscribe(table, filter, callback) {
    const sb = getSupabase();
    if (!sb) return null;

    const channel = sb.channel(`${table}-sync`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table,
        filter
      }, (payload) => {
        // Queue sync operation
        this.syncQueue.push({
          type: payload.eventType,
          table,
          data: payload.new || payload.old,
          callback
        });

        // Process queue
        this.processSyncQueue();
      })
      .subscribe();

    this.subscriptions.set(`${table}-${filter}`, channel);
    return channel;
  }

  // Process queued sync operations
  async processSyncQueue() {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();

      try {
        await this.processSyncOperation(operation);
      } catch (error) {
        console.error('Sync operation failed:', error);
        // Could implement retry logic here
      }
    }
  }

  // Process individual sync operation
  async processSyncOperation(operation) {
    const { type, table, data, callback } = operation;

    // Notify other app of changes
    window.parent.postMessage({
      type: 'DATA_SYNC',
      table,
      operation: type,
      data
    }, '*');

    // Execute callback if provided
    if (callback) {
      callback(operation);
    }
  }

  // Force sync data between apps
  async forceSync(table, userId) {
    const sb = getSupabase();
    if (!sb) return;

    const { data, error } = await sb
      .from(table)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    // Send all data to other app
    window.parent.postMessage({
      type: 'FORCE_SYNC',
      table,
      data
    }, '*');
  }

  // Cleanup subscriptions
  unsubscribe(table, filter) {
    const key = `${table}-${filter}`;
    const channel = this.subscriptions.get(key);
    if (channel) {
      const sb = getSupabase();
      if (sb) {
        sb.removeChannel(channel);
      }
      this.subscriptions.delete(key);
    }
  }

  // Handle online/offline status
  setOnlineStatus(isOnline) {
    this.isOnline = isOnline;

    if (isOnline) {
      // Reconnect subscriptions when coming back online
      this.reconnectSubscriptions();
    }
  }

  async reconnectSubscriptions() {
    // Re-establish all subscriptions
    for (const [key, channel] of this.subscriptions) {
      // The channel should automatically reconnect
      console.log('Reconnecting subscription:', key);
    }
  }

  // Cleanup all subscriptions
  cleanup() {
    for (const [key, channel] of this.subscriptions) {
      const sb = getSupabase();
      if (sb) {
        sb.removeChannel(channel);
      }
    }
    this.subscriptions.clear();
    this.syncQueue = [];
  }
}

// Create singleton instance
export const realtimeSync = new RealtimeSync();

// Handle online/offline events
window.addEventListener('online', () => {
  realtimeSync.setOnlineStatus(true);
});

window.addEventListener('offline', () => {
  realtimeSync.setOnlineStatus(false);
});