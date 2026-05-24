import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityLog } from '../types/activity.types';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@shared/constants/colors';

interface ActivityItemProps {
  activity: ActivityLog;
}

const VALID_ICON_NAMES = new Set([
  'calendar-outline', 'close-circle-outline', 'checkmark-circle-outline',
  'add-circle-outline', 'location-outline', 'qr-code-outline',
  'warning-outline', 'star', 'star-half-outline', 'star-outline',
  'gift-outline', 'card-outline', 'receipt-outline', 'mail-unread-outline',
  'send-outline', 'thumbs-up-outline', 'arrow-undo-outline', 'flash-outline',
  'person-add-outline', 'trending-up-outline', 'checkmark-done-outline',
  'person-outline', 'time-outline',
]);

const safeIcon = (name: string) => VALID_ICON_NAMES.has(name) ? name : 'time-outline';

const getIconForCategory = (category: string, type: string, colors: any) => {
  if (type === 'COURSE_RESERVATION') return { name: safeIcon('calendar-outline'), color: colors.primary, bg: colors.primary + '15' };
  if (type === 'COURSE_CANCELLATION') return { name: safeIcon('close-circle-outline'), color: colors.error, bg: colors.error + '15' };
  if (type === 'COURSE_COMPLETED') return { name: safeIcon('checkmark-circle-outline'), color: colors.success, bg: colors.success + '15' };
  if (type === 'COURSE_CREATION') return { name: safeIcon('add-circle-outline'), color: colors.info, bg: colors.info + '15' };

  if (type === 'OPEN_SESSION_CHECKIN' || type === 'ATTENDANCE_CONFIRMED') return { name: safeIcon('location-outline'), color: colors.success, bg: colors.success + '15' };
  if (type === 'QR_SCAN_DOOR') return { name: safeIcon('qr-code-outline'), color: colors.primary, bg: colors.primary + '15' };
  if (type === 'SESSION_MISSED') return { name: safeIcon('warning-outline'), color: colors.error, bg: colors.error + '15' };

  if (type === 'STARS_EARNED') return { name: safeIcon('star'), color: colors.warning, bg: colors.warning + '15' };
  if (type === 'STARS_REDEEMED') return { name: safeIcon('star-half-outline'), color: colors.warning, bg: colors.warning + '15' };
  if (type === 'PROMO_CODE_CLAIMED') return { name: safeIcon('gift-outline'), color: '#9b59b6', bg: '#9b59b615' };

  if (type === 'SUBSCRIPTION_PURCHASED') return { name: safeIcon('card-outline'), color: colors.primary, bg: colors.primary + '15' };
  if (type === 'PAYMENT_COMPLETED') return { name: safeIcon('receipt-outline'), color: colors.success, bg: colors.success + '15' };

  if (type === 'PERSONAL_COACHING_INVITATION_RECEIVED') return { name: safeIcon('mail-unread-outline'), color: colors.info, bg: colors.info + '15' };
  if (type === 'PERSONAL_COACHING_INVITATION_SENT') return { name: safeIcon('send-outline'), color: colors.primary, bg: colors.primary + '15' };
  if (type === 'PERSONAL_COACHING_INVITATION_ACCEPTED') return { name: safeIcon('thumbs-up-outline'), color: colors.success, bg: colors.success + '15' };
  if (type === 'PERSONAL_COACHING_INVITATION_REJECTED') return { name: safeIcon('close-circle-outline'), color: colors.error, bg: colors.error + '15' };
  if (type === 'PERSONAL_COACHING_INVITATION_WITHDRAWN') return { name: safeIcon('arrow-undo-outline'), color: colors.textSecondary, bg: colors.cardSecondary };
  if (type === 'PERSONAL_COACHING_ACTIVATED') return { name: safeIcon('flash-outline'), color: colors.warning, bg: colors.warning + '15' };

  if (type === 'COACH_JOINED') return { name: safeIcon('person-add-outline'), color: colors.primary, bg: colors.primary + '15' };
  if (type === 'COACH_PROMOTED') return { name: safeIcon('trending-up-outline'), color: colors.success, bg: colors.success + '15' };
  if (type === 'COACH_ACCEPTED') return { name: safeIcon('checkmark-done-outline'), color: colors.success, bg: colors.success + '15' };
  if (type === 'COACH_REJECTED') return { name: safeIcon('close-circle-outline'), color: colors.error, bg: colors.error + '15' };

  switch (category) {
    case 'courses': return { name: safeIcon('calendar-outline'), color: colors.primary, bg: colors.primary + '15' };
    case 'attendance': return { name: safeIcon('location-outline'), color: colors.success, bg: colors.success + '15' };
    case 'rewards': return { name: safeIcon('star-outline'), color: colors.warning, bg: colors.warning + '15' };
    case 'payments': return { name: safeIcon('card-outline'), color: colors.info, bg: colors.info + '15' };
    case 'personal': return { name: safeIcon('person-outline'), color: colors.primary, bg: colors.primary + '15' };
    default: return { name: 'time-outline', color: colors.textSecondary, bg: colors.cardSecondary };
  }
};

const getStatusColor = (status: string | undefined, colors: any) => {
  if (!status) return { bg: 'transparent', text: 'transparent' };

  const lowerStatus = status.toLowerCase();
  if (['success', 'verified', 'completed', 'active'].includes(lowerStatus)) {
    return { bg: Palette.semantic.success + '20', text: Palette.semantic.success };
  }
  if (['refunded', 'canceled', 'rejected', 'missed'].includes(lowerStatus)) {
    return { bg: Palette.semantic.error + '20', text: Palette.semantic.error };
  }
  if (['limited time', 'pending', 'reserved'].includes(lowerStatus)) {
    return { bg: Palette.semantic.info + '20', text: Palette.semantic.info };
  }

  return { bg: colors.border, text: colors.textSecondary };
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return `${diffDays}d ago`;
  }
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const { colors } = useTheme();

  const iconConfig = getIconForCategory(activity.category, activity.type, colors);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconConfig.bg }]}>
        <Ionicons name={iconConfig.name as any} size={24} color={iconConfig.color} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
            {activity.title}
          </Text>
          <View style={styles.timeWrapper}>
            <Text style={[styles.time, { color: colors.textMuted }]}>
              {formatTime(activity.createdAt)}
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {activity.description}
        </Text>

        {activity.status && (
          <View style={styles.statusPillContainer}>
            <View style={[styles.statusPill, { backgroundColor: iconConfig.bg }]}>
              <Text style={[styles.statusText, { color: iconConfig.color }]}>
                {activity.status.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontFamily: Theme.Typography.fontFamily.semiBold,
    fontSize: 16,
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  timeWrapper: {
    paddingTop: 2,
  },
  time: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 12,
  },
  description: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    marginBottom: 8,
  },
  statusPillContainer: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 24,
  },
  statusText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
