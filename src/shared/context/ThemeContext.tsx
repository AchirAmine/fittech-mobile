import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, ColorTheme } from '@shared/constants/colors';
import logger from '@shared/utils/logger';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: ColorTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@fittech_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>(systemColorScheme || 'light');

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        } else if (systemColorScheme) {
          setThemeState(systemColorScheme);
        }
      } catch (error) {
        logger.error('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  // Handle system theme changes if no manual override is active (or logic as preferred)
  // For simplicity, we respect manual override first, then system.
  
  const setTheme = useCallback(async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      logger.error('Failed to save theme preference:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const colors = useMemo(() => (theme === 'dark' ? DarkColors : LightColors), [theme]);
  const isDark = theme === 'dark';

  const value = useMemo(() => ({
    theme,
    colors,
    isDark,
    toggleTheme,
    setTheme,
  }), [theme, colors, isDark, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
