import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.split('/api')[0] || '';

const mapCoach = (coach: any) => ({
  id: coach.coachId,
  name: coach.fullName,
  specialty: coach.speciality,
  clientsCount: coach.activeClientsCount,
  image: coach.profilePicture 
    ? { uri: coach.profilePicture.startsWith('http') ? coach.profilePicture : `${BASE_URL}/${coach.profilePicture}` }
    : require('@assets/images/coaches/coach-1.png'),
  experience: coach.experience || 'Professional',
  price: coach.pricing || 0,
  about: coach.description || 'Personal coach available for training.',
  invitation: coach.invitation || null,
});

export const coachingService = {
  getCoaches: async () => {
    const { data } = await axiosClient.get(API_ENDPOINTS.PERSONAL_COACHING.COACHES);
    return (data.data || []).map(mapCoach);
  },

  getCoachById: async (id: string) => {
    const { data } = await axiosClient.get(API_ENDPOINTS.PERSONAL_COACHING.COACH_DETAIL(id));
    return data.data ? mapCoach(data.data) : null;
  },

  getActiveCoaching: async () => {
    // This can still be used for detailed info if needed, but HomeScreen uses summary
    return null; 
  },

  hireCoach: async (coachId: string) => {
    const { data } = await axiosClient.post(API_ENDPOINTS.PERSONAL_COACHING.INVITE_COACH(coachId));
    return data;
  },
};
