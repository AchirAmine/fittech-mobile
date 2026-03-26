import { Course, COURSES_MOCK_DATA } from '../mocks/coursesMockData';

/**
 * Simulates a delay for API calls.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const coursesApi = {
  /**
   * Fetches all courses with an optional category filter.
   * Simulates a backend GET /courses request.
   */
  async getCourses(category?: string): Promise<Course[]> {
    console.log('[API] Fetching courses...', { category });
    await delay(800); // Simulate network latency
    
    if (!category || category === 'All') {
      return [...COURSES_MOCK_DATA];
    }
    
    if (category === 'MyCourses') {
      return COURSES_MOCK_DATA.filter(c => c.status === 'RESERVED');
    }
    
    return COURSES_MOCK_DATA.filter(c => c.category === category);
  },

  /**
   * Fetches a single course by ID.
   * Simulates a backend GET /courses/:id request.
   */
  async getCourseById(id: string): Promise<Course | undefined> {
    console.log('[API] Fetching course detail...', { id });
    await delay(500); // Faster lookup for single item
    return COURSES_MOCK_DATA.find(c => c.id === id);
  },

  /**
   * Simulates reserving a course.
   */
  async reserveCourse(id: string): Promise<void> {
    console.log('[API] Reserving course...', { id });
    await delay(1000);
  },

  /**
   * Simulates cancelling a reservation.
   */
  async cancelReservation(id: string): Promise<void> {
    console.log('[API] Cancelling reservation...', { id });
    await delay(1000);
  },

  /**
   * Simulates joining a waiting list.
   */
  async joinWaitingList(id: string): Promise<void> {
    console.log('[API] Joining waiting list...', { id });
    await delay(1000);
  }
};
