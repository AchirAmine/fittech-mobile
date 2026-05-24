import { useInfiniteQuery } from '@tanstack/react-query';
import { activityService } from '../services/activityService';
import { ActivityResponse } from '../types/activity.types';

export const useActivityHistory = (type: string = 'all') => {
  return useInfiniteQuery<ActivityResponse, Error>({
    queryKey: ['activityHistory', type],
    queryFn: ({ pageParam = 1 }) =>
      activityService.getMemberActivities({ type, page: pageParam as number, limit: 15 }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
