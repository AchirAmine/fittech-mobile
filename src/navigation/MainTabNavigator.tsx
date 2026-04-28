import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { ROUTES } from '@navigation/routes';
import { MainTabParamList } from '@appTypes/navigation.types';
import { Theme } from '../shared/constants/theme';
import { HomeNavigator } from './HomeNavigator';
import { MembershipNavigator } from './MembershipNavigator';
import { AccountNavigator } from './AccountNavigator';
import { CoursesNavigator } from './CoursesNavigator';
import { ChatNavigator } from './ChatNavigator';
import PlanningScreen from '@features/planning/screens/PlanningScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator<MainTabParamList>();

const getTabBarVisibility = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? ROUTES.MAIN.HOME;
  
  if (
    routeName === ROUTES.MAIN.CHECK_IN || 
    routeName === ROUTES.MAIN.CHECK_IN_SELECTION || 
    routeName === ROUTES.MAIN.COURSE_ATTENDANCE
  ) {
    return 'none';
  }
  return 'flex';
};

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
        headerTitleStyle: {
          fontFamily: Theme.Typography.fontFamily.bold,
          fontSize: 20,
        },
        headerShadowVisible: false,
        tabBarStyle: { 
          backgroundColor: colors.card, 
          borderTopWidth: 0, 
          elevation: 5,
          display: getTabBarVisibility(route) as any
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === ROUTES.MAIN.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.MAIN.COURSES) {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === ROUTES.MAIN.MEMBERSHIP) {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === ROUTES.MAIN.ACCOUNT) {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === ROUTES.MAIN.CHAT) {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
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
        name={ROUTES.MAIN.COURSES} 
        component={CoursesNavigator} 
        options={{ 
          tabBarLabel: 'Courses',
          title: 'Courses',
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name={ROUTES.MAIN.CHAT} 
        component={ChatNavigator} 
        options={{ 
          tabBarLabel: 'Chat',
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
