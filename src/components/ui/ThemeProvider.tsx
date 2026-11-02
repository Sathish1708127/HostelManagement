import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Component
 * Manages light/dark theme with CSS custom properties
 * Supports: light, dark, auto (system preference)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved || 'auto';
  });

  const [isDark, setIsDark] = React.useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const dark =
        theme === 'dark' ||
        (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      setIsDark(dark);

      // Update document class and CSS variables
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Set CSS custom properties for theme colors
      const root = document.documentElement;
      if (dark) {
        root.style.setProperty('--color-bg', '#111827');
        root.style.setProperty('--color-text', '#f3f4f6');
        root.style.setProperty('--color-border', '#374151');
      } else {
        root.style.setProperty('--color-bg', '#ffffff');
        root.style.setProperty('--color-text', '#111827');
        root.style.setProperty('--color-border', '#e5e7eb');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Access theme context anywhere in the app
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * ThemeToggle Component
 * Quick toggle button for light/dark/auto modes
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
      {(['light', 'dark', 'auto'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-3 py-1 rounded font-medium text-sm transition ${
            theme === t
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          title={`Switch to ${t} mode`}
        >
          {t === 'light' && '☀️'}
          {t === 'dark' && '🌙'}
          {t === 'auto' && '🔄'}
        </button>
      ))}
    </div>
  );
}
