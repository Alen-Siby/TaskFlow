import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme') as ThemeMode;
    return stored || 'system';
  });

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', mode);
    }
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return { theme, setTheme };
};