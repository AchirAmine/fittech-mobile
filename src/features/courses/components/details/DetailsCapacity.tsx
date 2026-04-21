import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Course } from '@appTypes/course';
interface Props {
  course: Course;
}
const DetailsCapacity: React.FC<Props> = ({ course }) => {
  const { colors, isDark } = useTheme();
  const enrolledPercent = (course.enrolled / course.maxSlots) * 100;
  return (
    <View style={[styles.capacityCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <View style={styles.capacityHeader}>
        <View style={styles.capacityInfo}>
          <Ionicons name="people-outline" size={18} color={colors.primary} />
          <Text style={[styles.capacityLabel, { color: colors.primary }]}>CAPACITY</Text>
        </View>
        <View style={styles.deadlineInfo}>
          <Text style={[styles.deadlineLabel, { color: colors.primary }]}>CANCEL DEADLINE</Text>
          <Text style={[styles.deadlineValue, { color: colors.error }]}>2HRS BEFORE</Text>
        </View>
      </View>
      <View style={styles.attendeesRow}>
        <Text style={[styles.attendeesCount, { color: colors.textPrimary }]}>{course.enrolled} / {course.maxSlots}</Text>
        <Text style={[styles.attendeesLabel, { color: colors.textSecondary }]}> Attendees</Text>
      </View>
      <View style={[styles.progressBarBg, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.1) : hexToRGBA(colors.black, 0.05) }]}>
        <View style={[styles.progressBarFill, { width: `${enrolledPercent}%`, backgroundColor: colors.primary }]} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  capacityCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  capacityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capacityLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  deadlineInfo: {
    alignItems: 'flex-end',
  },
  deadlineLabel: {
    fontSize: 9,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.3,
  },
  deadlineValue: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  attendeesCount: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  attendeesLabel: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
export default DetailsCapacity;
