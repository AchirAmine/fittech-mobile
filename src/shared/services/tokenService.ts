import * as SecureStore from 'expo-secure-store';
import logger from '@shared/utils/logger';
const TOKEN_KEY = 'fittech_access_token';
const REFRESH_TOKEN_KEY = 'fittech_refresh_token';
export const tokenService = {
  saveToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      logger.error('tokenService: Failed to save access token', error);
    }
  },
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      logger.error('tokenService: Failed to get access token', error);
      return null;
    }
  },
  removeToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      logger.error('tokenService: Failed to remove access token', error);
    }
  },
  saveRefreshToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      logger.error('tokenService: Failed to save refresh token', error);
    }
  },
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      logger.error('tokenService: Failed to get refresh token', error);
      return null;
    }
  },
  removeRefreshToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      logger.error('tokenService: Failed to remove refresh token', error);
    }
  },
  clearAll: async (): Promise<void> => {
    await tokenService.removeToken();
    await tokenService.removeRefreshToken();
  },
};
