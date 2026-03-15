import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/store';

/**
 * Custom hooks for typed Redux usage.
 * Use these throughout the app instead of plain useDispatch and useSelector.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useAuth = () => {
  const { user, token, isAuthenticated, status, error } = useAppSelector((state) => state.auth);
  const loading = status === 'loading';
  
  return { 
    user, 
    token, 
    isAuthenticated, 
    loading, 
    status,
    error 
  };
};
