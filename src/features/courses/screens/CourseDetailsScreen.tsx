import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen } from '@shared/components/layout';
import { CoursesStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useCourseDetail } from '../hooks/useCourses';

// Refactored Components
import DetailsHeader from '../components/details/DetailsHeader';
import DetailsInfoGrid from '../components/details/DetailsInfoGrid';
import DetailsCapacity from '../components/details/DetailsCapacity';
import DetailsAbout from '../components/details/DetailsAbout';
import DetailsActionArea from '../components/details/DetailsActionArea';

type Props = NativeStackScreenProps<CoursesStackParamList, typeof ROUTES.MAIN.COURSE_DETAILS>;

const CourseDetailsScreen: React.FC<Props> = ({ route }) => {
  const { courseId } = route.params;
  const { colors, isDark } = useTheme();

  const { data: course, isLoading, isError } = useCourseDetail(courseId);

  if (isLoading) {
    return (
      <AppScreen safeArea={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading course details...</Text>
        </View>
      </AppScreen>
    );
  }

  if (!course || isError) {
    return (
      <AppScreen safeArea={false}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Course not found.</Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen 
      backgroundColor={isDark ? colors.background : '#F8F9FB'}
      contentContainerStyle={styles.scrollContent}
      safeArea={false}
    >
      <DetailsHeader course={course} />
      <DetailsInfoGrid course={course} />
      <DetailsCapacity course={course} />
      <DetailsAbout description={course.description} />
      <DetailsActionArea course={course} />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    gap: 10, 
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  errorText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 16,
  },
});

export default CourseDetailsScreen;
