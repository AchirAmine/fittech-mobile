import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { getImageSource } from '@shared/utils/imageUtils';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.split('/api')[0] || '';

const mapCoach = (coach: any) => ({
  id: coach.coachId,
  name: coach.fullName,
  specialty: coach.speciality,
  clientsCount: coach.activeClientsCount,
  image: getImageSource(coach.profilePicture),
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
    const { data } = await axiosClient.get(API_ENDPOINTS.PERSONAL_COACHING.MY_COACH_SLOTS);
    
    if (!data.data || !data.data.coach) return null;

    const coach = data.data.coach;
    const slots = data.data.slots || [];

    const formatSessionDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    };

    return {
      coach: {
        id: coach.id,
        name: coach.fullName,
        image: getImageSource(coach.profilePicture),
      },
      sessions: slots
        .filter((slot: any) => slot.isBookedByMember)
        .map((slot: any) => ({
          id: slot.id,
          day: slot.date ? formatSessionDate(slot.date) : slot.day,
          time: `${slot.startTime} - ${slot.endTime}`,
        })),
    };
  },

  hireCoach: async (coachId: string) => {
    const { data } = await axiosClient.post(API_ENDPOINTS.PERSONAL_COACHING.INVITE_COACH(coachId));
    return data;
  },

  getCoachesSlots: async () => {
    const { data } = await axiosClient.get(API_ENDPOINTS.PERSONAL_COACHING.MY_COACH_SLOTS);
    return data.data?.slots || [];
  },

  bookSlot: async (slotId: string) => {
    const { data } = await axiosClient.post(API_ENDPOINTS.PERSONAL_COACHING.BOOK_SLOT(slotId));
    return data;
  },
  
  payCoaching: async (invitationId: string) => {
    const { data } = await axiosClient.post(API_ENDPOINTS.PERSONAL_COACHING.PAY_INVITATION(invitationId));
    return data.data;
  },
};
