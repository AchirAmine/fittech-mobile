import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Course } from '../mocks/coursesMockData';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CoursesStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';

interface Props {
  course: Course;
}

const CourseCard: React.FC<Props> = ({ course }) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<CoursesStackParamList>>();

  const handlePress = () => {
    navigation.navigate(ROUTES.MAIN.COURSE_DETAILS, {
      courseId: course.id,
      courseTitle: course.title,
      category: course.category
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return colors.primary;
      case 'RESERVED': return colors.success;
      case 'FULL': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const enrollmentProgress = (course.enrolled / course.maxSlots) * 100;
  const isFull = course.status === 'FULL';
  const isReserved = course.status === 'RESERVED';
  
  // Base colors follow the Planning/SessionItem style (Primary Blue)
  const cardBg = isDark ? hexToRGBA(colors.primary, 0.15) : hexToRGBA(colors.primary, 0.08);
  const cardBorderColor = hexToRGBA(colors.primary, 0.3);
  
  // Status-specific accent
  const accentColor = isFull ? colors.error : (isReserved ? colors.success : colors.primary);

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handlePress}
      style={[
        styles.container, 
        { 
          backgroundColor: cardBg,
          borderLeftColor: accentColor,
          borderColor: cardBorderColor,
          borderWidth: 1,
          shadowColor: colors.shadow
        }
      ]}
    >
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{course.title}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>{course.category.toUpperCase()}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: hexToRGBA(getStatusColor(course.status), 0.1) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(course.status) }]}>{course.status}</Text>
        </View>
      </View>

      {/* Details Row: Date & Time Grouped */}
      <View style={styles.detailsRow}>
        <View style={styles.dateTimeWrap}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>{course.days}</Text>
          <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>{course.startTime}</Text>
        </View>
      </View>

      {/* Coach Info */}
      <View style={styles.coachRow}>
        <View style={styles.coachMain}>
          <Image source={{ uri: course.coach.avatar }} style={styles.coachAvatar} />
          <Text style={[styles.coachName, { color: colors.textPrimary }]}>{course.coach.name}</Text>
        </View>
        <View style={[styles.locationBadge, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.primary, 0.1) }]}>
          <Text style={[styles.locationText, { color: colors.primary }]}>{course.location}</Text>
        </View>
      </View>

      {/* Enrollment */}
      <View style={styles.enrollmentContainer}>
        <View style={styles.enrollmentHeader}>
          <Text style={[styles.enrollmentLabel, { color: colors.textMuted }]}>ENROLLMENT</Text>
          <Text style={[styles.enrollmentCount, { color: colors.textPrimary }]}>
            {course.enrolled} / {course.maxSlots} SLOTS
          </Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.1) : hexToRGBA(colors.black, 0.05) }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${enrollmentProgress}%`, backgroundColor: accentColor }
            ]} 
          />
        </View>
      </View>

      {/* CTA Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.durationContainer}>
          <Ionicons name="hourglass-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.durationText, { color: colors.textSecondary }]}>{course.duration} min</Text>
        </View>
        <View style={styles.ctaContainer}>
          <Text style={[styles.ctaText, { color: colors.primary }]}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 24,
    borderLeftWidth: 6,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTimeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  coachMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coachAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  coachName: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  locationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  enrollmentContainer: {
    marginBottom: 12,
  },
  enrollmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  enrollmentLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  enrollmentCount: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: hexToRGBA('#000000', 0.05),
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default CourseCard;
