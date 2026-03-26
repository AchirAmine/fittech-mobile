import { coursesApi } from '../../courses/api/coursesApi';
import { MOCK_SESSIONS, Session } from '../data/planningMockData';

export const planningApi = {
  /**
   * Fetches sessions for a specific day and category.
   * Combines classes (Courses) and open gym sessions.
   */
  async getSessions(date: Date, category: string = 'all'): Promise<Session[]> {
    console.log('[API] Fetching planning sessions...', { 
      day: date.toLocaleDateString('en-US', { weekday: 'short' }), 
      category 
    });
    
    // 1. Get all courses (simulated backend call)
    // We fetch 'All' and filter here to simulate complex backend aggregation
    const allCourses = await coursesApi.getCourses('All');
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const coursesForDay = allCourses.filter(c => c.days.includes(dayName));

    // 2. Filter by category if needed
    let filteredCourses = coursesForDay;
    if (category !== 'all') {
      filteredCourses = filteredCourses.filter(
        c => c.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 3. Map courses to the Session format used by the Planning UI
    const courseSessions: Session[] = filteredCourses.map(course => ({
      id: course.id,
      time: course.startTime.split(' ')[0], // "12:00" from "12:00 PM"
      title: course.title,
      type: 'class' as const,
      duration: `${course.duration} min`,
      zone: course.location,
      coach: course.coach.name,
      coachAvatar: course.coach.avatar,
      enrolled: course.enrolled,
      capacity: course.maxSlots,
      statusBadge: course.status,
    }));

    // 4. Merge with Open Gym sessions (only for 'all' or 'gym' categories)
    let finalSessions = [...courseSessions];
    
    if (category === 'all' || category === 'gym') {
      const openGymSessions = MOCK_SESSIONS.filter(s => s.type === 'open');
      finalSessions = [...finalSessions, ...openGymSessions];
    }

    return finalSessions;
  }
};
