// White-label theming system
export const whiteLabelSystem = {
  themes: {
    default: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      muted: '#6b7280'
    },
    dark: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      muted: '#64748b'
    },
    light: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      muted: '#64748b'
    }
  },

  currentTheme: 'default',

  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      this.applyTheme(this.themes[themeName]);
    }
  },

  applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  },

  getCurrentTheme() {
    return this.themes[this.currentTheme];
  },

  customizeTheme(customizations) {
    const current = this.getCurrentTheme();
    return { ...current, ...customizations };
  }
};