import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, NotificationResponse } from '../services/notificationService';
import { Notification } from '../types/notification.types';
const NOTIFICATIONS_KEY = ['notifications'] as const;
export const useNotifications = () => {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => notificationService.getNotifications(),
    staleTime: 30 * 1000,
  });
};
export const useUnreadCount = () => {
  const { data } = useNotifications();
  return data?.unreadCount ?? 0;
};
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData<NotificationResponse>(NOTIFICATIONS_KEY);
      if (previous) {
        queryClient.setQueryData<NotificationResponse>(NOTIFICATIONS_KEY, {
          ...previous,
          unreadCount: Math.max(0, previous.unreadCount - 1),
          items: previous.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        });
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
      }
    },
  });
};
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData<NotificationResponse>(NOTIFICATIONS_KEY);
      if (previous) {
        queryClient.setQueryData<NotificationResponse>(NOTIFICATIONS_KEY, {
          items: previous.items.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
      }
    },
  });
};
