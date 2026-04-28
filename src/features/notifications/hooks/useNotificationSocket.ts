import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectToken } from '@features/auth/store/authSelectors';
import { initializeSocket, registerOnce } from '@features/chat/services/socketClient';
import { Notification } from '../types/notification.types';
export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const token = useSelector(selectToken);
  useEffect(() => {
    if (!token) return;
    const socket = initializeSocket(token);
    registerOnce('notification:new', (newNotification: Notification) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.setQueryData<Notification[]>(['notifications'], (old = []) => {
        if (old.some(n => n.id === newNotification.id)) return old;
        return [newNotification, ...old];
      });
    });
    return () => {
    };
  }, [token, queryClient]);
}
