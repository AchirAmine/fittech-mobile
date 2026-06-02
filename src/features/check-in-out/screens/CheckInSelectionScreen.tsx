import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen } from '@shared/components';
import { StatusModal } from '@shared/components/ui/StatusModal';
import { useHomeSummary } from '@features/home/hooks/useHomeSummary';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { CheckInConfirmationSheet } from '../components/CheckInConfirmationSheet';
import { SessionSummaryCard } from '../components/SessionSummaryCard';
import { CheckInOptionCard } from '../components/CheckInOptionCard';
import { useScanDoor, useCheckInStatus, useConfirmationSheet } from '../hooks/useCheckInOut';
import { ROUTES } from '@navigation/routes';
import { useMemberPolicy } from '@features/account/hooks/useMemberPolicy';

const DAYS_OF_WEEK = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

function parseTimeToDate(baseDate: Date, timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

export const CheckInSelectionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { data: summary, isLoading, refetch } = useHomeSummary();
  const { data: memberPolicy } = useMemberPolicy();
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

  const now = new Date();
  const attendancePolicy = memberPolicy?.attendancePolicy;

  const isCourseAvailableNow = React.useMemo(() => {
    const course = summary?.nearestCourse;
    if (!course || !attendancePolicy) return false;

    const courseDate = new Date(course.date);
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const courseDateUTC = Date.UTC(courseDate.getUTCFullYear(), courseDate.getUTCMonth(), courseDate.getUTCDate());
    if (courseDateUTC !== todayUTC) return false;

    const courseStart = parseTimeToDate(now, course.startTime);
    const windowStart = new Date(courseStart.getTime() - attendancePolicy.courseEntryWindowBeforeMinutes * 60000);
    const windowEnd = new Date(courseStart.getTime() + attendancePolicy.qrCheckinWindowAfterMinutes * 60000);

    return now >= windowStart && now <= windowEnd;
  }, [summary?.nearestCourse, attendancePolicy]);

  const isFreeAvailableNow = React.useMemo(() => {
    if (!summary?.actualPlanning) return false;
    const today = DAYS_OF_WEEK[now.getDay()];

    for (const sport of summary.actualPlanning.sports) {
      for (const slot of sport.slots) {
        if (slot.slotType !== 'OPEN_SESSION') continue;
        if (slot.dayOfWeek !== today) continue;

        const slotStart = parseTimeToDate(now, slot.startTime);
        const slotEnd = parseTimeToDate(now, slot.endTime);

        if (now >= slotStart && now < slotEnd) return true;
      }
    }
    return false;
  }, [summary?.actualPlanning]);

  const courseSubtitle = React.useMemo(() => {
    const course = summary?.nearestCourse;
    if (!course) return 'No course reserved for today';
    if (isCourseAvailableNow) return `${course.title} · ${course.startTime}`;
    const courseDate = new Date(course.date);
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const courseDateUTC = Date.UTC(courseDate.getUTCFullYear(), courseDate.getUTCMonth(), courseDate.getUTCDate());
    if (courseDateUTC !== todayUTC) return `Next: ${course.title} · ${courseDate.toLocaleDateString()}`;
    return `${course.title} · Starts at ${course.startTime}`;
  }, [summary?.nearestCourse, isCourseAvailableNow]);

  const freeSubtitle = React.useMemo(() => {
    if (isFreeAvailableNow) return 'Open session available now';
    if (!summary?.actualPlanning) return 'No planning available';
    const today = DAYS_OF_WEEK[now.getDay()];
    for (const sport of summary.actualPlanning.sports) {
      for (const slot of sport.slots) {
        if (slot.slotType !== 'OPEN_SESSION') continue;
        if (slot.dayOfWeek !== today) continue;
        const slotStart = parseTimeToDate(now, slot.startTime);
        if (slotStart > now) return `Next free session at ${slot.startTime}`;
      }
    }
    return 'No open session available today';
  }, [summary?.actualPlanning, isFreeAvailableNow]);

  const handleCheckIn = async () => {
    const sessionType = confirmationSheet.type;

    try {
      const zone = scannedZone || (sessionType === 'COURSE' && summary?.nearestCourse?.gymZone === 'POOL' ? 'POOL' : 'GYM');
      const result = await scanDoor({ zone, sessionType });

      if (result.success) {
        closeSheet();
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        showSuccess(
          'Check-in Successful!',
          sessionType === 'COURSE'
            ? `You're checked in to ${summary?.nearestCourse?.title || 'Course'}\nToday at ${currentTime}`
            : `You're checked in to Free session\nToday at ${currentTime}`,
        );
      }
    } catch (error: any) {
      closeSheet();
      const msg = error.response?.data?.message || error.message || '';
      let title = 'Check-in Failed';
      let type: 'success' | 'error' = 'error';

      if (msg.includes('No remaining') || msg.includes('balance')) title = 'No sessions remaining';
      else if (msg.includes('suspended')) title = 'Account suspended';
      else if (msg.includes('already')) { title = 'Already Checked In'; type = 'success'; }

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

  const fullActiveSub = summary?.subscriptions?.find(s => s.id === summary?.activeSubscription?.id);

  const remainingCourse = fullActiveSub 
    ? (fullActiveSub.sportBalances || []).reduce((acc: number, bal: any) => acc + bal.remainingCourseSessions, 0)
    : (summary?.activeSubscription?.remainingSessions ?? 0);
    
  const remainingOpen = fullActiveSub
    ? (fullActiveSub.sportBalances || []).reduce((acc: number, bal: any) => acc + bal.remainingFreeSessions, 0)
    : (summary?.activeSubscription?.remainingOpenSessions ?? 0);

  const maxCourse = fullActiveSub
    ? remainingCourse + (fullActiveSub.consumedCourseSessions || 0)
    : Math.max(remainingCourse, 1);
    
  const maxOpen = fullActiveSub
    ? remainingOpen + (fullActiveSub.consumedFreeSessions || 0)
    : Math.max(remainingOpen, 1);

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
            progress={Math.min(remainingCourse / maxCourse, 1)}
          />
          <SessionSummaryCard
            label="OPEN ACCESS SESSIONS"
            count={remainingOpen}
            iconName="dumbbell"
            iconColor="#10b981"
            iconBgColor="#f0fff4"
            progressColor="#10b981"
            progress={Math.min(remainingOpen / maxOpen, 1)}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>INSTANT CHECK-IN</Text>
          <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
        </View>

        {!isCourseAvailableNow && !isFreeAvailableNow && (
          <View style={[styles.noSessionBanner, { backgroundColor: colors.card }]}>
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.noSessionText, { color: colors.textSecondary }]}>
              No check-in window is active right now. Options are enabled when a session is about to start.
            </Text>
          </View>
        )}

        <View style={styles.checkInOptions}>
          <CheckInOptionCard
            title="Course Session"
            subtitle={courseSubtitle}
            iconName="dumbbell"
            iconColor="#3b82f6"
            iconBgColor="#eff6ff"
            onPress={() => openSheet('COURSE')}
            disabled={!isCourseAvailableNow}
          />
          <CheckInOptionCard
            title="Open Session"
            subtitle={freeSubtitle}
            iconName="weight-lifter"
            iconColor="#10b981"
            iconBgColor="#ecfdf5"
            onPress={() => openSheet('FREE')}
            disabled={!isFreeAvailableNow}
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
            ? summary?.nearestCourse?.title || 'Course Session'
            : 'Open Access Session',
          zone: confirmationSheet.type === 'COURSE'
            ? summary?.nearestCourse?.gymZone || 'Gym'
            : 'Gym / Pool',
          schedule: confirmationSheet.type === 'COURSE'
            ? summary?.nearestCourse
              ? `${summary.nearestCourse.dayOfWeek.substring(0, 3).toUpperCase()} ${summary.nearestCourse.startTime} - ${summary.nearestCourse.endTime}`
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
  noSessionBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  noSessionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    lineHeight: 20,
  },
  checkInOptions: {
    gap: 0,
  },
});
