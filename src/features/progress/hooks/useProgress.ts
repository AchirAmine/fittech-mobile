import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { progressService } from '../services/progressService';
import { CreateProgressPayload, UpdateProgressPayload } from '../types/progress.types';

export const PROGRESS_KEYS = {
  all: ['progress'] as const,
  list: (params?: object) => ['progress', 'list', params] as const,
  latest: () => ['progress', 'latest'] as const,
  feedback: (id: string) => ['progress', 'feedback', id] as const,
};

export const useLatestProgress = () => {
  return useQuery({
    queryKey: PROGRESS_KEYS.latest(),
    queryFn: () => progressService.getLatestProgress(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProgressList = (params: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
} = {}) => {
  return useQuery({
    queryKey: PROGRESS_KEYS.list(params),
    queryFn: () => progressService.getProgressList(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useProgressFeedback = (progressId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: PROGRESS_KEYS.feedback(progressId),
    queryFn: () => progressService.getProgressFeedback(progressId),
    enabled: enabled && !!progressId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProgressPayload) => progressService.createProgress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.all });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ progressId, payload }: { progressId: string; payload: UpdateProgressPayload }) =>
      progressService.updateProgress(progressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.all });
    },
  });
};

export const useDeleteProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (progressId: string) => progressService.deleteProgress(progressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.all });
    },
  });
};
