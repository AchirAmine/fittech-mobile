import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coachingService } from '../services/coachingService';

export interface Coach {
  id: string;
  name: string;
  specialty: string;
  clientsCount: number;
  image: any;
  experience: string;
  price: number;
  about: string;
  invitation?: {
    id: string;
    status: string;
    createdAt: string;
  } | null;
}

export const coachingKeys = {
  all: ['coaching'] as const,
  lists: () => [...coachingKeys.all, 'list'] as const,
  details: () => [...coachingKeys.all, 'detail'] as const,
  detail: (id: string) => [... coachingKeys.details(), id] as const,
  active: () => [...coachingKeys.all, 'active'] as const,
  slots: () => [...coachingKeys.all, 'slots'] as const,
};

export const useGetCoaches = () => {
  return useQuery<Coach[]>({
    queryKey: coachingKeys.lists(),
    queryFn: coachingService.getCoaches as any,
    staleTime: 5 * 60 * 1000, 
  });
};

export const useGetCoach = (id: string) => {
  return useQuery<Coach | null>({
    queryKey: coachingKeys.detail(id),
    queryFn: () => coachingService.getCoachById(id) as any,
    enabled: !!id,
  });
};

export const useGetActiveCoaching = () => {
  return useQuery({
    queryKey: coachingKeys.active(),
    queryFn: () => coachingService.getActiveCoaching() as any,
  });
};

export const useGetCoachSlots = () => {
  return useQuery({
    queryKey: coachingKeys.slots(),
    queryFn: () => coachingService.getCoachesSlots() as any,
  });
};

export const useHireCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coachId: string) => coachingService.hireCoach(coachId),
    onSuccess: (data, coachId) => {
      queryClient.invalidateQueries({ queryKey: coachingKeys.detail(coachId) });
    },
  });
};

export const useBookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => coachingService.bookSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachingKeys.slots() });
      queryClient.invalidateQueries({ queryKey: coachingKeys.active() });
    },
  });
};

export const usePayCoaching = () => {
  return useMutation({
    mutationFn: (invitationId: string) => coachingService.payCoaching(invitationId),
  });
};
