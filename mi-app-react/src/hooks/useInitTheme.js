import { useEffect } from 'react';
import useThemeStore from '../stores/themeStore';

export default function useInitTheme() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const initialized = useThemeStore((state) => state.initialized);
  const setDarkMode = useThemeStore((state) => state.setDarkMode);
  const setInitialized = useThemeStore((state) => state.setInitialized);

  useEffect(() => {
    if (initialized || typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const darkMode = savedTheme === '' || (!savedTheme && prefersDark);

    setDarkMode(darkMode);
    setInitialized();
  }, [initialized, setDarkMode, setInitialized]);

  useEffect(() => {
    if (!initialized || typeof document === 'undefined') return;

    const root = document.documentElement;
    root.classList.add('theme-transition');

    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    const timeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isDarkMode, initialized]);
}
