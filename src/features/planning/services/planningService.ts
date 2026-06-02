import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { Session } from '@appTypes/planning';

/**
 * Derives the DayOfWeek enum value (e.g. "MONDAY") from a local date object.
 * We build the YYYY-MM-DD string first (local date parts), then determine the
 * UTC day from that date string so it matches what the backend parses from the
 * same date string (backend does new Date(`${dateStr}T00:00:00.000Z`).getUTCDay()).
 */
const getBackendDayOfWeek = (date: Date): string => {
  const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  // Use local date parts so the date string matches what we send to the backend
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // Parse the same YYYY-MM-DD string as UTC to get the same day-of-week as the backend
  const utcDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  return DAY_NAMES[utcDate.getUTCDay()];
};

const mapBackendSlotsToSessions = (slots: any[]): Session[] => {
  const sessions: Session[] = [];
  slots.forEach((slot) => {
    if (slot.slotType === 'OPEN_SESSION') {
      sessions.push({
        id: slot.id,
        slotId: slot.id,
        time: slot.startTime,
        endTime: slot.endTime,
        title: 'Open Session',
        type: 'open',
        duration: slot.endTime,   // raw endTime; SessionItem displays it as "Closes at HH:MM"
        subtitle: slot.note || 'No reservation needed.',
      });
    } else if (slot.slotType === 'COURSE_SLOT' && slot.courses) {
      slot.courses.forEach((course: any) => {
        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);
        const durationMin = (endH * 60 + endM) - (startH * 60 + startM);

        // Extract the YYYY-MM-DD date string from the course's ISO date
        const courseDate: string | undefined = course.date
          ? (typeof course.date === 'string'
              ? course.date.slice(0, 10)
              : new Date(course.date).toISOString().slice(0, 10))
          : undefined;

        sessions.push({
          id: course.id,
          slotId: slot.id,
          time: slot.startTime,
          endTime: slot.endTime,
          date: courseDate,
          title: course.title,
          type: 'class',
          duration: `${durationMin} min`,
          zone: course.gymZone ?? null,
          coach: course.coach?.fullName,
          coachAvatar: course.coach?.profilePicture,
          enrolled: course.enrolledCount,
          capacity: course.maxCapacity,
          statusBadge: course.isReservedByMember
            ? 'RESERVED'
            : course.isWaitlistedByMember
              ? 'WAITLISTED'
              : course.isFull
                ? 'FULL'
                : undefined,
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
      if (cat === 'pool' || cat === 'swimming') return 'POOL';
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

    // Build the YYYY-MM-DD date string from local date parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    try {
      const results = await Promise.all(
        sportsToFetch.map(sport =>
          axiosClient.get(`${API_ENDPOINTS.COURSES.MEMBER_PLANNING(sport, dayOfWeek)}?date=${dateStr}`)
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
  },

  async enrollInCourse(courseId: string): Promise<void> {
    await axiosClient.post(API_ENDPOINTS.COURSES.ENROLL(courseId));
  },

  async cancelEnrollment(courseId: string): Promise<void> {
    await axiosClient.delete(API_ENDPOINTS.COURSES.ENROLL(courseId));
  },

  async joinWaitlist(courseId: string): Promise<void> {
    await axiosClient.post(API_ENDPOINTS.COURSES.WAITLIST(courseId));
  },
};
