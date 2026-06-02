import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Session } from '@appTypes/planning';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useEnrollInCourse, useCancelEnrollment, useJoinWaitlist } from '../hooks/usePlanning';

interface Props {
  session: Session;
}

const SessionItem: React.FC<Props> = ({ session }) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [actionLoading, setActionLoading] = useState(false);

  const enrollMutation = useEnrollInCourse();
  const cancelMutation = useCancelEnrollment();
  const waitlistMutation = useJoinWaitlist();

  const isClass = session.type === 'class';
  const isFull = session.statusBadge === 'FULL';
  const isReserved = session.statusBadge === 'RESERVED';
  const isWaitlisted = session.statusBadge === 'WAITLISTED';

  const isLoading = enrollMutation.isPending || cancelMutation.isPending || waitlistMutation.isPending || actionLoading;

  const cardBg = isDark ? colors.card : colors.white;
  const cardBorderColor = isClass
    ? hexToRGBA(colors.primary, 0.3)
    : (isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05));

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'FULL': return colors.error;
      case 'OPEN': return colors.primary;
      case 'RESERVED': return colors.success;
      case 'WAITLISTED': return colors.warning;
      default: return colors.primary;
    }
  };

  const getStatusLabel = (status?: string): string => {
    switch (status) {
      case 'RESERVED': return 'Reserved ✓';
      case 'WAITLISTED': return 'Waitlisted';
      case 'FULL': return 'Waitlist';
      default: return 'Join';
    }
  };

  const getActionButtonColor = () => {
    if (isReserved) return colors.success;
    if (isWaitlisted) return colors.warning;
    if (isFull) return hexToRGBA(colors.primary, 0.7);
    return colors.primary;
  };

  const handleViewDetails = () => {
    if (isClass) {
      navigation.navigate(ROUTES.MAIN.COURSE_DETAILS as any, {
        courseId: session.id,
        courseTitle: session.title,
      });
    }
  };

  const handleEnrollAction = async () => {
    if (!session.id || isLoading) return;

    if (isReserved) {
      // Confirm before cancelling
      Alert.alert(
        'Cancel Reservation',
        `Are you sure you want to cancel your reservation for "${session.title}"?`,
        [
          { text: 'Keep', style: 'cancel' },
          {
            text: 'Cancel Reservation',
            style: 'destructive',
            onPress: async () => {
              try {
                setActionLoading(true);
                await cancelMutation.mutateAsync(session.id);
              } catch (err: any) {
                Alert.alert('Error', err?.message || 'Could not cancel reservation.');
              } finally {
                setActionLoading(false);
              }
            },
          },
        ]
      );
      return;
    }

    if (isWaitlisted) {
      // Already on waitlist — navigate to details
      handleViewDetails();
      return;
    }

    if (isFull) {
      // Join waitlist
      try {
        setActionLoading(true);
        await waitlistMutation.mutateAsync(session.id);
      } catch (err: any) {
        Alert.alert('Error', err?.message || 'Could not join waitlist.');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    // Enroll
    try {
      setActionLoading(true);
      await enrollMutation.mutateAsync(session.id);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not complete enrollment.');
    } finally {
      setActionLoading(false);
    }
  };

  // Format closing time for open sessions: "HH:MM" → "Closes at HH:MM"
  const openSessionClosingLabel = session.endTime
    ? `Closes at ${session.endTime}`
    : session.duration
      ? `Closes at ${session.duration}`
      : 'Open session';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: cardBorderColor,
            borderWidth: 1,
          },
        ]}
        onPress={isClass ? handleViewDetails : undefined}
        activeOpacity={isClass ? 0.85 : 1}
      >
        {/* Status badge */}
        {session.statusBadge && (
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(session.statusBadge) },
          ]}>
            <Text style={[styles.statusBadgeText, { color: colors.white }]}>
              {session.statusBadge}
            </Text>
          </View>
        )}

        <View style={styles.mainContent}>
          <View style={styles.textDetails}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {session.title}
            </Text>

            {isClass ? (
              <View style={styles.infoRow}>
                {session.coach && (
                  <View style={styles.infoItem}>
                    <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{session.coach}</Text>
                  </View>
                )}
                {session.duration && (
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{session.duration}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.openInfo}>
                <View style={[styles.closingBadge, { backgroundColor: hexToRGBA(colors.textSecondary, 0.1) }]}>
                  <Ionicons name="exit-outline" size={14} color={colors.textPrimary} />
                  <Text style={[styles.closingText, { color: colors.textPrimary }]}>
                    {openSessionClosingLabel}
                  </Text>
                </View>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
                  {session.subtitle}
                </Text>
              </View>
            )}

            {/* Zone badge */}
            {isClass && session.zone && (
              <View style={styles.zoneRow}>
                <Ionicons name="location-outline" size={14} color={colors.primary} />
                <Text style={[styles.zoneText, { color: colors.primary }]}>Zone {session.zone}</Text>
              </View>
            )}
          </View>

          {/* Coach avatar */}
          {isClass && session.coachAvatar && (
            <TouchableOpacity onPress={handleViewDetails} activeOpacity={0.85}>
              <Image source={{ uri: session.coachAvatar }} style={[styles.avatar, { borderColor: colors.white }]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Footer: enrollment bar + action button */}
        {isClass && session.enrolled !== undefined && session.capacity !== undefined && (
          <View style={styles.footer}>
            <View style={styles.enrollmentSection}>
              <View style={styles.enrollmentLabels}>
                <Text style={[styles.enrollmentTitle, { color: isFull ? colors.error : colors.textSecondary }]}>
                  {isFull ? 'FULLY BOOKED' : `${session.capacity - session.enrolled} SPOTS LEFT`}
                </Text>
                <Text style={[styles.enrollmentCount, { color: colors.textSecondary }]}>
                  {session.enrolled}/{session.capacity}
                </Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.1) : hexToRGBA(colors.black, 0.05) }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: isFull ? colors.error : colors.primary,
                      width: `${Math.min((session.enrolled / session.capacity) * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Action button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: getActionButtonColor() },
                isLoading && { opacity: 0.7 },
              ]}
              activeOpacity={0.8}
              onPress={handleEnrollAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={[styles.actionButtonText, { color: colors.white }]}>
                  {getStatusLabel(session.statusBadge)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  statusBadgeText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 11,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  textDetails: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 18,
    marginBottom: 6,
  },
  openInfo: {
    gap: 8,
  },
  closingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  closingText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 13,
  },
  subtitle: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  zoneText: {
    fontFamily: Theme.Typography.fontFamily.semiBold,
    fontSize: 13,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  enrollmentSection: {
    flex: 1,
  },
  enrollmentLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  enrollmentTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  enrollmentCount: {
    fontFamily: Theme.Typography.fontFamily.semiBold,
    fontSize: 11,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionButton: {
    minWidth: 80,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 14,
  },
});

export default memo(SessionItem);
