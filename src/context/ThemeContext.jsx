import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    primary: '#c41230',
    primaryBg: 'rgba(196, 18, 48, 0.1)',
    bg: '#0c0c0f',
    bgSurface: '#141418',
    border: '#2a2a30',
    text: '#ffffff',
    textSecondary: '#a0a0a8',
    textMuted: '#6b6b74',
    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.1)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    danger: '#ef4444',
    dangerBg: 'rgba(239, 68, 68, 0.1)',
  },
  light: {
    primary: '#c41230',
    primaryBg: 'rgba(196, 18, 48, 0.08)',
    bg: '#f8f9fa',
    bgSurface: '#ffffff',
    border: '#e5e5e8',
    text: '#1a1a1f',
    textSecondary: '#4a4a52',
    textMuted: '#8a8a94',
    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.08)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.08)',
    danger: '#ef4444',
    dangerBg: 'rgba(239, 68, 68, 0.08)',
  }
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const theme = isDark ? themes.dark : themes.light;

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
  }, [isDark, theme]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}