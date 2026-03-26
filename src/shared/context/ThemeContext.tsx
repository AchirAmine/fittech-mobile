import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, RoseColors, ColorTheme } from '@shared/constants/colors';
import logger from '@shared/utils/logger';

type ThemeType = 'light' | 'dark' | 'rose' | 'system';

interface ThemeContextType {
  theme: ThemeType; // Current preference
  resolvedTheme: 'light' | 'dark' | 'rose'; // Actual active theme
  colors: ColorTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@fittech_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemeType>('system');

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (['light', 'dark', 'rose', 'system'].includes(savedTheme || '')) {
          setThemePreference(savedTheme as ThemeType);
        }
      } catch (error) {
        logger.error('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback(async (newTheme: ThemeType) => {
    setThemePreference(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      logger.error('Failed to save theme preference:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    // Basic toggle logic: light -> dark -> rose -> light
    let nextTheme: ThemeType;
    if (themePreference === 'light') nextTheme = 'dark';
    else if (themePreference === 'dark') nextTheme = 'rose';
    else nextTheme = 'light';
    
    setTheme(nextTheme);
  }, [themePreference, setTheme]);

  const resolvedTheme = useMemo((): 'light' | 'dark' | 'rose' => {
    if (themePreference === 'system') {
      return systemColorScheme || 'light';
    }
    return themePreference;
  }, [themePreference, systemColorScheme]);

  const colors = useMemo(() => {
    if (resolvedTheme === 'rose') return RoseColors;
    return resolvedTheme === 'dark' ? DarkColors : LightColors;
  }, [resolvedTheme]);

  const isDark = resolvedTheme === 'dark';

  const value = useMemo(() => ({
    theme: themePreference,
    resolvedTheme,
    colors,
    isDark,
    toggleTheme,
    setTheme,
  }), [themePreference, resolvedTheme, colors, isDark, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
