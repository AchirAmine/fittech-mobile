import { useState, useCallback } from 'react';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { ApiError } from '@appTypes/api.types';

export interface UseApiCallState {
  loading: boolean;
  error: string | null;
}

export interface UseApiCallReturn<T extends (...args: any[]) => Promise<any>> extends UseApiCallState {
  execute: T;
  clearError: () => void;
}

/**
 * Hook for consistent API call handling with loading and error state
 */
export function useApiCall<T extends (...args: any[]) => Promise<any>>(
  apiFn: T
): UseApiCallReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const execute = useCallback(
    (async (...args: Parameters<T>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn(...args);
        return result;
      } catch (err) {
        const apiErr = err as ApiError;
        const message = getErrorMessage({ message: apiErr?.message, code: apiErr?.code });
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    }) as T,
    [apiFn]
  );

  return { execute, loading, error, clearError };
}
