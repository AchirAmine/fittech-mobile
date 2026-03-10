import * as SecureStore from 'expo-secure-store';
import logger from '@shared/utils/logger';

const TOKEN_KEY = 'fittech_access_token';
const REFRESH_TOKEN_KEY = 'fittech_refresh_token';

/**
 * Token Service
 *
 * Provides direct, ergonomic access to JWT tokens stored in SecureStore.
 * Use this for startup hydration or anywhere you need token access
 * outside of the Redux lifecycle.
 *
 * Note: The Redux store also persists tokens via redux-persist + SecureStore.
 * This service is a direct, thin wrapper for cases where you need synchronous
 * or pre-Redux token access.
 */
export const tokenService = {
  /**
   * Save the JWT access token to SecureStore.
   */
  saveToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      logger.error('tokenService: Failed to save access token', error);
    }
  },

  /**
   * Retrieve the JWT access token from SecureStore.
   * Returns `null` if no token is stored or on error.
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      logger.error('tokenService: Failed to get access token', error);
      return null;
    }
  },

  /**
   * Remove the JWT access token from SecureStore.
   */
  removeToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      logger.error('tokenService: Failed to remove access token', error);
    }
  },

  /**
   * Save the JWT refresh token to SecureStore.
   */
  saveRefreshToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      logger.error('tokenService: Failed to save refresh token', error);
    }
  },

  /**
   * Retrieve the JWT refresh token from SecureStore.
   * Returns `null` if no token is stored or on error.
   */
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      logger.error('tokenService: Failed to get refresh token', error);
      return null;
    }
  },

  /**
   * Remove the JWT refresh token from SecureStore.
   */
  removeRefreshToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      logger.error('tokenService: Failed to remove refresh token', error);
    }
  },

  /**
   * Clear both access and refresh tokens (use on logout).
   */
  clearAll: async (): Promise<void> => {
    await tokenService.removeToken();
    await tokenService.removeRefreshToken();
  },
};
