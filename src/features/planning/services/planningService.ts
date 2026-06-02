import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { Session } from '@appTypes/planning';

type SportKey = 'GYM_MEN' | 'GYM_WOMEN' | 'POOL';

type PlanningSlot = {
  id: string;
  sport: SportKey;
  slotType: 'OPEN_SESSION' | 'COURSE_SLOT';
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  gender?: string | null;
};

type BackendCourse = {
  id: string;
  date: string;
  title: string;
  gymZone?: string | null;
  enrolledCount?: number;
  maxCapacity?: number;
  isFull?: boolean;
  isReservedByMember?: boolean;
  isWaitlistedByMember?: boolean;
  coach?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    profilePicture?: string;
  };
  planningSlot?: {
    sport: SportKey;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
};

const getBackendDayOfWeek = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
};

const isSameCalendarDate = (left: Date, right: Date) => {
  return left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();
};

const isCourseForSelectedDate = (course: any, selectedDate: Date) => {
  if (!course?.date) return true;

  const courseDate = new Date(course.date);
  if (Number.isNaN(courseDate.getTime())) return false;

  return isSameCalendarDate(courseDate, selectedDate);
};

const normalizeGender = (gender?: string) => {
  const normalized = gender?.trim().toLowerCase();
  if (normalized === 'female' || normalized === 'woman' || normalized === 'women') return 'female';
  return 'male';
};

const getGymSport = (gender?: string): SportKey => {
  return normalizeGender(gender) === 'female' ? 'GYM_WOMEN' : 'GYM_MEN';
};

const getPoolGender = (gender?: string) => {
  return normalizeGender(gender) === 'female' ? 'WOMEN' : 'MEN';
};

const getSportsForCategory = (category: string, gender?: string): SportKey[] => {
  if (category === 'gym') return [getGymSport(gender)];
  if (category === 'swimming') return ['POOL'];
  return [getGymSport(gender), 'POOL'];
};

const getVisibleOpenSlots = (
  planning: Record<SportKey, Record<string, PlanningSlot[]>>,
  sports: SportKey[],
  dayOfWeek: string,
  gender?: string,
) => {
  const poolGender = getPoolGender(gender);

  return sports.flatMap((sport) =>
    (planning?.[sport]?.[dayOfWeek] ?? []).filter((slot) =>
      slot.slotType === 'OPEN_SESSION' &&
      (sport !== 'POOL' || !slot.gender || slot.gender === poolGender)
    )
  );
};

const mapOpenSlotsToSessions = (slots: PlanningSlot[]): Session[] => {
  return slots.map((slot) => ({
    id: slot.id,
    time: slot.startTime,
    title: 'Open Session',
    type: 'open',
    duration: `Until ${slot.endTime}`,
    subtitle: 'No reservation needed.',
  }));
};

const mapCoursesToSessions = (courses: BackendCourse[], selectedDate: Date): Session[] => {
  return courses
    .filter((course) => isCourseForSelectedDate(course, selectedDate))
    .filter((course) => !!course.planningSlot)
    .map((course) => {
      const slot = course.planningSlot!;
      const [startH, startM] = slot.startTime.split(':').map(Number);
      const [endH, endM] = slot.endTime.split(':').map(Number);
      const durationMin = (endH * 60 + endM) - (startH * 60 + startM);
      const coachName = course.coach?.fullName ||
        `${course.coach?.firstName || ''} ${course.coach?.lastName || ''}`.trim();

      return {
        id: course.id,
        time: slot.startTime,
        title: course.title,
        type: 'class',
        duration: `${durationMin} min`,
        zone: course.gymZone || 'Main Zone',
        coach: coachName || 'Coach',
        coachAvatar: course.coach?.profilePicture,
        enrolled: course.enrolledCount,
        capacity: course.maxCapacity,
        statusBadge: course.isReservedByMember ? 'RESERVED' : (course.isWaitlistedByMember ? 'WAITLISTED' : (course.isFull ? 'FULL' : undefined)),
      } as Session;
    });
};

const fetchCoursesForSports = async (sports: SportKey[], dayOfWeek: string) => {
  const results = await Promise.all(
    sports.map((sport) =>
      axiosClient.get(API_ENDPOINTS.COURSES.LIST, {
        params: { sport, dayOfWeek },
      })
    )
  );

  return results.flatMap((response) => response.data.data || []) as BackendCourse[];
};

export const planningService = {
  async getSessions(date: Date, category: string = 'all', gender?: string): Promise<Session[]> {
    const dayOfWeek = getBackendDayOfWeek(date);
    const sportsToFetch = getSportsForCategory(category, gender);

    try {
      const [planningResponse, courses] = await Promise.all([
        axiosClient.get(API_ENDPOINTS.PLANNING.ALL),
        fetchCoursesForSports(sportsToFetch, dayOfWeek),
      ]);

      const openSlots = getVisibleOpenSlots(
        planningResponse.data.data,
        sportsToFetch,
        dayOfWeek,
        gender,
      );

      return [
        ...mapOpenSlotsToSessions(openSlots),
        ...mapCoursesToSessions(courses, date),
      ].sort((a, b) => a.time.localeCompare(b.time));
    } catch (error) {
      console.error('Error in getSessions:', error);
      throw error;
    }
  }
};
