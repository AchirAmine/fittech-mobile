import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '@appTypes/api.types';
interface StoreShape {
  getState(): {
    auth: {
      token: string | null;
    };
  };
  dispatch(action: unknown): unknown;
}
interface ApiErrorResponseData {
  message?: string;
  field?: string | null;
  errors?: Record<string, string[]>;
}
const AXIOS_TIMEOUT = 10000;
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: AXIOS_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
let store: StoreShape | null = null;
export const injectStore = (_store: StoreShape): void => {
  store = _store;
};
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
    formattedError.errors = error.response.data?.errors;
  } else if (error.request) {
    const errorMsg = error.message?.toLowerCase() || '';
    if (error.code === 'ECONNABORTED' || errorMsg.includes('timeout')) {
      formattedError.message = 'Request timed out. Please check your connection.';
      formattedError.code = 408;
    } else if (errorMsg.includes('network error')) {
      formattedError.message = 'Network error. Please check your internet connection.';
      formattedError.code = 0;
    } else {
      formattedError.message = `Server unreachable (${error.code || 'UNKNOWN'}).`;
      formattedError.code = 0;
    }
  } else {
    formattedError.message = error.message;
  }
  return formattedError;
};
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store?.getState().auth.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError<ApiErrorResponseData>) => Promise.reject(handleApiError(error))
);
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponseData>) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (error.response?.status === 401 && store && !isAuthRoute) {
      store.dispatch({ type: 'auth/logout' });
      return Promise.reject({
        message: 'Session expired. Please log in again.',
        code: 401,
        field: null,
      });
    }
    return Promise.reject(handleApiError(error));
  }
);
export default axiosClient;
