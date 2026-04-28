import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountScreen } from '@features/account/screens/AccountScreen';
import { ProfileScreen } from '@features/account/screens/ProfileScreen';
import { HealthProfileScreen } from '@features/account/screens/HealthProfileScreen';
import { SubscriptionScreen } from '@features/membership/screens/SubscriptionScreen';
import { PaymentDetailsScreen } from '@features/payment/screens/PaymentDetailsScreen';
import { SubscriptionPlan } from '@appTypes/index';
import { ROUTES } from '@navigation/routes';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
export type ProfileStackParamList = {
  AccountMain: undefined;
  ProfileMain: undefined;
  HealthProfile: undefined;
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
