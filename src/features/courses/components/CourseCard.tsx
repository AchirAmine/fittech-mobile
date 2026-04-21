import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Course } from '@appTypes/course';
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
      case 'WAITLISTED': return colors.success;
      case 'FULL': return colors.error;
      default: return colors.textSecondary;
    }
  };
  const enrollmentProgress = (course.enrolled / course.maxSlots) * 100;
  const isFull = course.status === 'FULL';
  const isReserved = course.status === 'RESERVED';
  const isWaitlisted = course.status === 'WAITLISTED';
  const cardBg = isDark ? hexToRGBA(colors.primary, 0.15) : colors.white;
  const cardBorderColor = isDark ? hexToRGBA(colors.primary, 0.3) : hexToRGBA(colors.black, 0.05);
  const accentColor = isFull ? colors.error : (isReserved || isWaitlisted ? colors.success : colors.primary);
  return (
    <View 
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
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{course.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: hexToRGBA(getStatusColor(course.status), 0.1) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(course.status) }]}>{course.status}</Text>
        </View>
      </View>
      <View style={styles.badgeRow}>
        <View style={[styles.categoryBadge, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
          <Text style={[styles.categoryText, { color: colors.primary }]}>{course.category.toUpperCase()}</Text>
        </View>
        <View style={[styles.locationBadge, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
          <Ionicons name="location-outline" size={10} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.primary }]}>Zone: {course.location}</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.dateTimeWrap}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>{course.days}</Text>
          <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {course.startTime} ({course.duration} min)
          </Text>
        </View>
      </View>
      <View style={styles.coachRow}>
        <View style={styles.coachMain}>
          <Image source={{ uri: course.coach.avatar }} style={styles.coachAvatar} />
          <Text style={[styles.coachName, { color: colors.textPrimary }]}>{course.coach.name}</Text>
        </View>
      </View>
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
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={handlePress}
        style={[
          styles.bigButton, 
          { 
            backgroundColor: isDark ? colors.primary : colors.white,
            borderWidth: isDark ? 0 : 1,
            borderColor: colors.primary,
          }
        ]}
      >
        <Text style={[styles.bigButtonText, { color: isDark ? colors.white : colors.primary }]}>
          View Details
        </Text>
        <Ionicons name="arrow-forward" size={18} color={isDark ? colors.white : colors.primary} />
      </TouchableOpacity>
    </View>
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
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  locationText: {
    fontSize: 10,
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
  enrollmentContainer: {
    marginBottom: 20,
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
  bigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bigButtonText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
export default CourseCard;