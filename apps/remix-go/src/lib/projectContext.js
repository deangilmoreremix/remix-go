import { sessionManager } from './sessionManager';

class ProjectContextManager {
  constructor() {
    this.currentProject = null;
    this.recentProjects = [];
    this.listeners = new Set();
    this.init();
  }

  init() {
    // Listen for project changes from session manager
    window.addEventListener('project-changed', (event) => {
      this.setCurrentProject(event.detail);
    });

    // Load recent projects from localStorage
    this.loadRecentProjects();

    // Restore current project from session
    if (sessionManager.getCurrentProject()) {
      this.setCurrentProject(sessionManager.getCurrentProject());
    }
  }

  setCurrentProject(project) {
    this.currentProject = project;
    this.updateRecentProjects(project);

    // Notify listeners
    this.listeners.forEach(callback => callback(project));

    // Save to localStorage
    localStorage.setItem('remix-go-current-project', JSON.stringify(project));
  }

  updateRecentProjects(project) {
    if (!project) return;

    // Remove if already exists
    this.recentProjects = this.recentProjects.filter(p => p.id !== project.id);

    // Add to beginning
    this.recentProjects.unshift(project);

    // Keep only last 5
    this.recentProjects = this.recentProjects.slice(0, 5);

    localStorage.setItem('remix-go-recent-projects', JSON.stringify(this.recentProjects));
  }

  loadRecentProjects() {
    try {
      const saved = localStorage.getItem('remix-go-recent-projects');
      if (saved) {
        this.recentProjects = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load recent projects:', error);
      this.recentProjects = [];
    }
  }

  async createProject(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: sessionManager.getCurrentUser()?.id,
          app_source: 'remix-go',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      this.setCurrentProject(data);

      // Notify main app of new project
      window.parent.postMessage({
        type: 'PROJECT_CREATED',
        project: data
      }, '*');

      return data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  async saveProject(updates) {
    if (!this.currentProject) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.currentProject.id)
        .select()
        .single();

      if (error) throw error;

      this.setCurrentProject(data);

      // Notify main app of project update
      window.parent.postMessage({
        type: 'PROJECT_UPDATED',
        project: data
      }, '*');

      return data;
    } catch (error) {
      console.error('Failed to save project:', error);
      throw error;
    }
  }

  async deleteProject(projectId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Remove from recent projects
      this.recentProjects = this.recentProjects.filter(p => p.id !== projectId);

      // Clear current project if it was deleted
      if (this.currentProject?.id === projectId) {
        this.setCurrentProject(null);
      }

      localStorage.setItem('remix-go-recent-projects', JSON.stringify(this.recentProjects));

      // Notify main app
      window.parent.postMessage({
        type: 'PROJECT_DELETED',
        projectId
      }, '*');

    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }

  switchToProject(projectId) {
    // Find project in recent projects
    const project = this.recentProjects.find(p => p.id === projectId);
    if (project) {
      sessionManager.switchProject(projectId);
    } else {
      // Load from database
      sessionManager.loadProject(projectId);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getCurrentProject() {
    return this.currentProject;
  }

  getRecentProjects() {
    return this.recentProjects;
  }

  clearContext() {
    this.currentProject = null;
    this.recentProjects = [];
    localStorage.removeItem('remix-go-current-project');
    localStorage.removeItem('remix-go-recent-projects');
  }
}

// Create singleton instance
export const projectContextManager = new ProjectContextManager();

// Export the manager directly for vanilla JS usage