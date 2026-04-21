import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { Offer, Subscription } from '@appTypes/index';

export const membershipService = {
  getOffers: async (): Promise<Offer[]> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.OFFERS.LIST);
    return data.data;
  },

  getMySubscriptions: async (): Promise<Subscription[]> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.SUBSCRIPTIONS.ME);
    return data.data;
  },

  subscribe: async (offerId: string, paymentMethod: 'ONLINE' | 'AT_CLUB', promoCode?: string) => {
    const { data } = await axiosClient.post(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, {
      offerId,
      paymentMethod,
      promoCode,
    });
    return data.data;
  },
};
