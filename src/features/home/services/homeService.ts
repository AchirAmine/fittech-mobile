import axiosClient from '@shared/services/axiosClient';
import { HomeSummary } from '../types/home.types';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

export const getHomeSummary = async (): Promise<HomeSummary> => {
  const { data } = await axiosClient.get(API_ENDPOINTS.MEMBER_EXTENDED.HOME_SUMMARY);
  return data.data;
};
