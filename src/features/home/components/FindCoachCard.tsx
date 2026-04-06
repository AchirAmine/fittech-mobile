import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { EmptyCoachingState } from '@features/personal-coaching/components/EmptyCoachingState';

interface FindCoachCardProps {
  onPress?: () => void;
}

export const FindCoachCard: React.FC<FindCoachCardProps> = ({ onPress }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.textPrimary }]}>MY COACHING</Text>
      </View>

      <EmptyCoachingState onPress={onPress || (() => {})} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
  },
});
