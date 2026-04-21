import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen, Loader } from '@shared/components';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { useNotifications, useMarkNotificationRead } from '../hooks/useNotifications';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { NotificationType } from '../types/notification.types';
type NotificationDetailRouteProp = RouteProp<HomeStackParamList, 'NotificationDetail'>;
function getNotificationMeta(type: NotificationType) {
  switch (type) {
    case 'SUBSCRIPTION_ACTIVATED':
      return { icon: 'shield-outline' as const, color: '#00C897', label: 'Subscription' };
    case 'SUBSCRIPTION_EXPIRED':
      return { icon: 'alert-circle-outline' as const, color: '#FF3B30', label: 'Expired' };
    case 'COURSE_ENROLLED':
      return { icon: 'calendar-outline' as const, color: '#007AFF', label: 'Enrollment' };
    case 'COURSE_CANCELLED':
      return { icon: 'calendar-outline' as const, color: '#FF9500', label: 'Cancelled' };
    case 'COURSE_APPROVED':
      return { icon: 'star-outline' as const, color: '#F4A800', label: 'Approved' };
    case 'COURSE_REJECTED':
      return { icon: 'close-circle-outline' as const, color: '#8E8E93', label: 'Rejected' };
    case 'WAITLIST_SPOT_OPENED':
      return { icon: 'people-outline' as const, color: '#5856D6', label: 'Waitlist' };
    case 'PLANNING_SLOT_DELETED':
      return { icon: 'trash-outline' as const, color: '#FF3B30', label: 'Planning' };
    case 'COACH_ACCEPTED_INVITATION':
    case 'COACH_WITHDREW_INVITATION':
    case 'COACHING_INVITATION_EXPIRED':
    case 'COACHING_RELATIONSHIP_ENDED':
      return { icon: 'person-circle-outline' as const, color: '#9C27B0', label: 'Coaching' };
    case 'COACHING_SLOT_CANCELLED':
      return { icon: 'time-outline' as const, color: '#CC0000', label: 'Coaching' };
    case 'PROMO_OFFER_QUALIFIED':
    case 'PROMO_CODE_ISSUED':
      return { icon: 'gift-outline' as const, color: '#FF3B30', label: 'Promotion' };
    case 'PROMO_CODE_EXPIRING_SOON':
      return { icon: 'timer-outline' as const, color: '#F4A800', label: 'Urgent' };
    case 'STARS_AWARDED':
      return { icon: 'ribbon-outline' as const, color: '#D4AF37', label: 'Rewards' };
    default:
      return { icon: 'information-circle-outline' as const, color: '#007AFF', label: 'Update' };
  }
}
export const NotificationDetailScreen = () => {
  const { colors } = useTheme();
  const route = useRoute<NotificationDetailRouteProp>();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const { notificationId } = route.params;
  const { data, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const notifications = data?.items ?? [];
  const notification = notifications.find((n) => n.id === notificationId);
  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notificationId);
    }
  }, [notificationId, notification?.isRead]);
  if (isLoading) return <Loader />;
  if (!notification) {
    return (
      <AppScreen backgroundColor={colors.background}>
        <View style={styles.centered}>
          <Text style={{ color: colors.textPrimary }}>Notification not found</Text>
        </View>
      </AppScreen>
    );
  }
  const { icon: iconName, color: themeColor, label } = getNotificationMeta(notification.type);
  const formattedDate = new Date(notification.createdAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const handleAction = () => {
    const { metadata, type } = notification;
    if (metadata?.courseId) {
      navigation.navigate(ROUTES.MAIN.COURSE_DETAILS as any, {
        courseId: metadata.courseId,
        courseTitle: metadata.courseTitle,
      });
    } else if (metadata?.promoCode || type === 'STARS_AWARDED' || type === 'PROMO_CODE_ISSUED') {
      navigation.navigate(ROUTES.MAIN.REWARDS as any);
    } else if (type === 'SUBSCRIPTION_ACTIVATED' || type === 'SUBSCRIPTION_EXPIRED') {
      navigation.navigate(ROUTES.MAIN.MY_PLANS as any);
    } else if (type.startsWith('COACHING_') || type.startsWith('COACH_')) {
      navigation.navigate(ROUTES.MAIN.MY_COACHING_DASHBOARD as any);
    }
  };
  return (
    <AppScreen safeArea={false} backgroundColor={colors.background}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: hexToRGBA(themeColor, 0.1) }]}>
            <Ionicons name={iconName} size={32} color={themeColor} />
          </View>
          <Text style={[styles.label, { color: themeColor }]}>{label}</Text>
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{notification.title}</Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>{formattedDate}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.body}>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{notification.body}</Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 8,
    lineHeight: 32,
  },
  date: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 24,
  },
  body: {
    marginBottom: 40,
  },
  message: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 26,
  },
  actionButton: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
