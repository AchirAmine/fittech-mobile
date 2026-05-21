import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AppScreen } from '@shared/components';
import { useTheme } from '@shared/hooks/useTheme';
import { ExerciseSection } from '../components/ExerciseSection';

export const ExerciseDatabaseScreen = () => {
  const { colors } = useTheme();

  return (
    <AppScreen safeArea={false} backgroundColor={colors.background}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ExerciseSection />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
});
