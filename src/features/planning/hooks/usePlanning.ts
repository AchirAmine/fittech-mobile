import { useQuery } from '@tanstack/react-query';
import { planningApi } from '../api/planningApi';

/**
 * Hook to fetch sessions for a specific date and category.
 */
export const usePlanningSessions = (date: Date, category: string = 'all') => {
  return useQuery({
    queryKey: ['sessions', date.toDateString(), category],
    queryFn: () => planningApi.getSessions(date, category),
    staleTime: 5 * 60 * 1000,
  });
};
