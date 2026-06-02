import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen } from '@shared/components';
import { StatusModal } from '@shared/components/ui/StatusModal';
import { useHomeSummary } from '@features/home/hooks/useHomeSummary';
import type { HomeSummary } from '@features/home/types/home.types';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { CheckInConfirmationSheet } from '../components/CheckInConfirmationSheet';
import { SessionSummaryCard } from '../components/SessionSummaryCard';
import { CheckInOptionCard } from '../components/CheckInOptionCard';
import { useScanDoor, useCheckInStatus, useConfirmationSheet } from '../hooks/useCheckInOut';
import { ROUTES } from '@navigation/routes';

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
};

const isCurrentTimeWithinSlot = (startTime: string, endTime: string) => {
  const now = new Date();
  const current = (now.getHours() * 60) + now.getMinutes();
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  if (start === end) return true;

  return start < end
    ? current >= start && current <= end
    : current >= start || current <= end;
};

const isTodaySlot = (dayOfWeek: string) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  return dayOfWeek.toUpperCase() === today;
};

const isTodayCourse = (date?: string) => {
  if (!date) return true;

  const courseDate = new Date(date);
  const today = new Date();
  if (Number.isNaN(courseDate.getTime())) return false;

  return courseDate.getFullYear() === today.getFullYear() &&
    courseDate.getMonth() === today.getMonth() &&
    courseDate.getDate() === today.getDate();
};

const hasCurrentOpenSession = (summary?: HomeSummary) => {
  return !!summary?.actualPlanning?.sports?.some((sport) =>
    sport.slots.some((slot) =>
      slot.slotType === 'OPEN_SESSION' &&
      isTodaySlot(slot.dayOfWeek) &&
      isCurrentTimeWithinSlot(slot.startTime, slot.endTime)
    )
  );
};

type CourseCheckInOption = {
  title: string;
  gymZone: string | null;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

const getCurrentCourseFromPlanning = (summary?: HomeSummary): CourseCheckInOption | null => {
  for (const sport of summary?.actualPlanning?.sports ?? []) {
    for (const slot of sport.slots) {
      if (
        slot.slotType !== 'COURSE_SLOT' ||
        !isTodaySlot(slot.dayOfWeek) ||
        !isCurrentTimeWithinSlot(slot.startTime, slot.endTime)
      ) {
        continue;
      }

      const currentCourses = slot.courses?.filter((course) => isTodayCourse(course.date)) ?? [];
      const reservedCourse = currentCourses.find((course) => course.isReservedByMember);
      const course = reservedCourse ?? currentCourses[0];

      if (slot.courses?.length && !course) {
        continue;
      }

      return {
        title: course?.title || 'Course Session',
        gymZone: course?.gymZone ?? (sport.sport === 'POOL' ? 'POOL' : 'GYM'),
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
    }
  }

  return null;
};

export const CheckInSelectionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { data: summary, isLoading, refetch } = useHomeSummary();
  const route = useRoute();
  const { zone: scannedZone } = (route.params as any) || {};


  const { mutateAsync: scanDoor, isPending: isSubmitting } = useScanDoor();
  const { status, showSuccess, showError, hideStatus } = useCheckInStatus();
  const { confirmationSheet, openSheet, closeSheet } = useConfirmationSheet();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleCheckIn = async () => {
    const sessionType = confirmationSheet.type;

    try {
      if (sessionType === 'FREE' && summary?.actualPlanning && !hasCurrentOpenSession(summary)) {
        throw new Error('It is not a free session time.');
      }

      const zone = scannedZone || (sessionType === 'COURSE' && courseCheckInOption?.gymZone === 'POOL' ? 'POOL' : 'GYM');
      const result = await scanDoor({ zone, sessionType });

      if (result.success) {
        closeSheet();
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        showSuccess(
          'Check-in Successful!',
          sessionType === 'COURSE'
            ? `You're checked in to ${courseCheckInOption?.title || 'Course'}\nToday at ${currentTime}`
            : `You're checked in to Free session\nToday at ${currentTime}`,
        );
      }
    } catch (error: any) {
      closeSheet();
      await refetch();
      const msg = error.response?.data?.message || error.message || '';
      let title = 'Check-in Failed';

      if (msg.includes('No remaining') || msg.includes('balance')) title = 'No sessions remaining';
      else if (msg.includes('suspended')) title = 'Account suspended';
      else if (msg.toLowerCase().includes('already')) title = 'Already Checked In';

      showError(title, msg || 'Something went wrong. Please try again.');
    }
  };

  const handleStatusClose = () => {
    hideStatus();
    if (status.type === 'success') {
      if (navigation.canGoBack()) navigation.goBack();
      else (navigation as any).navigate(ROUTES.MAIN.HOME);
    }
  };

  const remainingCourse = summary?.activeSubscription?.remainingSessions ?? 0;
  const remainingOpen = summary?.activeSubscription?.remainingOpenSessions ?? 0;
  const hasPlanningLoaded = !!summary?.actualPlanning;
  const openSessionAvailable = !hasPlanningLoaded || hasCurrentOpenSession(summary);
  const canStartOpenSession = remainingOpen > 0 && openSessionAvailable;
  const courseCheckInOption = getCurrentCourseFromPlanning(summary) ?? summary?.nearestCourse;
  const maxSessions = 10;

  return (
    <AppScreen isLoading={isLoading} backgroundColor={colors.background} safeArea={true}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.mainTitle, { color: colors.primaryMid }]}>My Remaining Sessions</Text>

        <View style={styles.summaryRow}>
          <SessionSummaryCard
            label="COURSE SESSIONS"
            count={remainingCourse}
            iconName="school-outline"
            iconColor="#3b82f6"
            iconBgColor="#f0f4ff"
            progressColor="#3b82f6"
            progress={Math.min(remainingCourse / maxSessions, 1)}
          />
          <SessionSummaryCard
            label="OPEN ACCESS SESSIONS"
            count={remainingOpen}
            iconName="dumbbell"
            iconColor="#10b981"
            iconBgColor="#f0fff4"
            progressColor="#10b981"
            progress={Math.min(remainingOpen / maxSessions, 1)}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>INSTANT CHECK-IN</Text>
          <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
        </View>

        <View style={styles.checkInOptions}>
          <CheckInOptionCard
            title="Course Session"
            subtitle={courseCheckInOption ? 'Access scheduled classes' : 'No active course at this time'}
            iconName="dumbbell"
            iconColor="#3b82f6"
            iconBgColor="#eff6ff"
            onPress={() => openSheet('COURSE')}
            disabled={!courseCheckInOption}
          />
          <CheckInOptionCard
            title="Open Session"
            subtitle={openSessionAvailable ? 'Self-guided training' : 'No open session at this time'}
            iconName="weight-lifter"
            iconColor="#10b981"
            iconBgColor="#ecfdf5"
            onPress={() => openSheet('FREE')}
            disabled={!canStartOpenSession}
          />
        </View>
      </ScrollView>

      <CheckInConfirmationSheet
        visible={confirmationSheet.visible}
        type={confirmationSheet.type}
        loading={isSubmitting}
        onClose={closeSheet}
        onConfirm={handleCheckIn}
        data={{
          title: confirmationSheet.type === 'COURSE'
            ? courseCheckInOption?.title || 'Course Session'
            : 'Open Access Session',
          zone: confirmationSheet.type === 'COURSE'
            ? courseCheckInOption?.gymZone || 'Gym'
            : 'Gym / Pool',
          schedule: confirmationSheet.type === 'COURSE'
            ? courseCheckInOption
              ? `${courseCheckInOption.dayOfWeek.substring(0, 3).toUpperCase()} ${courseCheckInOption.startTime} - ${courseCheckInOption.endTime}`
              : 'Today'
            : 'Today (Anytime)',
          instructor: confirmationSheet.type === 'COURSE'
            ? 'Course Instructor'
            : 'Self-guided',
        }}
      />

      <StatusModal
        visible={status.visible}
        type={status.type}
        title={status.title}
        message={status.message}
        onClose={handleStatusClose}
        onConfirm={handleStatusClose}
        confirmText="OK"
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 5,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  checkInOptions: {
    gap: 0,
  },
});
