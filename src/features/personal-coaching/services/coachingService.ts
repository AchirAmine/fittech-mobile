import { MOCK_COACHES } from '../constants/mockData';

const DELAY = 1200;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const coachingService = {
  getCoaches: async () => {
    await delay(DELAY);
    return MOCK_COACHES;
  },

  getCoachById: async (id: string) => {
    await delay(DELAY);
    const coach = MOCK_COACHES.find((c) => c.id === id);
    return coach || null;
  },

  getActiveCoaching: async () => {
    await delay(DELAY);
    const marcus = MOCK_COACHES.find(c => c.id === '1');
    if (!marcus) return null;
    
    return {
      id: 'active-session-1',
      coach: marcus,
      planTitle: 'Strength Training Plan',
      startDate: new Date().toISOString(),
      sessions: [
        { id: 's1', day: 'Monday', time: '09:00 - 10:00', type: 'strength' },
        { id: 's2', day: 'Wednesday', time: '14:00 - 15:00', type: 'strength' },
      ]
    };
  },

  hireCoach: async (coachId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Request sent successfully' });
      }, DELAY);
    });
  },
};
