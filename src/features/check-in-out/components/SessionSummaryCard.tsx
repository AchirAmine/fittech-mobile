import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

interface SessionSummaryCardProps {
  label: string;
  count: number;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  progressColor: string;
  progress: number;
}

export const SessionSummaryCard = ({
  label,
  count,
  iconName,
  iconColor,
  iconBgColor,
  progressColor,
  progress,
}: SessionSummaryCardProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
      <View style={[styles.iconBox, { backgroundColor: iconBgColor, borderRadius: 12 }]}>
        <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={[styles.cardLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.cardNumber, { color: iconColor === '#10b981' ? '#10b981' : colors.primaryMid }]}>
        {count}
      </Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: progressColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 32,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
