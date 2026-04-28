import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkInService, CheckInRequest } from '../services/checkInService';





export const useScanDoor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckInRequest) => checkInService.scanDoor(data),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['homeSummary'] });
    },
  });
};





export const useScanCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qrToken: string) => checkInService.scanCoach(qrToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeSummary'] });
    },
  });
};





type StatusType = 'success' | 'error';

interface StatusState {
  visible: boolean;
  type: StatusType;
  title: string;
  message: string;
}

const INITIAL_STATUS: StatusState = {
  visible: false,
  type: 'success',
  title: '',
  message: '',
};

export const useCheckInStatus = () => {
  const [status, setStatus] = useState<StatusState>(INITIAL_STATUS);

  const showSuccess = useCallback((title: string, message: string) => {
    setStatus({ visible: true, type: 'success', title, message });
  }, []);

  const showError = useCallback((title: string, message: string) => {
    setStatus({ visible: true, type: 'error', title, message });
  }, []);

  const hideStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, visible: false }));
  }, []);

  return { status, showSuccess, showError, hideStatus };
};





interface ConfirmationSheetState {
  visible: boolean;
  type: 'FREE' | 'COURSE';
}

export const useConfirmationSheet = () => {
  const [confirmationSheet, setConfirmationSheet] = useState<ConfirmationSheetState>({
    visible: false,
    type: 'FREE',
  });

  const openSheet = useCallback((type: 'FREE' | 'COURSE') => {
    setConfirmationSheet({ visible: true, type });
  }, []);

  const closeSheet = useCallback(() => {
    setConfirmationSheet((prev) => ({ ...prev, visible: false }));
  }, []);

  return { confirmationSheet, openSheet, closeSheet };
};
