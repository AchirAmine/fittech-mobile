import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService';
import { User } from '@appTypes/index';
export const accountKeys = {
  all: ['account'] as const,
  me: () => [...accountKeys.all, 'me'] as const,
};
export const useGetAccount = () => {
  return useQuery({
    queryKey: accountKeys.me(),
    queryFn: accountService.getMe,
    select: (data): User => ({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      phone: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      height: data.height,
      weight: data.weight,
      fitnessObjective: data.fitnessObjective,
      medicalRestrictions: data.medicalRestrictions,
      profilePicture: data.profilePicture 
        ? { uri: data.profilePicture.startsWith('http') 
            ? data.profilePicture 
            : `${process.env.EXPO_PUBLIC_API_URL?.split('/api')[0]}/${data.profilePicture}` 
          } 
        : undefined,
      absenceWarnings: 0,
    }),
  });
};
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      return accountService.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.me() });
    },
  });
};
