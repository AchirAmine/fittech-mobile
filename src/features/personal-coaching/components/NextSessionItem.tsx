import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

interface NextSessionItemProps {
  day: string;
  time: string;
}

export const NextSessionItem = ({ day, time }: NextSessionItemProps) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.sessionCard, { backgroundColor: isDark ? colors.card : '#FFF', shadowColor: colors.shadow }]}>
      <View style={[styles.sessionIconBg, { backgroundColor: isDark ? hexToRGBA(colors.primary, 0.1) : '#F0F4FF' }]}>
        <Ionicons name="barbell-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.sessionInfo}>
        <Text style={[styles.dateText, { color: colors.textPrimary }]}>
          {day}
        </Text>
        <Text style={[styles.timeText, { color: colors.textSecondary }]}>
          {time}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sessionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.semiBold,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    opacity: 0.8,
  },
});
