import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { Session } from '@appTypes/planning';
const getBackendDayOfWeek = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
};
const mapBackendSlotsToSessions = (slots: any[]): Session[] => {
  const sessions: Session[] = [];
  slots.forEach((slot) => {
    if (slot.slotType === 'OPEN_SESSION') {
      sessions.push({
        id: slot.id,
        time: slot.startTime,
        title: 'Open Session',
        type: 'open',
        duration: `Until ${slot.endTime}`,
        subtitle: slot.note || 'No reservation needed.',
      });
    } else if (slot.slotType === 'COURSE_SLOT' && slot.courses) {
      slot.courses.forEach((course: any) => {
        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);
        const durationMin = (endH * 60 + endM) - (startH * 60 + startM);
        sessions.push({
          id: course.id,
          time: slot.startTime,
          title: course.title,
          type: 'class',
          duration: `${durationMin} min`,
          zone: course.gymZone || 'Main Zone',
          coach: course.coach.fullName,
          coachAvatar: course.coach.profilePicture,
          enrolled: course.enrolledCount,
          capacity: course.maxCapacity,
          statusBadge: course.isReservedByMember ? 'RESERVED' : (course.isWaitlistedByMember ? 'WAITLISTED' : (course.isFull ? 'FULL' : undefined)),
        });
      });
    }
  });
  return sessions.sort((a, b) => a.time.localeCompare(b.time));
};
export const planningService = {
  async getSessions(date: Date, category: string = 'all', gender?: string): Promise<Session[]> {
    const dayOfWeek = getBackendDayOfWeek(date);
    const getBackendSport = (cat: string, g?: string) => {
      if (cat === 'pool') return 'POOL';
      if (cat === 'gym') {
        const normalizedGender = g?.trim().toLowerCase();
        const isFemale = normalizedGender === 'female' || normalizedGender === 'woman' || normalizedGender === 'women';
        return isFemale ? 'GYM_WOMEN' : 'GYM_MEN';
      }
      return cat.toUpperCase();
    };
    const sportsToFetch: string[] = [];
    if (category === 'all') {
      sportsToFetch.push(getBackendSport('gym', gender), 'POOL');
    } else if (category === 'gym') {
      sportsToFetch.push(getBackendSport('gym', gender));
    } else if (category === 'swimming') {
      sportsToFetch.push('POOL');
    }
    try {
      const results = await Promise.all(
        sportsToFetch.map(sport => 
          axiosClient.get(API_ENDPOINTS.COURSES.MEMBER_PLANNING(sport, dayOfWeek))
            .catch(err => {
              console.error(`Error fetching planning for ${sport}:`, err);
              return { data: { data: [] } };
            })
        )
      );
      const allSlots = results.flatMap(res => res.data.data || []);
      return mapBackendSlotsToSessions(allSlots);
    } catch (error) {
      console.error('Error in getSessions:', error);
      throw error;
    }
  }
};
