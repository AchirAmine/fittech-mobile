import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, RoseColors, PurpleColors, ColorTheme } from '@shared/constants/colors';
import logger from '@shared/utils/logger';

type ThemeType = 'light' | 'dark' | 'rose' | 'purple' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  resolvedTheme: 'light' | 'dark' | 'rose' | 'purple'; 
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

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (['light', 'dark', 'rose', 'purple', 'system'].includes(savedTheme || '')) {
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
    let nextTheme: ThemeType;
    if (themePreference === 'light') nextTheme = 'dark';
    else if (themePreference === 'dark') nextTheme = 'rose';
    else if (themePreference === 'rose') nextTheme = 'purple';
    else nextTheme = 'light';
    
    setTheme(nextTheme);
  }, [themePreference, setTheme]);

  const resolvedTheme = useMemo((): 'light' | 'dark' | 'rose' | 'purple' => {
    if (themePreference === 'system') {
      return systemColorScheme || 'light';
    }
    return themePreference;
  }, [themePreference, systemColorScheme]);

  const colors = useMemo(() => {
    if (resolvedTheme === 'purple') return PurpleColors;
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
