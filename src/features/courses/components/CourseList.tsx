import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import CourseCard from './CourseCard';
import { Course } from '@appTypes/course';
interface Props {
  courses: Course[];
  isLoading: boolean;
  isError: boolean;
}
const CourseList: React.FC<Props> = ({ courses, isLoading, isError }) => {
  const { colors } = useTheme();
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading courses...</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[styles.emptyText, { color: colors.error }]}>Failed to load courses.</Text>
      </View>
    );
  }
  if (courses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search" size={48} color={colors.textMuted} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No courses found for this category.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.listContainer}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    gap: 16,
  },
  loadingText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
});
export default CourseList;
