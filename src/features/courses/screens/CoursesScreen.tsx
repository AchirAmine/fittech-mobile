import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen } from '@shared/components/layout';
import CategoryFilters, { Category } from '@shared/components/ui/CategoryFilters';
import { useCourses } from '../hooks/useCourses';
import CourseList from '../components/CourseList';

const COURSE_CATEGORIES: Category[] = [
  { id: 'All', label: 'All', emoji: '✨' },
  { id: 'MyCourses', label: 'My Courses', emoji: '🗓️' },
  { id: 'Gym', label: 'Gym', emoji: '🏋️' },
  { id: 'Swimming', label: 'Swimming', emoji: '🏊' },
  { id: 'Boxing', label: 'Boxing', emoji: '🥊' },
  { id: 'Yoga', label: 'Yoga', emoji: '🧘' },
];

const CoursesScreen = () => {
  const { colors, isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: filteredCourses = [], isLoading, isError } = useCourses(activeCategory);

  return (
    <AppScreen 
      safeArea={false}
      backgroundColor={isDark ? colors.background : '#F8F9FB'}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Shared Category Filters */}
      <CategoryFilters 
        categories={COURSE_CATEGORIES}
        selectedId={activeCategory}
        onSelect={(id) => setActiveCategory(id)}
        containerStyle={styles.filtersWrapper}
      />

      {/* Courses List Component */}
      <CourseList 
        courses={filteredCourses} 
        isLoading={isLoading} 
        isError={isError} 
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 20,
  },
  filtersWrapper: {
    marginTop: 0,
    marginBottom: 16,
    marginHorizontal: -16, 
  },
});

export default CoursesScreen;
