import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suspensionApi, SuspensionRequest } from '../services/suspensionApi';

export const useSuspensionPolicy = () => {
  return useQuery({
    queryKey: ['suspensionPolicy'],
    queryFn: () => suspensionApi.getSuspensionPolicy(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useSuspensionRequests = (subscriptionId: string) => {
  return useQuery({
    queryKey: ['suspensionRequests', subscriptionId],
    queryFn: () => suspensionApi.getRequests(subscriptionId),
  });
};

export const useCreateSuspensionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscriptionId, formData }: { subscriptionId: string; formData: FormData }) =>
      suspensionApi.createRequest(subscriptionId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suspensionRequests', variables.subscriptionId] });
    },
  });
};

export const useCancelSuspensionRequest = (subscriptionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => suspensionApi.cancelRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suspensionRequests', subscriptionId] });
    },
  });
};

export const useSuspensionRequestDetail = (requestId: string) => {
  return useQuery({
    queryKey: ['suspensionRequest', requestId],
    queryFn: () => suspensionApi.getRequestDetail(requestId),
    enabled: !!requestId,
  });
};

export const useDirectSuspensions = (subscriptionId: string) => {
  return useQuery({
    queryKey: ['directSuspensions', subscriptionId],
    queryFn: () => suspensionApi.getDirectSuspensions(subscriptionId),
  });
};

export const useCreateDirectSuspension = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscriptionId, payload }: { subscriptionId: string; payload: { date_debut: string; date_fin: string } }) =>
      suspensionApi.createDirectSuspension(subscriptionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['directSuspensions', variables.subscriptionId] });
      queryClient.invalidateQueries({ queryKey: ['homeSummary'] });
    },
  });
};

export const useResumeDirectSuspension = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionId: string) => suspensionApi.resumeDirectSuspension(subscriptionId),
    onSuccess: (_, subscriptionId) => {
      queryClient.invalidateQueries({ queryKey: ['directSuspensions', subscriptionId] });
      queryClient.invalidateQueries({ queryKey: ['homeSummary'] });
    },
  });
};
