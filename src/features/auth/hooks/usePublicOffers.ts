import { useQuery } from '@tanstack/react-query';
import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
export interface PublicOfferSport {
  id: string;
  sportType: string;
  freeSessions: number;
  coachSessions: number;
}
export interface PublicOffer {
  id: string;
  title: string;
  duration: number;
  price: number;
  starsAwarded: number;
  picture: string | null;
  sports: PublicOfferSport[];
}
export const usePublicOffers = () => {
  return useQuery({
    queryKey: ['publicOffers'],
    queryFn: async () => {
      const response = await axiosClient.get<{ success: boolean; data: PublicOffer[] }>(API_ENDPOINTS.OFFERS.PUBLIC);
      return response.data.data;
    },
  });
};
