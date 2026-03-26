export const ERROR_MESSAGES = {
  NETWORK: 'No connection. Please check your internet and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  SERVER: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  FORBIDDEN: 'You do not have permission for this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  LOGIN_FAILED: 'Invalid email or password. Please try again.',
  UNKNOWN: 'Something went wrong. Please try again.',
} as const;

interface ApiError {
  message?: string;
  code?: number;
  errors?: Record<string, string[]>;
}

export const getErrorMessage = (error: unknown): string => {
  if (!error) return '';

  const err = error as ApiError;
  const msg = (err.message || '').toLowerCase();
  const code = err.code ?? 0;

  if (msg.includes('server unreachable')) return err.message || ERROR_MESSAGES.SERVER;
  if (msg.includes('session expired') || msg.includes('unauthorized')) return err.message || ERROR_MESSAGES.UNAUTHORIZED;

  switch (code) {
    case 401:
      if (msg.includes('credentials') || msg.includes('invalid')) return ERROR_MESSAGES.LOGIN_FAILED;
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return msg.includes('pending') ? (err.message || 'Account pending approval.') : ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 400:
    case 422:
      let fieldErrors = err.errors as any;
      
      if (fieldErrors && fieldErrors.fieldErrors) {
        fieldErrors = fieldErrors.fieldErrors;
      }
      
      if (fieldErrors && typeof fieldErrors === 'object') {
        const fields = Object.keys(fieldErrors);
        for (const field of fields) {
           const msgs = fieldErrors[field];
           if (Array.isArray(msgs) && msgs.length > 0) {
             return `${field}: ${msgs[0]}`;
           }
        }
      }
      return ERROR_MESSAGES.VALIDATION;
    case 409:
      return err.message || 'Conflict occurred.';
  }

  if (code === 408 || msg.includes('timeout')) {
    return ERROR_MESSAGES.TIMEOUT;
  }
  if (code === 0 || msg.includes('network error') || msg.includes('no connection')) {
    return ERROR_MESSAGES.NETWORK;
  }

  if (err.message && !msg.includes('validation failed') && !msg.includes('internal server error')) {
    return err.message;
  }

  if (code >= 500) return ERROR_MESSAGES.SERVER;

  return ERROR_MESSAGES.UNKNOWN;
};
