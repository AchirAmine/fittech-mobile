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

export interface SessionData {
  id: string;
  status: string;
  checkInAt: string;
  checkOutAt?: string | null;
  durationMin?: number | null;
  accessType: string;
}

export interface CheckoutResponse {
  success: boolean;
  message?: string;
  data?: SessionData;
}

export const checkInOutService = {
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

  getOpenSession: async (): Promise<SessionData | null> => {
    try {
      const response = await axiosClient.get<{ success: boolean; data: SessionData | null }>(
        API_ENDPOINTS.PRESENCE.OPEN_SESSION
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  },

  checkout: async (data?: { sessionId?: string }): Promise<CheckoutResponse> => {
    const response = await axiosClient.post<CheckoutResponse>(
      API_ENDPOINTS.PRESENCE.CHECKOUT,
      data || {}
    );
    return response.data;
  }
};
