import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function getSupabase() {
  if (!supabaseInstance && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
}

export function isConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// Enhanced Supabase client with error handling and retry logic
const supabase = getSupabase();

if (supabase) {
  // Add error handling
  supabase.handleError = (error) => {
    console.error('Supabase error:', error);

    // Send error to analytics if available
    if (window.analytics) {
      window.analytics.track('Supabase Error', {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: Date.now()
      });
    }
  };

  supabase.withRetry = async (operation, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };
}

// Auth helpers
export async function signUp(email, password) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');
  return sb.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');
  return sb.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');
  return sb.auth.signOut();
}

export async function getSession() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data?.session || null;
}

export async function getUser() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data?.user || null;
}

// Database helpers
export async function saveProject(project) {
  const sb = getSupabase();
  if (!sb) {
    localStorage.setItem(`remix-go-project-${project.id}`, JSON.stringify(project));
    return project;
  }

  const { data, error } = await sb
    .from('video_projects')
    .upsert({
      id: project.id,
      name: project.name,
      data: project,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function loadProject(id) {
  const sb = getSupabase();
  if (!sb) {
    const data = localStorage.getItem(`remix-go-project-${id}`);
    return data ? JSON.parse(data) : null;
  }

  const { data, error } = await sb
    .from('video_projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data?.data || null;
}

export async function listProjects() {
  const sb = getSupabase();
  if (!sb) {
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('remix-go-project-')) {
        try { projects.push(JSON.parse(localStorage.getItem(key))); } catch { /* skip */ }
      }
    }
    return projects.sort((a, b) => (b.metadata?.updatedAt || 0) - (a.metadata?.updatedAt || 0));
  }

  const { data, error } = await sb
    .from('video_projects')
    .select('id, name, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteProject(id) {
  const sb = getSupabase();
  if (!sb) {
    localStorage.removeItem(`remix-go-project-${id}`);
    return;
  }

  const { error } = await sb
    .from('video_projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Shared database operations for cross-app compatibility
export class ProjectManager {
  // Create project accessible from both apps
  static async createProject(projectData, userId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase not configured');

    const { data, error } = await sb
      .from('projects')
      .insert({
        ...projectData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_source: 'remix-go', // Track which app created it
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get projects with cross-app visibility
  static async getUserProjects(userId, options = {}) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase not configured');

    const { app_filter, limit = 50, offset = 0 } = options;

    let query = sb
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (app_filter) {
      query = query.eq('app_source', app_filter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Real-time subscription for project updates
  static subscribeToProjects(userId, callback) {
    const sb = getSupabase();
    if (!sb) return null;

    return sb
      .channel('projects')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }

  // Sync project between apps
  static async syncProjectToMainApp(projectId) {
    // Notify main app of project updates
    window.parent.postMessage({
      type: 'PROJECT_SYNC',
      projectId,
      action: 'updated'
    }, '*');
  }
}

export class MediaManager {
  constructor(bucketName = 'media-assets') {
    this.bucket = bucketName;
  }

  // Upload file to shared storage
  async uploadFile(file, path, options = {}) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase not configured');

    const { data, error } = await sb.storage
      .from(this.bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      });

    if (error) throw error;

    // Create database record
    const { data: record, error: dbError } = await sb
      .from('media_assets')
      .insert({
        filename: file.name,
        path: data.path,
        size: file.size,
        mime_type: file.type,
        bucket: this.bucket,
        uploaded_by: options.userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return { ...data, record };
  }

  // Get public URL for media asset
  getPublicUrl(path) {
    const sb = getSupabase();
    if (!sb) return '';
    const { data } = sb.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  // List user's media assets
  async listUserAssets(userId, options = {}) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase not configured');

    const { limit = 50, offset = 0, type } = options;

    let query = sb
      .from('media_assets')
      .select('*')
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('mime_type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

// Storage helpers
export async function uploadFile(bucket, path, file) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');

  const { data, error } = await sb.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) throw error;
  return data;
}

export function getPublicUrl(bucket, path) {
  const sb = getSupabase();
  if (!sb) return '';
  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
}

// Table schemas (reference for Supabase dashboard setup):
/*
CREATE TABLE video_projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Untitled',
  data JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT REFERENCES video_projects(id),
  type TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt TEXT,
  status TEXT DEFAULT 'pending',
  result_url TEXT,
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE video_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects" ON video_projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own generations" ON generations
  FOR ALL USING (auth.uid() = user_id);
*/

export default {
  getSupabase,
  isConfigured,
  signUp,
  signIn,
  signOut,
  getSession,
  getUser,
  saveProject,
  loadProject,
  listProjects,
  deleteProject,
  uploadFile,
  getPublicUrl,
};
