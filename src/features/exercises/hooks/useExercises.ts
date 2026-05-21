import { useQuery } from '@tanstack/react-query';
import { exerciseService, Exercise } from '../services/exerciseService';

export const useExercisesQuery = (params: {
  bodyParts?: string;
  limit?: number;
  after?: string;
  before?: string;
}) => {
  return useQuery({
    queryKey: ['exercises', params],
    queryFn: () => exerciseService.getExercises(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchExercisesQuery = (search: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['exercisesSearch', search],
    queryFn: () => exerciseService.searchExercises(search),
    enabled: enabled && search.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useExerciseDetailQuery = (exerciseId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ['exerciseDetail', exerciseId],
    queryFn: () => {
      if (!exerciseId) throw new Error('No exercise ID provided');
      return exerciseService.getExerciseById(exerciseId);
    },
    enabled: enabled && !!exerciseId,
    staleTime: 10 * 60 * 1000,
  });
};
