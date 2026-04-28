import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '@features/home/screens/HomeScreen';
import { ProfileScreen } from '@features/account/screens/ProfileScreen';
import { SubscriptionScreen } from '@features/membership/screens/SubscriptionScreen';
import { PaymentDetailsScreen } from '@features/payment/screens/PaymentDetailsScreen';
import { PersonalCoachesScreen } from '@features/personal-coaching/screens/PersonalCoachesScreen';
import { CoachProfileScreen } from '@features/personal-coaching/screens/CoachProfileScreen';
import { MyCoachingDashboardScreen } from '@features/personal-coaching/screens/MyCoachingDashboardScreen';
import { BookSessionScreen } from '@features/personal-coaching/screens/BookSessionScreen';
import { ROUTES } from '@navigation/routes';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { MyPlansScreen } from '@features/membership/screens/MyPlansScreen';
import { PlanDetailsScreen } from '@features/membership/screens/PlanDetailsScreen';
import PlanningScreen from '@features/planning/screens/PlanningScreen';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { BackButton } from '@shared/components/ui/BackButton';
import CourseDetailsScreen from '@features/courses/screens/CourseDetailsScreen';
import { RewardsScreen } from '@features/rewards/screens/RewardsScreen';
import { MyVouchersScreen } from '@features/rewards/screens/MyVouchersScreen';
import { NotificationScreen } from '@features/notifications/screens/NotificationScreen';
import { NotificationDetailScreen } from '@features/notifications/screens/NotificationDetailScreen';
import { CheckInScreen } from '@features/check-in/screens/CheckInScreen';
import { CheckInSelectionScreen } from '@features/check-in/screens/CheckInSelectionScreen';
import { CourseAttendanceScreen } from '@features/check-in/screens/CourseAttendanceScreen';
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
        options={{ headerShown: true }} 
      />
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.PLANNING as any} 
        component={PlanningScreen} 
        options={({ navigation }) => ({ 
          title: 'PLANNING',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.SUBSCRIPTION_OFFERS} 
        component={SubscriptionScreen} 
        options={({ navigation }) => ({ 
          title: 'EXPLORE PLANS',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.PAYMENT_DETAILS} 
        component={PaymentDetailsScreen} 
        options={({ navigation }) => ({ 
          title: 'PAYMENT DETAILS',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.PERSONAL_COACHES} 
        component={PersonalCoachesScreen} 
        options={({ navigation }) => ({ 
          title: 'COACHES',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />
        })} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.COACH_PROFILE} 
        component={CoachProfileScreen} 
        options={({ navigation }) => ({ 
          title: 'COACH PROFILE',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 8 }}>
              <Ionicons name="share-social-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )
        })} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.MY_COACHING_DASHBOARD} 
        component={MyCoachingDashboardScreen} 
        options={({ navigation }) => ({ 
          title: 'MY COACHING',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.BOOK_SESSION} 
        component={BookSessionScreen} 
        options={({ navigation }) => ({ 
          title: 'BOOK SESSION',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })} 
      />
      <Stack.Screen
        name={ROUTES.MAIN.MY_PLANS}
        component={MyPlansScreen}
        options={({ navigation }) => ({ 
          title: 'MY PLANS',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen
        name={ROUTES.MAIN.PLAN_DETAILS}
        component={PlanDetailsScreen}
        options={({ route, navigation }) => ({
          title: (route.params as any)?.planName?.toUpperCase() || 'PLAN DETAILS',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.COURSE_DETAILS} 
        component={CourseDetailsScreen} 
        options={({ route, navigation }) => ({ 
          title: (route.params as any)?.courseTitle?.toUpperCase() || 'COURSE DETAILS',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.REWARDS} 
        component={RewardsScreen} 
        options={({ navigation }) => ({ 
          title: 'REWARDS',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.MY_VOUCHERS} 
        component={MyVouchersScreen} 
        options={({ navigation }) => ({ 
          title: 'MY CODES',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.NOTIFICATIONS} 
        component={NotificationScreen} 
        options={({ navigation }) => ({ 
          title: 'NOTIFICATIONS',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.NOTIFICATION_DETAIL} 
        component={NotificationDetailScreen} 
        options={({ navigation }) => ({ 
          title: 'NOTIFICATION',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.CHECK_IN as any} 
        component={CheckInScreen} 
        options={({ navigation }) => ({ 
          title: 'SCAN QR CODE',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontFamily: Theme.Typography.fontFamily.bold,
            fontSize: 16,
            color: '#ffffff',
          },
        })} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.CHECK_IN_SELECTION as any} 
        component={CheckInSelectionScreen} 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name={ROUTES.MAIN.COURSE_ATTENDANCE as any} 
        component={CourseAttendanceScreen} 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack.Navigator>
  );
};
