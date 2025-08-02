import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ThemeMode, ColorTheme } from '../types';

export function useTheme() {
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>('appearance', 'system');
  const [colorTheme, setColorTheme] = useLocalStorage<ColorTheme>('colorTheme', 'blue');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateTheme = () => {
      if (themeMode === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setActualTheme(systemTheme);
      } else {
        setActualTheme(themeMode);
      }
    };

    updateTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [themeMode]);

  return {
    themeMode,
    setThemeMode,
    colorTheme,
    setColorTheme,
    actualTheme,
  };
}