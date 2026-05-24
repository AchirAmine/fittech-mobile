import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';

export const settingsKeys = {
  all: ['settings'] as const,
  notificationPreferences: () => [...settingsKeys.all, 'notificationPreferences'] as const,
  privacySettings: () => [...settingsKeys.all, 'privacySettings'] as const,
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: settingsService.changePassword,
  });
};

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: settingsKeys.notificationPreferences(),
    queryFn: settingsService.getNotificationPreferences,
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.notificationPreferences() });
    },
  });
};

export const usePrivacySettings = () => {
  return useQuery({
    queryKey: settingsKeys.privacySettings(),
    queryFn: settingsService.getPrivacySettings,
  });
};

export const useUpdatePrivacySettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updatePrivacySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.privacySettings() });
    },
  });
};
