import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useTheme } from '@shared/hooks/useTheme';

import { useAppSelector } from '@shared/hooks/useReduxHooks';
import { useProfileSync } from '@shared/hooks/useProfileSync';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthNavigator } from './AuthNavigator';

export const AppNavigator = () => {
  const { colors, isDark } = useTheme();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useProfileSync();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
    },
    dark: isDark,
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
