import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';

import { ROUTES } from '@navigation/routes';
import { MainTabParamList } from '@appTypes/navigation.types';

import { HomeNavigator } from './HomeNavigator';
import { MembershipNavigator } from './MembershipNavigator';
import { AccountNavigator } from './AccountNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName={ROUTES.MAIN.HOME}
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleAlign: 'center',
        tabBarStyle: { backgroundColor: colors.card },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === ROUTES.MAIN.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.MAIN.MEMBERSHIP) {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === ROUTES.MAIN.ACCOUNT) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name={ROUTES.MAIN.HOME} 
        component={HomeNavigator} 
        options={{ 
          tabBarLabel: 'Home',
          headerShown: false 
        }}
      />
      <Tab.Screen 
        name={ROUTES.MAIN.MEMBERSHIP} 
        component={MembershipNavigator} 
        options={{ 
          tabBarLabel: 'My Plan',
          title: 'MY PLANS',
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name={ROUTES.MAIN.ACCOUNT} 
        component={AccountNavigator} 
        options={{ 
          tabBarLabel: 'Account',
          headerShown: false 
        }} 
      />
    </Tab.Navigator>
  );
};
