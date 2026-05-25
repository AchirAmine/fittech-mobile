import { useQuery } from '@tanstack/react-query';
import { getHomeSummary } from '../services/homeService';
export const useHomeSummary = () => {
  return useQuery({
    queryKey: ['homeSummary'],
    queryFn: getHomeSummary,
    refetchInterval: (query) => {
      if (query.state.data?.personalCoaching?.state === 'INVITATION_PENDING') {
        return 3000;
      }
      return false;
    },
  });
};
