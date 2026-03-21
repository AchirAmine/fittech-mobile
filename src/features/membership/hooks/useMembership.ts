import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipService } from '../services/membershipService';
import { Offer, Subscription } from '@appTypes/index';
import { enrichSubscriptions } from '../utils/subscriptionUtils';

export const membershipKeys = {
  all: ['membership'] as const,
  offers: () => [...membershipKeys.all, 'offers'] as const,
  mySubscriptions: () => [...membershipKeys.all, 'my-subscriptions'] as const,
};

export const useGetOffers = () => {
  return useQuery({
    queryKey: membershipKeys.offers(),
    queryFn: membershipService.getOffers,
  });
};

export const useGetMySubscriptions = () => {
  return useQuery({
    queryKey: membershipKeys.mySubscriptions(),
    queryFn: membershipService.getMySubscriptions,
    select: (subscriptions: Subscription[]) =>
      enrichSubscriptions(subscriptions),
  });
};

export const useSubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ offerId, paymentMethod }: { offerId: string; paymentMethod: 'ONLINE' | 'AT_CLUB' }) =>
      membershipService.subscribe(offerId, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membershipKeys.mySubscriptions() });
    },
  });
};
