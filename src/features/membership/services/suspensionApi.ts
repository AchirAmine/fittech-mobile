import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

export type SuspensionRequestStatus = 'EN_ATTENTE_VALIDATION' | 'ACCEPTEE' | 'REFUSEE' | 'ANNULEE';

export interface SuspensionRequest {
  id: string;
  subscriptionId: string;
  requestedStartDate: string;
  requestedEndDate: string;
  reason: string;
  comment?: string;
  justificationDocumentUrl?: string;
  justificationSubmittedAt?: string;
  status: SuspensionRequestStatus;
  createdAt: string;
}

export interface DirectSuspension {
  id: string;
  subscriptionId: string;
  startDate: string;
  plannedEndDate: string;
  actualEndDate?: string | null;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  type: string;
  createdAt: string;
}

export interface SuspensionPolicy {
  minNoticeHours: number;
  minDurationDays: number;
  maxDurationDays: number;
  maxSuspensionsPerYear: number;
}

export const suspensionApi = {
  getSuspensionPolicy: async (): Promise<SuspensionPolicy> => {
    const { data } = await axiosClient.get<{ success: boolean; data: SuspensionPolicy }>(
      API_ENDPOINTS.SUSPENSIONS.POLICY
    );
    return data.data;
  },

  getRequests: async (subscriptionId: string): Promise<SuspensionRequest[]> => {
    const { data } = await axiosClient.get<{ suspensionRequests: SuspensionRequest[] }>(
      API_ENDPOINTS.SUSPENSIONS.REQUESTS(subscriptionId)
    );
    return data.suspensionRequests;
  },

  createRequest: async (
    subscriptionId: string,
    formData: FormData
  ): Promise<SuspensionRequest> => {
    const { data } = await axiosClient.post<{ message: string; suspensionRequest: SuspensionRequest }>(
      API_ENDPOINTS.SUSPENSIONS.REQUESTS(subscriptionId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.suspensionRequest;
  },

  cancelRequest: async (requestId: string): Promise<void> => {
    await axiosClient.patch(API_ENDPOINTS.SUSPENSIONS.CANCEL(requestId));
  },

  getRequestDetail: async (requestId: string): Promise<SuspensionRequest> => {
    const { data } = await axiosClient.get<SuspensionRequest>(
      API_ENDPOINTS.SUSPENSIONS.DETAIL(requestId)
    );
    return data;
  },

  getDirectSuspensions: async (subscriptionId: string): Promise<DirectSuspension[]> => {
    const { data } = await axiosClient.get<{ success: boolean, data: DirectSuspension[] }>(
      API_ENDPOINTS.SUSPENSIONS.DIRECT_LIST(subscriptionId)
    );
    return data.data;
  },

  createDirectSuspension: async (subscriptionId: string, payload: { date_debut: string; date_fin: string }): Promise<DirectSuspension> => {
    const { data } = await axiosClient.post<{ success: boolean, data: DirectSuspension }>(
      API_ENDPOINTS.SUSPENSIONS.DIRECT_SUSPEND(subscriptionId),
      payload
    );
    return data.data;
  },

  resumeDirectSuspension: async (subscriptionId: string): Promise<DirectSuspension> => {
    const { data } = await axiosClient.post<{ success: boolean, data: DirectSuspension }>(
      API_ENDPOINTS.SUSPENSIONS.DIRECT_RESUME(subscriptionId)
    );
    return data.data;
  },
};
