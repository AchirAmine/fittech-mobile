import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@shared/hooks/useReduxHooks';
import { coursesService } from '../services/coursesService';

export const useCourses = (category?: string) => {
  const user = useAppSelector((state) => state.auth.user);
  const gender = user?.gender;

  return useQuery({
    queryKey: ['courses', category, gender],
    queryFn: () => coursesService.getCourses(category, gender),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesService.getCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReserveCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesService.reserveCourse(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesService.cancelReservation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useJoinWaitingList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesService.joinWaitingList(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};
