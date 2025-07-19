import React, { useEffect, useState } from 'react';
import useThemeStore from '../stores/themeStore';
import useInitTheme from '../hooks/useInitTheme';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme, initialized } = useThemeStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useInitTheme();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .theme-transition * {
        transition: background-color 0.3s ease, color 0.3s ease !important;
      }
    `;
    document.head.appendChild(style);

    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const html = document.documentElement;
    html.classList.add('theme-transition');

    const timeout = setTimeout(() => {
      html.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timeout);
  }, [isDarkMode, initialized]);

  const handleClick = () => {
    setIsTransitioning(true);
    toggleTheme();
    setTimeout(() => setIsTransitioning(false), 350);
  };

  if (!initialized) return null;

  return (
    <div className="theme-toggle-wrapper" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }}>
      <div 
        className={`theme-toggle ${isTransitioning ? 'transitioning' : ''}`}
        onClick={handleClick}
        tabIndex={0}
        role="switch"
        aria-pressed={isDarkMode}
        style={{
          opacity: isTransitioning ? 0.7 : 1,
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
          cursor: 'pointer',
          padding: '6px 12px',
          background: isDarkMode ? '#444' : '#ddd',
          borderRadius: '1rem'
        }}
      >
        {isMobile ? (isDarkMode ? '🌙' : '🔆') : isDarkMode ? '☀️ Modo Claro' : 'Modo Oscuro 🌙'}
      </div>
    </div>
  );
};

export default ThemeToggle;
