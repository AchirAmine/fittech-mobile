import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountScreen } from '@screens/AccountScreen';
import { ProfileScreen } from '@features/account/screens/ProfileScreen';
import { HealthProfileScreen } from '@features/account/screens/HealthProfileScreen';

import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

export type ProfileStackParamList = {
  AccountMain: undefined;
  ProfileMain: undefined;
  HealthProfile: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const AccountNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontFamily: Theme.Typography.fontFamily.bold,
          fontSize: 20,
        },
        headerShadowVisible: false,
      }} 
      initialRouteName="AccountMain"
    >
      <Stack.Screen 
        name="AccountMain" 
        component={AccountScreen} 
        options={{ title: 'Account' }}
      />
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name="HealthProfile" 
        component={HealthProfileScreen} 
        options={{ title: 'Health Profile' }}
      />
    </Stack.Navigator>
  );
};
