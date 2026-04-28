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
import { useScanDoor, useCheckInStatus, useConfirmationSheet } from '../hooks/useCheckIn';
import { ROUTES } from '@navigation/routes';

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
      const msg = error.response?.data?.message || '';
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

  const remainingCourse = summary?.activeSubscription?.remainingSessions ?? 0;
  const remainingOpen = summary?.activeSubscription?.remainingOpenSessions ?? 0;
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
            subtitle={summary?.nearestCourse ? 'Access scheduled classes' : 'No active course at this time'}
            iconName="dumbbell"
            iconColor="#3b82f6"
            iconBgColor="#eff6ff"
            onPress={() => openSheet('COURSE')}
            disabled={!summary?.nearestCourse}
          />
          <CheckInOptionCard
            title="Open Session"
            subtitle="Self-guided training"
            iconName="weight-lifter"
            iconColor="#10b981"
            iconBgColor="#ecfdf5"
            onPress={() => openSheet('FREE')}
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
          title: summary?.nearestCourse?.title || 'Strength Training',
          zone: summary?.nearestCourse?.gymZone || 'Zone A',
          schedule: summary?.nearestCourse
            ? `Mon ${summary.nearestCourse.startTime}-${summary.nearestCourse.endTime}`
            : 'Mon 12:00-14:00',
          instructor: 'Coach Karim A.',
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
