import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '@appTypes/api.types';

// Minimal interface describing the shape we need from the Redux store
interface StoreShape {
  getState(): {
    auth: {
      token: string | null;
      refreshToken: string | null;
    };
  };
  dispatch(action: unknown): unknown;
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let store: StoreShape | null = null;

export const injectStore = (_store: StoreShape): void => {
  store = _store;
};

interface ApiErrorResponseData {
  message?: string;
  field?: string | null;
}

/**
 * Handle API Errors consistently (network, timeout, 4xx, 5xx)
 */
export const handleApiError = (error: AxiosError<ApiErrorResponseData>): ApiError => {
  const formattedError: ApiError = {
    message: 'An unexpected error occurred',
    code: 500,
    field: null,
  };

  if (error.response) {
    formattedError.message = error.response.data?.message || formattedError.message;
    formattedError.code = error.response.status;
    formattedError.field = error.response.data?.field || null;
    formattedError.errors = (error.response.data as { errors?: Record<string, string[]> })?.errors;
  } else if (error.request) {
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      formattedError.message = 'Request timed out. Please try again.';
      formattedError.code = 408;
    } else {
      formattedError.message = 'No connection. Please check your internet and try again.';
      formattedError.code = 0;
    }
  } else if (error.message) {
    formattedError.message = error.message;
  }

  return formattedError;
};

// Request interceptor: attach token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (store) {
      const state = store.getState();
      const token = state.auth.token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError<ApiErrorResponseData>) => Promise.reject(handleApiError(error))
);

// Response interceptor: handle 401 and token refresh
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponseData>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && store) {
      originalRequest._retry = true;
      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          const refreshResponse = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken, user } = refreshResponse.data as {
            token: string;
            refreshToken: string;
            user: unknown;
          };

          store.dispatch({
            type: 'auth/setCredentials',
            payload: { token, refreshToken: newRefreshToken, user },
          });

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosClient(originalRequest);
        }
      } catch (refreshError: unknown) {
        store.dispatch({ type: 'auth/logout' });
        return Promise.reject(refreshError instanceof Error
          ? { message: refreshError.message, code: 0, field: null }
          : { message: 'Token refresh failed', code: 0, field: null }
        );
      }
    }

    return Promise.reject(handleApiError(error));
  }
);

export default axiosClient;
