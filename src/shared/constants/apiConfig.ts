/**
 * API Configuration - Backend integration
 * Set EXPO_PUBLIC_API_URL in .env (e.g. https://api.yourapp.com/api/v1)
 */
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
} as const;
