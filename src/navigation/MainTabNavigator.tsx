import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

import { ROUTES } from '@navigation/routes';
import { MainTabParamList } from '@appTypes/navigation.types';

import { HomeScreen } from '@features/home';
import { ProfileScreen } from '@features/profile';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        tabBarStyle: { backgroundColor: colors.card },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === ROUTES.MAIN.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.MAIN.PROFILE) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={ROUTES.MAIN.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.MAIN.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
};
