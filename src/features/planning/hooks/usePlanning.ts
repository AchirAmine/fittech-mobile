import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { planningService } from '../services/planningService';
import { useAppSelector } from '@shared/hooks/useReduxHooks';

/** Stable ISO-based date key: uses local date parts so it matches what we send to the backend. */
const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const usePlanningSessions = (date: Date, category: string = 'all') => {
  const user = useAppSelector((state) => state.auth.user);
  const gender = user?.gender;
  return useQuery({
    queryKey: ['sessions', toDateKey(date), category, gender],
    queryFn: () => planningService.getSessions(date, category, gender),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => planningService.enrollInCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useCancelEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => planningService.cancelEnrollment(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useJoinWaitlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => planningService.joinWaitlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};
