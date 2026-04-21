import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Notification, NotificationType } from '../types/notification.types';
interface NotificationItemProps {
  notification: Notification;
  onPress: (id: string) => void;
}
type IconName = React.ComponentProps<typeof Ionicons>['name'];
function getNotificationMeta(type: NotificationType): { icon: IconName; color: string } {
  switch (type) {
    case 'SUBSCRIPTION_ACTIVATED':
      return { icon: 'shield-outline', color: '#00C897' };
    case 'SUBSCRIPTION_EXPIRED':
      return { icon: 'alert-circle-outline', color: '#FF3B30' };
    case 'COURSE_ENROLLED':
      return { icon: 'calendar-outline', color: '#007AFF' };
    case 'COURSE_CANCELLED':
      return { icon: 'calendar-outline', color: '#FF9500' };
    case 'COURSE_APPROVED':
      return { icon: 'star-outline', color: '#F4A800' };
    case 'COURSE_REJECTED':
      return { icon: 'close-circle-outline', color: '#8E8E93' };
    case 'WAITLIST_SPOT_OPENED':
      return { icon: 'people-outline', color: '#5856D6' };
    case 'PLANNING_SLOT_DELETED':
      return { icon: 'trash-outline', color: '#FF3B30' };
    case 'COACH_ACCEPTED_INVITATION':
    case 'COACHING_RELATIONSHIP_ENDED':
      return { icon: 'person-circle-outline', color: '#9C27B0' };
    case 'COACHING_SLOT_CANCELLED':
      return { icon: 'time-outline', color: '#CC0000' };
    case 'PROMO_OFFER_QUALIFIED':
    case 'PROMO_CODE_ISSUED':
      return { icon: 'gift-outline', color: '#FF3B30' };
    case 'PROMO_CODE_EXPIRING_SOON':
      return { icon: 'timer-outline', color: '#F4A800' };
    case 'STARS_AWARDED':
      return { icon: 'ribbon-outline', color: '#D4AF37' };
    case 'SYSTEM':
    default:
      return { icon: 'information-circle-outline', color: '#007AFF' };
  }
}
function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}
export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const { colors } = useTheme();
  const { icon, color } = getNotificationMeta(notification.type);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: notification.isRead ? colors.card : hexToRGBA(colors.primary, 0.06),
          borderColor: notification.isRead ? colors.border : hexToRGBA(colors.primary, 0.2),
        },
      ]}
      activeOpacity={0.75}
      onPress={() => onPress(notification.id)}
    >
      <View style={[styles.iconWrapper, { backgroundColor: hexToRGBA(color, 0.12) }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
              !notification.isRead && styles.titleUnread,
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text style={[styles.time, { color: colors.textMuted }]}>
            {formatTimeAgo(notification.createdAt)}
          </Text>
        </View>
        <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>
      {!notification.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
  titleUnread: {
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  time: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.medium,
    flexShrink: 0,
  },
  message: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    flexShrink: 0,
  },
});
