import axiosClient from '@shared/services/axiosClient';
import { Offer, Subscription } from '@appTypes/index';

export const membershipService = {
  getOffers: async (): Promise<Offer[]> => {
    const { data } = await axiosClient.get('/offers');
    return data.data;
  },

  getMySubscriptions: async (): Promise<Subscription[]> => {
    const { data } = await axiosClient.get('/subscriptions/me');
    return data.data;
  },

  subscribe: async (offerId: string, paymentMethod: 'ONLINE' | 'AT_CLUB') => {
    const { data } = await axiosClient.post('/subscriptions', {
      offerId,
      paymentMethod,
    });
    return data.data;
  },
};
