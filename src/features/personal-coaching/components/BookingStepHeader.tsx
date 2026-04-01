import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

interface BookingStepHeaderProps {
  step: number;
  title: string;
}

export const BookingStepHeader = ({ step, title }: BookingStepHeaderProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.headerRow}>
      <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>
        STEP {step} — {title.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  stepLabel: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1.5,
    opacity: 0.8,
  },
});
