import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@features/home/screens/HomeScreen';
import { ProfileScreen } from '@features/account/screens/ProfileScreen';
import { SubscriptionScreen } from '@features/membership/screens/SubscriptionScreen';
import { PaymentDetailsScreen } from '@features/membership/screens/PaymentDetailsScreen';
import { ROUTES } from '@navigation/routes';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
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
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: true }} // Header will be customized in HomeScreen
      />
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.SUBSCRIPTION_OFFERS} 
        component={SubscriptionScreen} 
        options={{ title: 'Explore Plans' }}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.PAYMENT_DETAILS} 
        component={PaymentDetailsScreen} 
        options={{ title: 'Payment Details' }}
      />
    </Stack.Navigator>
  );
};
