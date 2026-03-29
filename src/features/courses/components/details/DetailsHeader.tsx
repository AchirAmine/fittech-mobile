import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Course } from '@appTypes/course';

interface Props {
  course: Course;
}

const DetailsHeader: React.FC<Props> = ({ course }) => {
  const { colors, isDark } = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return colors.success;
      case 'RESERVED': return colors.success;
      case 'FULL': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const statusColor = getStatusColor(course.status);

  return (
    <View style={[styles.titleCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, { backgroundColor: hexToRGBA(statusColor, 0.1) }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{course.status}</Text>
        </View>
      </View>
      
      <Text style={[styles.title, { color: colors.textPrimary }]}>{course.title}</Text>
      
      <View style={[styles.coachContainer, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.02) }]}>
        <Image 
          source={{ uri: course.coach.avatar }} 
          style={styles.coachAvatar} 
        />
        <View>
          <Text style={[styles.coachLabel, { color: colors.textSecondary }]}>LEAD COACH</Text>
          <Text style={[styles.coachName, { color: colors.textPrimary }]}>{course.coach.name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleCard: {
    padding: 18,
    borderRadius: 24,
    alignItems: 'flex-start',
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 38,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  coachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    width: '100%',
  },
  coachAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  coachLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  coachName: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});

export default DetailsHeader;
