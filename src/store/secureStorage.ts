import * as SecureStore from 'expo-secure-store';
import { Storage } from 'redux-persist';
import logger from '@shared/utils/logger';

const sanitizeKey = (key: string): string => (typeof key === 'string' ? key.replace(/[^a-zA-Z0-9.\-_]/g, '_') : '');

const secureStorage: Storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const sanitizedKey = sanitizeKey(key);
      const value = await SecureStore.getItemAsync(sanitizedKey);
      return value;
    } catch (error) {
      logger.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const sanitizedKey = sanitizeKey(key);
      await SecureStore.setItemAsync(sanitizedKey, value);
    } catch (error) {
      logger.error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      const sanitizedKey = sanitizeKey(key);
      await SecureStore.deleteItemAsync(sanitizedKey);
    } catch (error) {
      logger.error('SecureStore removeItem error:', error);
    }
  },
};

export default secureStorage;
