import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Load from localStorage or default to 'light'
    const saved = localStorage.getItem('wiki-journey-theme');
    // Migrate 'classic' theme to 'light' if found
    if (saved === 'classic') {
      localStorage.setItem('wiki-journey-theme', 'light');
      return 'light';
    }
    return saved || 'light';
  });

  useEffect(() => {
    // Save to localStorage whenever theme changes
    localStorage.setItem('wiki-journey-theme', theme);
    
    // Apply theme class to document root
    document.documentElement.className = theme;
    
    // Remove other theme classes
    document.documentElement.classList.remove('light', 'dark', 'classic');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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

