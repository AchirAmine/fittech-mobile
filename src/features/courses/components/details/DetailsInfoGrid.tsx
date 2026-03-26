import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Course } from '../../mocks/coursesMockData';

interface Props {
  course: Course;
}

const DetailsInfoGrid: React.FC<Props> = ({ course }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.grid}>
      <View style={[styles.gridItem, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Ionicons name="fitness-outline" size={20} color={colors.primary} />
        <View style={styles.gridTextContainer}>
          <Text style={[styles.gridLabel, { color: colors.primary }]}>SPORT</Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{course.category}</Text>
        </View>
      </View>
      
      <View style={[styles.gridItem, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        <View style={styles.gridTextContainer}>
          <Text style={[styles.gridLabel, { color: colors.primary }]}>DAY</Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{course.days.split(' ')[0]}</Text>
        </View>
      </View>

      <View style={[styles.gridItem, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
        <View style={styles.gridTextContainer}>
          <Text style={[styles.gridLabel, { color: colors.primary }]}>TIME</Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{course.startTime} ({course.duration} min)</Text>
        </View>
      </View>

      <View style={[styles.gridItem, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Ionicons name="location-outline" size={20} color={colors.primary} />
        <View style={styles.gridTextContainer}>
          <Text style={[styles.gridLabel, { color: colors.primary }]}>ZONE</Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{course.location}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    gap: 12,
  },
  gridTextContainer: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});

export default DetailsInfoGrid;
