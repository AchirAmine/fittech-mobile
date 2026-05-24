import axiosClient from '@shared/services/axiosClient';
import { ActivityResponse, FetchActivityFilters } from '../types/activity.types';
import { ApiResponse } from '@appTypes/api.types';

export const activityService = {
  getMemberActivities: async (filters: FetchActivityFilters = {}): Promise<ActivityResponse> => {
    const params = new URLSearchParams();
    
    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await axiosClient.get<ApiResponse<ActivityResponse>>(`/activities/member?${params.toString()}`);
    return response.data.data;
  },
};
