import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { ROUTES } from '@navigation/routes';
import { CoursesStackParamList } from '@appTypes/navigation.types';
import CoursesScreen from '@features/courses/screens/CoursesScreen';
import CourseDetailsScreen from '@features/courses/screens/CourseDetailsScreen';
const Stack = createNativeStackNavigator<CoursesStackParamList>();
export const CoursesNavigator = () => {
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
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name={ROUTES.MAIN.COURSES_MAIN} 
        component={CoursesScreen} 
        options={{ title: 'COURSES' }}
      />
      <Stack.Screen 
        name={ROUTES.MAIN.COURSE_DETAILS} 
        component={CourseDetailsScreen} 
        options={({ route }) => ({ 
          title: route.params.category?.toUpperCase() || 'COURSE DETAILS',
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};
