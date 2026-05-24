import axiosClient from "@shared/services/axiosClient";
import { API_ENDPOINTS } from "@shared/constants/apiEndpoints";

export const settingsService = {
  changePassword: async (data: any): Promise<void> => {
    const response = await axiosClient.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  },
  getNotificationPreferences: async (): Promise<any> => {
    const response = await axiosClient.get(API_ENDPOINTS.MEMBER.NOTIFICATION_PREFERENCES);
    return response.data.data;
  },
  updateNotificationPreferences: async (data: any): Promise<any> => {
    const response = await axiosClient.patch(API_ENDPOINTS.MEMBER.NOTIFICATION_PREFERENCES, data);
    return response.data.data;
  },
  getPrivacySettings: async (): Promise<any> => {
    const response = await axiosClient.get(API_ENDPOINTS.MEMBER.PRIVACY_SETTINGS);
    return response.data.data;
  },
  updatePrivacySettings: async (data: any): Promise<any> => {
    const response = await axiosClient.patch(API_ENDPOINTS.MEMBER.PRIVACY_SETTINGS, data);
    return response.data.data;
  }
};
