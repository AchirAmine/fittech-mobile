import React, { useState, useCallback, memo } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

import { HomeStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';

import { AppScreen, ErrorBanner } from '@shared/components/layout';
import CategoryFilters from '@shared/components/ui/CategoryFilters';
import WeeklyCalendar from '@shared/components/ui/WeeklyCalendar';
import PlanningContent from '../components/PlanningContent';
import { PLANNING_CATEGORIES } from '@appTypes/planning';
import { usePlanningSessions } from '../hooks/usePlanning';

import { ROUTES } from '@navigation/routes';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.MAIN.PLANNING>;

const PlanningScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState(PLANNING_CATEGORIES[0].id);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: filteredSessions = [], isLoading, isError, error, refetch } = usePlanningSessions(currentDate, selectedCategory);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, []);

  return (
    <AppScreen 
      safeArea={false} 
      backgroundColor={isDark ? colors.background : '#F8F9FB'}
      contentContainerStyle={styles.scrollContent}
    >
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={currentDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      {isError && (
        <ErrorBanner 
          message={error instanceof Error ? error.message : 'Failed to load sessions. Please try again.'} 
        />
      )}
      
      <CategoryFilters 
        categories={PLANNING_CATEGORIES}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <WeeklyCalendar 
        selectedDate={currentDate}
        onDateSelect={setCurrentDate}
      />

      <PlanningContent sessions={filteredSessions} isLoading={isLoading} />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
});

export default memo(PlanningScreen);
