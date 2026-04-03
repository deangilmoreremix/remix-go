import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getDefaultTheme());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for theme updates from main app
    const handleThemeUpdate = (event) => {
      if (event.data.type === 'HIGGSFIELD_THEME_UPDATE') {
        const newTheme = event.data.theme;
        setTheme(newTheme);
        localStorage.setItem('higgsfield-theme', JSON.stringify(newTheme));

        // Apply theme to CSS variables
        applyThemeVariables(newTheme);
      }
    };

    // Request theme from main app
    requestThemeFromMainApp();

    window.addEventListener('message', handleThemeUpdate);
    return () => window.removeEventListener('message', handleThemeUpdate);
  }, []);

  const requestThemeFromMainApp = () => {
    // Request theme data from main app
    window.parent.postMessage({
      type: 'REMIX_GO_THEME_REQUEST',
      timestamp: Date.now()
    }, '*');

    // Set timeout to stop loading if no response
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('higgsfield-theme', JSON.stringify(newTheme));
    applyThemeVariables(newTheme);
  };

  const resetTheme = () => {
    const defaultTheme = getDefaultTheme();
    updateTheme(defaultTheme);
  };

  if (isLoading) {
    return <div className="theme-loading">Loading theme...</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function getDefaultTheme() {
  const saved = localStorage.getItem('higgsfield-theme');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn('Failed to parse saved theme:', error);
    }
  }

  // Extract from URL params set by main app
  const urlParams = new URLSearchParams(window.location.search);
  return {
    colors: {
      primary: urlParams.get('primary') || '#007bff',
      secondary: urlParams.get('secondary') || '#6c757d',
      accent: urlParams.get('accent') || '#007bff',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
    },
    typography: {
      fontFamily: urlParams.get('fontFamily') || '"Inter", system-ui, sans-serif',
      fontSize: {
        base: '16px',
        lg: '18px',
        xl: '20px',
      },
    },
    logo: urlParams.get('logo') || '/default-logo.png',
    name: urlParams.get('brand') || 'Higgsfield',
    domain: urlParams.get('domain') || 'default',
    theme: urlParams.get('theme') || 'light', // light, dark, auto
  };
}

function applyThemeVariables(theme) {
  if (!theme || !theme.colors) return;

  const root = document.documentElement;

  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });

  // Apply typography variables
  if (theme.typography) {
    root.style.setProperty('--theme-font-family', theme.typography.fontFamily);

    if (theme.typography.fontSize) {
      Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--theme-font-size-${key}`, value);
      });
    }
  }

  // Apply theme mode
  const themeMode = theme.theme || 'light';
  root.setAttribute('data-theme', themeMode);

  // Apply any custom CSS variables
  if (theme.cssVars) {
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }
}