import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

export interface CheckInRequest {
  zone: 'GYM' | 'POOL';
  sessionType: 'FREE' | 'COURSE';
}

export interface CheckInResponse {
  success: boolean;
  message?: string;
  data?: {
    success: boolean;
    message?: string;
    remainingFreeSessions?: number;
    courseId?: string;
    courseTitle?: string;
    coachName?: string;
  };
}

export const checkInService = {
  scanDoor: async (data: CheckInRequest): Promise<{ success: boolean; message?: string }> => {
    const response = await axiosClient.post<CheckInResponse>(
      API_ENDPOINTS.PRESENCE.SCAN_DOOR,
      data,
    );
    
    return response.data.data ?? response.data;
  },

  scanCoach: async (qrToken: string): Promise<{ success: boolean; message?: string }> => {
    const response = await axiosClient.post(API_ENDPOINTS.PRESENCE.SCAN_COACH, { qrToken });
    return response.data;
  },
};
