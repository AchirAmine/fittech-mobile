import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';
import axiosClient from '../../../shared/services/axiosClient';
import { Notification } from '../types/notification.types';
export interface NotificationResponse {
  items: Notification[];
  unreadCount: number;
}
export const notificationService = {
  async getNotifications(): Promise<NotificationResponse> {
    const { data } = await axiosClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
    return data.data; 
  },
  async markAsRead(id: string): Promise<Notification> {
    const { data } = await axiosClient.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
    return data.data;
  },
  async markAllAsRead(): Promise<{ markedCount: number }> {
    const { data } = await axiosClient.patch(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
    return data.data;
  },
};
