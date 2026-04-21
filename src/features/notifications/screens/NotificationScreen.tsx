import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen, Loader } from '@shared/components';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '../hooks/useNotifications';
import { NotificationItem } from '../components/NotificationItem';
import { Notification } from '../types/notification.types';
import { ROUTES } from '@navigation/routes';
import { HomeStackParamList } from '@appTypes/navigation.types';
const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { title: string; data: Notification[] }[] = [];
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const grouped: Record<string, Notification[]> = {};
  for (const n of notifications) {
    const dateStr = new Date(n.createdAt).toDateString();
    let label: string;
    if (dateStr === today) label = 'TODAY';
    else if (dateStr === yesterday) label = 'YESTERDAY';
    else {
      label = new Date(n.createdAt)
        .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        .toUpperCase();
    }
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(n);
  }
  for (const title of Object.keys(grouped)) {
    groups.push({ title, data: grouped[title] });
  }
  return groups;
};
export const NotificationScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const { data, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead();
  const notifications = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const groups = groupNotificationsByDate(notifications);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        unreadCount > 0 ? (
          <TouchableOpacity
            onPress={() => markAllAsRead()}
            style={styles.markAllBtn}
            activeOpacity={0.7}
          >
            <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, unreadCount, markAllAsRead, colors]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <AppScreen safeArea={false} scrollable={false} backgroundColor={colors.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {unreadCount > 0 && (
          <View
            style={[
              styles.unreadBanner,
              {
                backgroundColor: hexToRGBA(colors.primary, 0.08),
                borderColor: hexToRGBA(colors.primary, 0.2),
              },
            ]}
          >
            <Ionicons name="ellipse" size={8} color={colors.primary} />
            <Text style={[styles.unreadBannerText, { color: colors.primary }]}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
        <View style={styles.listContent}>
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View
                style={[styles.emptyIconBg, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}
              >
                <Ionicons name="notifications-off-outline" size={44} color={colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>All caught up!</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                You have no notifications at the moment.
              </Text>
            </View>
          ) : (
            groups.map((group) => (
              <View key={group.title}>
                <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
                  {group.title}
                </Text>
                {group.data.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onPress={(id) => navigation.navigate(ROUTES.MAIN.NOTIFICATION_DETAIL as any, { notificationId: id })}
                  />
                ))}
              </View>
            ))
          )}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </AppScreen>
  );
};
const styles = StyleSheet.create({
  listContent: {
    paddingTop: 16,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  unreadBannerText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 8,
  },
  markAllBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingTop: 80,
  },
  emptyIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
