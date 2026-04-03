import { supabase } from './supabase';

class SessionManager {
  constructor() {
    this.sessionId = null;
    this.user = null;
    this.currentProject = null;
    this.init();
  }

  init() {
    // Try to restore session from main app via postMessage
    this.requestSessionFromMainApp();

    // Listen for session updates
    window.addEventListener('message', (event) => {
      if (event.data.type === 'SESSION_UPDATE') {
        this.updateSession(event.data.session);
      } else if (event.data.type === 'PROJECT_CONTEXT_UPDATE') {
        this.updateProjectContext(event.data.project);
      } else if (event.data.type === 'LOGOUT_REQUEST') {
        this.logout();
      }
    });

    // Check URL params for project context
    this.loadProjectFromUrl();
  }

  requestSessionFromMainApp() {
    window.parent.postMessage({
      type: 'REQUEST_SESSION',
      app: 'remix-go'
    }, '*');
  }

  updateSession(sessionData) {
    this.sessionId = sessionData.id;
    this.user = sessionData.user;

    // Store in localStorage as backup
    localStorage.setItem('remix-go-session', JSON.stringify(sessionData));

    // Notify app components of session change
    window.dispatchEvent(new CustomEvent('session-changed', {
      detail: sessionData
    }));

    console.log('Session updated in Remix Go:', sessionData.user?.name);
  }

  updateProjectContext(projectData) {
    this.currentProject = projectData;
    localStorage.setItem('remix-go-project-context', JSON.stringify(projectData));

    // Notify app of project change
    window.dispatchEvent(new CustomEvent('project-changed', {
      detail: projectData
    }));

    console.log('Project context updated:', projectData?.name);
  }

  loadProjectFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');

    if (projectId) {
      // Load project data
      this.loadProject(projectId);
    }
  }

  async loadProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      this.updateProjectContext(data);
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  }

  isAuthenticated() {
    return !!this.user && !!this.sessionId;
  }

  logout() {
    // Clear local session
    this.sessionId = null;
    this.user = null;
    this.currentProject = null;

    // Clear localStorage
    localStorage.removeItem('remix-go-session');
    localStorage.removeItem('remix-go-project-context');

    // Notify main app
    window.parent.postMessage({
      type: 'LOGOUT_REQUEST',
      from: 'remix-go'
    }, '*');

    // Redirect to main app
    window.location.href = '/';
  }

  navigateToMainApp(path = '/', context = {}) {
    // Preserve current context
    const navigationContext = {
      fromRemixGo: true,
      currentProject: this.currentProject?.id,
      ...context
    };

    window.parent.postMessage({
      type: 'NAVIGATE_TO_MAIN_APP',
      path,
      context: navigationContext
    }, '*');
  }

  switchProject(projectId) {
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('project', projectId);
    window.history.pushState({}, '', url.toString());

    // Load new project
    this.loadProject(projectId);
  }

  getCurrentUser() {
    return this.user;
  }

  getCurrentProject() {
    return this.currentProject;
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();