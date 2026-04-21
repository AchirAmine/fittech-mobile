import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
interface BookingSummaryCardProps {
  coach: {
    name: string;
    image: any;
  };
  date: string;
  timeSlot: string;
}
export const BookingSummaryCard = ({ coach, date, timeSlot }: BookingSummaryCardProps) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.confirmCard, { backgroundColor: isDark ? colors.card : '#FFF' }, styles.shadow]}>
      <View style={styles.coachSummary}>
        <Image source={coach.image} style={styles.coachAvatar} />
        <View style={styles.coachText}>
          <Text style={[styles.trainerLabel, { color: colors.primary }]}>TRAINER</Text>
          <View style={styles.nameRow}>
            <Ionicons name="person-outline" size={16} color={colors.primary} />
            <Text style={[styles.coachName, { color: colors.textPrimary }]}>{coach.name}</Text>
          </View>
        </View>
      </View>
      <View style={styles.summaryFooter}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.primary }]}>DATE</Text>
          <View style={styles.summaryValueRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {date}
            </Text>
          </View>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.primary }]}>TIME</Text>
          <View style={styles.summaryValueRow}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {timeSlot || 'Not selected'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  confirmCard: {
    padding: 24,
    borderRadius: 24,
  },
  coachSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 24,
  },
  coachAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  coachText: {
    marginLeft: 16,
  },
  trainerLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coachName: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    gap: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  shadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
