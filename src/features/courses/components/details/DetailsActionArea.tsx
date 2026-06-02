import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Course } from '@appTypes/course';
import { useJoinWaitingList, useCancelReservation, useReserveCourse } from '../../hooks/useCourses';
import { useMemberPolicy } from '../../../account/hooks/useMemberPolicy';
import { StatusModal, StatusModalType } from '@shared/components/ui/StatusModal';
interface Props {
  course: Course;
}
const DetailsActionArea: React.FC<Props> = ({ course }) => {
  const { colors, isDark } = useTheme();
  const [modalConfig, setModalConfig] = React.useState<{
    visible: boolean;
    type: StatusModalType;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    visible: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const hideModal = () => setModalConfig(prev => ({ ...prev, visible: false }));
  const showModal = (type: StatusModalType, title: string, message: string, onConfirm?: () => void) => {
    setModalConfig({
      visible: true,
      type,
      title,
      message,
      onConfirm: onConfirm || hideModal,
    });
  };
  const { mutate: reserve, isPending: isReserving } = useReserveCourse();
  const { mutate: cancel, isPending: isCancelling } = useCancelReservation();
  const { mutate: joinWait, isPending: isJoiningWait } = useJoinWaitingList();
  const { data: memberPolicy } = useMemberPolicy();
  const cancelHours = memberPolicy?.reservationPolicy?.cancellationWithoutPenaltyHours ?? 2;

  const handleReserve = () => {
    reserve(course.id, {
      onSuccess: () => {
        showModal(
          'success',
          'Booking Confirmed!',
          `Your spot is secured. You can cancel your reservation up to ${cancelHours} hours before the session starts.`
        );
      },
      onError: (error: any) => {
        showModal(
          'error',
          'Booking Failed',
          error?.message || 'Something went wrong while reserving this course. Please try again.'
        );
      }
    });
  };
  const handleJoinWait = () => {
    joinWait(course.id, {
      onSuccess: () => {
        showModal(
          'success',
          'Waitlist Joined',
          "You're on the list! We'll notify you immediately if a spot becomes available."
        );
      },
      onError: (error: any) => {
        showModal(
          'error',
          'Waitlist Failed',
          error?.message || 'Failed to join the waitlist. Please try again.'
        );
      }
    });
  };
  const handleCancel = () => {
    showModal(
      'confirm',
      'Cancel Reservation?',
      'Are you sure you want to cancel? This action cannot be undone.',
      () => {
        hideModal();
        cancel(course.id, {
          onSuccess: () => {
            showModal(
              'success',
              'Reservation Cancelled',
              'Your reservation has been successfully cancelled.'
            );
          },
          onError: (error: any) => {
            showModal(
              'error',
              'Cancellation Failed',
              error?.message || 'Failed to cancel reservation. Please try again.'
            );
          }
        });
      }
    );
  };
  const isTimeForCancelEnabled = course.canCancel ?? true; 
  const isConfirmType = modalConfig.type === 'confirm';

  return (
    <>
      {(() => {
        if (course.status === 'FULL') {
          return (
            <View style={[styles.waitingListCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.waitingListTitle, { color: colors.white }]}>Join the Waiting List</Text>
              <Text style={[styles.waitingListSubtitle, { color: colors.textSecondary }]}>
                Get notified instantly when a spot opens up
              </Text>
              <Text style={[styles.waitingListLine, { color: colors.textSecondary }]}>
                You would be #4 in line
              </Text>
              <TouchableOpacity 
                style={[styles.reserveButton, { backgroundColor: colors.primary, marginTop: 16 }]}
                activeOpacity={0.8}
                onPress={handleJoinWait}
                disabled={isJoiningWait}
              >
                {isJoiningWait ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.reserveButtonText}>JOIN WAITING LIST</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        }
        if (course.status === 'WAITLISTED') {
          return (
            <View style={[styles.waitingListCard, { backgroundColor: isDark ? hexToRGBA(colors.success, 0.1) : hexToRGBA(colors.success, 0.05), borderColor: colors.success, borderWidth: 1 }]}>
              <Text style={[styles.waitingListTitle, { color: colors.success }]}>You're on the list! 🎉</Text>
              <Text style={[styles.waitingListSubtitle, { color: colors.textSecondary }]}>
                We'll notify you immediately if a spot becomes available for this session.
              </Text>
              <View style={[styles.reserveButton, { backgroundColor: colors.success, opacity: 0.9, marginTop: 16 }]}>
                <Text style={styles.reserveButtonText}>WAITING LIST JOINED</Text>
              </View>
            </View>
          );
        }
        if (course.status === 'RESERVED') {
          if (isTimeForCancelEnabled) {
            return (
              <TouchableOpacity 
                style={[styles.reserveButton, { backgroundColor: hexToRGBA(colors.error, 0.1), borderWidth: 1, borderColor: colors.error }]}
                activeOpacity={0.8}
                onPress={handleCancel}
                disabled={isCancelling}
              >
                <Text style={[styles.reserveButtonText, { color: colors.error }]}>CANCEL RESERVATION</Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <View style={[styles.reserveButton, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05), opacity: 0.8 }]}>
                <Text style={[styles.reserveButtonText, { color: colors.textSecondary }]}>CANCEL DEADLINE PASSED</Text>
              </View>
            );
          }
        }
        return (
          <TouchableOpacity 
            style={[styles.reserveButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={handleReserve}
            disabled={isReserving}
          >
            {isReserving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.reserveButtonText}>RESERVE THIS COURSE</Text>
            )}
          </TouchableOpacity>
        );
      })()}

      {isCancelling && (
        <View style={[styles.fullScreenLoader, { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)' }]}>
          <View style={[styles.loaderContainer, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1.5 }]}>
            <ActivityIndicator size="large" color={colors.primaryMid} />
            <Text style={[styles.loaderText, { color: colors.textPrimary }]}>Cancelling reservation...</Text>
          </View>
        </View>
      )}

      <StatusModal 
        {...modalConfig}
        onClose={hideModal}
        confirmText={isConfirmType ? 'Yes, Cancel' : 'Got it'}
        cancelText={isConfirmType ? 'No, Keep it' : undefined}
      />
    </>
  );
};
const styles = StyleSheet.create({
  reserveButton: {
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
    elevation: 12,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  reserveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
  },
  waitingListCard: {
    padding: 24,
    borderRadius: 24,
    marginTop: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    gap: 4,
  },
  waitingListTitle: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  waitingListSubtitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  waitingListLine: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  fullScreenLoader: {
    position: 'absolute',
    top: -600,
    bottom: -600,
    left: -50,
    right: -50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loaderContainer: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  loaderText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  }
});
export default DetailsActionArea;
