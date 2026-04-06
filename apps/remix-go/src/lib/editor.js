// Editor utilities and helpers
export const editorStateManager = {
  state: {
    activeElement: null,
    project: null,
    checkpoints: [],
    currentCheckpoint: 0
  },

  setActiveElement(element) {
    this.state.activeElement = element;
  },

  getActiveElement() {
    return this.state.activeElement;
  },

  setProject(project) {
    this.state.project = project;
  },

  getProject() {
    return this.state.project;
  },

  addCheckpoint(checkpoint) {
    this.state.checkpoints.push(checkpoint);
  },

  setCurrentCheckpoint(index) {
    this.state.currentCheckpoint = index;
  },

  getCurrentCheckpoint() {
    return this.state.checkpoints[this.state.currentCheckpoint];
  }
};

export const projectUtils = {
  createProject(name, settings = {}) {
    return {
      id: Date.now().toString(),
      name,
      settings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateProject(project, updates) {
    return {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }
};