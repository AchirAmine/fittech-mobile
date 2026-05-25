import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountScreen } from '@features/account/screens/AccountScreen';
import { ProfileScreen } from '@features/account/screens/ProfileScreen';
import { HealthProfileScreen } from '@features/account/screens/HealthProfileScreen';
import { SubscriptionScreen } from '@features/membership/screens/SubscriptionScreen';
import { PaymentDetailsScreen } from '@features/payment/screens/PaymentDetailsScreen';
import { SettingsScreen } from '@features/settings/screens/SettingsScreen';
import { ChangePasswordScreen } from '@features/settings/screens/ChangePasswordScreen';
import { NotificationPreferencesScreen } from '@features/settings/screens/NotificationPreferencesScreen';
import { PrivacySettingsScreen } from '@features/settings/screens/PrivacySettingsScreen';
import { SubscriptionPlan } from '@appTypes/index';
import { ROUTES } from '@navigation/routes';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
export type ProfileStackParamList = {
  AccountMain: undefined;
  ProfileMain: undefined;
  HealthProfile: undefined;
  ActivityHistory: undefined;
  ActivityDetail: {
    title: string;
    description: string;
    status?: string;
    iconName: string;
    iconColor: string;
    iconBg: string;
    time: string;
  };
  SettingsMain: undefined;
  ChangePassword: undefined;
  NotificationPreferences: undefined;
  PrivacySettings: undefined;
  [ROUTES.MAIN.SUBSCRIPTION_OFFERS]: undefined;
  [ROUTES.MAIN.PAYMENT_DETAILS]: { plan: SubscriptionPlan };
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
        headerTitleAlign: 'center',
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
        options={{ 
          title: 'My Profile',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="HealthProfile" 
        component={HealthProfileScreen} 
        options={{ 
          title: 'Health Profile',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="ActivityHistory" 
        component={require('@features/account/screens/ActivityHistoryScreen').ActivityHistoryScreen} 
        options={{ 
          title: 'Activity History',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="ActivityDetail"
        component={require('@features/account/screens/ActivityDetailScreen').ActivityDetailScreen}
        options={({ route }) => ({
          title: '',
          headerBackVisible: true,
          headerTransparent: false,
        })}
      />
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsScreen} 
        options={{ 
          title: 'Settings',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{ 
          title: 'Change Password',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="NotificationPreferences" 
        component={NotificationPreferencesScreen} 
        options={{ 
          title: 'Notification Preferences',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="PrivacySettings" 
        component={PrivacySettingsScreen} 
        options={{ 
          title: 'Privacy Settings',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.SUBSCRIPTION_OFFERS} 
        component={SubscriptionScreen} 
        options={{ 
          title: 'Offers',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.PAYMENT_DETAILS} 
        component={PaymentDetailsScreen} 
        options={{ 
          title: 'Payment Details',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
};
