import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { RewardsSummary, StarTransaction, Voucher } from '../types/rewards.types';

export const useRewards = () => {
  return useQuery({
    queryKey: ['rewardsSummary'],
    queryFn: async () => {
      const response = await axiosClient.get<{ success: boolean; data: RewardsSummary }>(API_ENDPOINTS.PROMO.ACTIVE);
      return response.data.data;
    },
  });
};

export const useRewardHistory = () => {
  return useQuery({
    queryKey: ['rewardHistory'],
    queryFn: async () => {
      const response = await axiosClient.get<{ success: boolean; data: StarTransaction[] }>(API_ENDPOINTS.PROMO.HISTORY);
      return response.data.data;
    },
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rewardId: string) => {
      const response = await axiosClient.post<{ success: boolean; data: Voucher }>(API_ENDPOINTS.PROMO.REDEEM(rewardId));
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardsSummary'] });
      queryClient.invalidateQueries({ queryKey: ['rewardHistory'] });
      queryClient.invalidateQueries({ queryKey: ['homeSummary'] });
    },
  });
};
