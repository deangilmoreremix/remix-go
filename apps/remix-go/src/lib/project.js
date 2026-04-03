let projectIdCounter = 0;

export function createProject(data = {}) {
  projectIdCounter++;
  return {
    id: data.id || `project-${projectIdCounter}`,
    name: data.name || 'Untitled Project',
    description: data.description || '',
    source: data.source || null,
    sourceType: data.sourceType || null,
    stages: data.stages || [
      { id: 'video', label: 'Video', type: 'VIDEO_CUSTOMISE' },
      { id: 'audio', label: 'Audio', type: 'AUDIO_CUSTOMISE' },
      { id: 'captions', label: 'Captions', type: 'CAPTION_CUSTOMISE' },
    ],
    currentStage: data.currentStage || 0,
    overlays: data.overlays || [],
    settings: {
      aspectRatio: '16:9',
      autoplay: true,
      controls: true,
      loop: false,
      muted: false,
      ...(data.settings || {}),
    },
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      publishedAt: null,
      duration: data.duration || 0,
      thumbnail: data.thumbnail || null,
    },
    publish: {
      url: null,
      embedCode: null,
      isPublished: false,
    },
  };
}

export function updateProject(project, updates) {
  return {
    ...project,
    ...updates,
    metadata: {
      ...project.metadata,
      updatedAt: Date.now(),
    },
  };
}

export function addOverlay(project, overlay) {
  const id = `overlay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    ...project,
    overlays: [...project.overlays, { id, ...overlay }],
    metadata: { ...project.metadata, updatedAt: Date.now() },
  };
}

export function removeOverlay(project, overlayId) {
  return {
    ...project,
    overlays: project.overlays.filter(o => o.id !== overlayId),
    metadata: { ...project.metadata, updatedAt: Date.now() },
  };
}

export function updateOverlay(project, overlayId, updates) {
  return {
    ...project,
    overlays: project.overlays.map(o =>
      o.id === overlayId ? { ...o, ...updates } : o
    ),
    metadata: { ...project.metadata, updatedAt: Date.now() },
  };
}

export function saveProjectToLocalStorage(project) {
  localStorage.setItem(`remix-go-project-${project.id}`, JSON.stringify(project));
}

export function loadProjectFromLocalStorage(id) {
  const data = localStorage.getItem(`remix-go-project-${id}`);
  return data ? JSON.parse(data) : null;
}

export function listProjectsFromLocalStorage() {
  const projects = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('remix-go-project-')) {
      try {
        projects.push(JSON.parse(localStorage.getItem(key)));
      } catch { /* skip corrupt entries */ }
    }
  }
  return projects.sort((a, b) => b.metadata.updatedAt - a.metadata.updatedAt);
}

export default {
  createProject,
  updateProject,
  addOverlay,
  removeOverlay,
  updateOverlay,
  saveProjectToLocalStorage,
  loadProjectFromLocalStorage,
  listProjectsFromLocalStorage,
};
