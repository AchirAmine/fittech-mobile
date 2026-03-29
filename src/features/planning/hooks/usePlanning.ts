import { useQuery } from '@tanstack/react-query';
import { planningService } from '../services/planningService';
import { useAppSelector } from '@shared/hooks/useReduxHooks';

export const usePlanningSessions = (date: Date, category: string = 'all') => {
  const user = useAppSelector((state) => state.auth.user);
  const gender = user?.gender;

  return useQuery({
    queryKey: ['sessions', date.toDateString(), category, gender],
    queryFn: () => planningService.getSessions(date, category, gender),
    staleTime: 5 * 60 * 1000,
  });
};
