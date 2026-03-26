import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';

/**
 * Hook to fetch courses with an optional category filter.
 */
export const useCourses = (category?: string) => {
  return useQuery({
    queryKey: ['courses', category],
    queryFn: () => coursesApi.getCourses(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single course by its ID.
 */
export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to reserve a course.
 */
export const useReserveCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.reserveCourse(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

/**
 * Hook to cancel a reservation.
 */
export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.cancelReservation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

/**
 * Hook to join a waiting list.
 */
export const useJoinWaitingList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.joinWaitingList(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};
