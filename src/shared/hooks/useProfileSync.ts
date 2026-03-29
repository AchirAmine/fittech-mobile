import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useReduxHooks';
import { accountService } from '@features/account/services/accountService';
import { updateUser } from '@features/auth/store/authSlice';

export const useProfileSync = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const syncProfile = async () => {
      if (isAuthenticated && user && !user.gender) {
        try {
          const fullProfile = await accountService.getMe();
          dispatch(updateUser(fullProfile));
        } catch (error) {
        }
      }
    };

    syncProfile();
  }, [isAuthenticated, user, dispatch]);
};
