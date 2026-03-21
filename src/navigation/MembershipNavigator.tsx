import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '@navigation/routes';
import { MembershipStackParamList } from '@appTypes/navigation.types';
import { MyPlansScreen } from '@features/membership/screens/MyPlansScreen';
import { PlanDetailsScreen } from '@features/membership/screens/PlanDetailsScreen';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

const Stack = createNativeStackNavigator<MembershipStackParamList>();

export const MembershipNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MAIN.MY_PLANS}
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
        name={ROUTES.MAIN.MY_PLANS}
        component={MyPlansScreen}
        options={{ title: 'MY PLANS' }}
      />
      <Stack.Screen
        name={ROUTES.MAIN.PLAN_DETAILS}
        component={PlanDetailsScreen}
        options={({ route }) => ({
          title: route.params?.planName?.toUpperCase() || 'PLAN DETAILS',
          headerBackVisible: true,
        })}
      />
    </Stack.Navigator>
  );
};
