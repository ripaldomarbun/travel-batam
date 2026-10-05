import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

function getInitialTheme(): Theme {
  try {
    // 1. Jika pengguna pernah manual memilih preferensi tema (Light / Dark)
    const saved = localStorage.getItem('la_transport_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // 2. Jika baru pertama kali buka, sesuaikan dengan preferensi sistem perangkat (OS/Browser)
    return getSystemTheme();
  } catch {
    return 'dark';
  }
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [hasUserPreference, setHasUserPreference] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('la_transport_theme');
      return saved === 'light' || saved === 'dark';
    } catch {
      return false;
    }
  });

  // Jika pengunjung belum memilih manual, dengarkan perubahan mode dari sistem perangkat
  useEffect(() => {
    if (hasUserPreference) return;
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
      // Fallback untuk browser mobile versi lama
      mediaQuery.addListener(handleSystemChange);
      return () => mediaQuery.removeListener(handleSystemChange);
    }
  }, [hasUserPreference]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');

    root.classList.add(theme);
    body.classList.add(theme);

    root.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setHasUserPreference(true);
    setThemeState(nextTheme);
    try {
      localStorage.setItem('la_transport_theme', nextTheme);
    } catch {
      // ignore
    }
  };

  const setTheme = (newTheme: Theme) => {
    setHasUserPreference(true);
    setThemeState(newTheme);
    try {
      localStorage.setItem('la_transport_theme', newTheme);
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
