import { useContext } from 'react';
import { ThemeContext } from '@shared/context/ThemeContext';

/**
 * Custom hook to access the current theme and colors.
 * 
 * @example
 * const { colors, theme, toggleTheme, isDark } = useTheme();
 * 
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.textPrimary }}>Hello</Text>
 * </View>
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
