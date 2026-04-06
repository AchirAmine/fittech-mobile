import { useQuery } from '@tanstack/react-query';
import { getHomeSummary } from '../services/homeService';

export const useHomeSummary = () => {
  return useQuery({
    queryKey: ['homeSummary'],
    queryFn: getHomeSummary,
  });
};
