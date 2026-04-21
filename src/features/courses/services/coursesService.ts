import axiosClient from '@shared/services/axiosClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { Course } from '@appTypes/course';
const mapBackendCourseToFrontend = (backendCourse: any): Course | null => {
  if (!backendCourse) {
    console.warn('mapBackendCourseToFrontend received null/undefined course');
    return null;
  }
  if (!backendCourse.planningSlot) {
    console.error(`Course ${backendCourse.id || 'unknown'} is missing planningSlot info`, backendCourse);
    return null;
  }
  try {
    const date = new Date(backendCourse.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getUTCDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const [startH, startM] = backendCourse.planningSlot.startTime.split(':').map(Number);
    const [endH, endM] = backendCourse.planningSlot.endTime.split(':').map(Number);
    const duration = (endH * 60 + endM) - (startH * 60 + startM);
    const time = new Date();
    time.setHours(startH, startM);
    const startTimeStr = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    let category: any = 'Gym';
    const sport = backendCourse.planningSlot.sport;
    if (sport === 'POOL') category = 'Swimming';
    else category = 'Gym';
    let status: any = 'OPEN';
    if (backendCourse.isReservedByMember) status = 'RESERVED';
    else if (backendCourse.isWaitlistedByMember) status = 'WAITLISTED';
    else if (backendCourse.status === 'FULL') status = 'FULL';
    return {
      id: backendCourse.id,
      title: backendCourse.title,
      category,
      days: `${dayName} ${dayNum} ${monthName}`,
      startTime: startTimeStr,
      duration,
      coach: {
        name: `Coach ${backendCourse.coach?.firstName || ''} ${backendCourse.coach?.lastName || ''}`,
        avatar: backendCourse.coach?.profilePicture,
      },
      location: backendCourse.planningSlot.sport === 'POOL' ? 'POOL' : (backendCourse.gymZone || 'MAIN ZONE'),
      status,
      enrolled: backendCourse.enrolledCount,
      maxSlots: backendCourse.maxCapacity,
      description: backendCourse.description || '',
      color: backendCourse.planningSlot.sport === 'POOL' ? '#00BFA5' : '#3D5AFE',
      canCancel: status === 'RESERVED', 
    };
  } catch (error) {
    console.error('Error mapping course:', error, backendCourse);
    return null;
  }
};
export const coursesService = {
  async getCourses(category?: string, gender?: string): Promise<Course[]> {
    const params: any = {};
    if (category === 'Gym') {
      const normalizedGender = gender?.trim().toLowerCase();
      const isFemale = normalizedGender === 'female' || normalizedGender === 'woman' || normalizedGender === 'women';
      params.sport = isFemale ? 'GYM_WOMEN' : 'GYM_MEN';
    } else if (category === 'Swimming') {
      params.sport = 'POOL';
    }
    const endpoint = category === 'MyCourses' ? API_ENDPOINTS.COURSES.MY_RESERVATIONS : API_ENDPOINTS.COURSES.LIST;
    const response = await axiosClient.get(endpoint, { params });
    const data = response.data.data;
    if (category === 'MyCourses') {
      return data
        .map((item: any) => {
          return mapBackendCourseToFrontend({
            ...item.course,
            isReservedByMember: true
          });
        })
        .filter((c: any): c is Course => c !== null);
    }
    return data
      .map(mapBackendCourseToFrontend)
      .filter((c: any): c is Course => c !== null);
  },
  async getCourseById(id: string): Promise<Course | undefined> {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.DETAIL(id));
    return mapBackendCourseToFrontend(response.data.data) ?? undefined;
  },
  async reserveCourse(id: string): Promise<void> {
    await axiosClient.post(API_ENDPOINTS.COURSES.ENROLL(id));
  },
  async cancelReservation(id: string): Promise<void> {
    await axiosClient.delete(API_ENDPOINTS.COURSES.ENROLL(id));
  },
  async joinWaitingList(id: string): Promise<void> {
    await axiosClient.post(API_ENDPOINTS.COURSES.WAITLIST(id));
  }
};
