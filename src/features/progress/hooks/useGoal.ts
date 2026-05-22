import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goalService } from '../services/progressService';
import { CreateGoalPayload, UpdateGoalPayload } from '../types/progress.types';

export const GOAL_KEYS = {
  all: ['goal'] as const,
  current: () => ['goal', 'current'] as const,
};

export const useCurrentGoal = () => {
  return useQuery({
    queryKey: GOAL_KEYS.current(),
    queryFn: () => goalService.getCurrentGoal(),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.code === 404) return false;
      return failureCount < 2;
    },
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => goalService.createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.all });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, payload }: { goalId: string; payload: UpdateGoalPayload }) =>
      goalService.updateGoal(goalId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.all });
    },
  });
};

export const useUpdateGoalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, status }: { goalId: string; status: 'COMPLETED' | 'CANCELLED' }) =>
      goalService.updateGoalStatus(goalId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.all });
    },
  });
};
