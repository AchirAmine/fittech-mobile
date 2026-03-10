/**
 * Centralized API error messages for consistent UX
 */
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

export const getErrorMessage = (error: any): string => {
  const msg = error?.message?.toLowerCase() || '';
  const code = error?.code ?? 0;
  const errors = error?.errors;

  // Handle detailed validation errors (flattened Zod errors)
  if (code === 400 && errors?.fieldErrors) {
    const fieldErrors = errors.fieldErrors;
    const firstField = Object.keys(fieldErrors)[0];
    if (firstField && fieldErrors[firstField]?.[0]) {
      return `${firstField}: ${fieldErrors[firstField][0]}`;
    }
  }

  if (code === 0 || msg.includes('network') || msg.includes('connection')) {
    return ERROR_MESSAGES.NETWORK;
  }
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return ERROR_MESSAGES.TIMEOUT;
  }
  if (code === 401) {
    if (msg.includes('credentials') || msg.includes('login') || msg.includes('invalid')) {
      return ERROR_MESSAGES.LOGIN_FAILED;
    }
    return ERROR_MESSAGES.UNAUTHORIZED;
  }
  if (code === 403) {
    if (msg.includes('pending') || msg.includes('approval')) {
      return error?.message || 'Your account is pending approval.';
    }
    return ERROR_MESSAGES.FORBIDDEN;
  }
  if (code === 404) return ERROR_MESSAGES.NOT_FOUND;
  if (code === 409) return error?.message || 'Conflict error occurred.';
  if (code >= 500) return ERROR_MESSAGES.SERVER;
  
  // If we have a custom message from the backend that isn't generic, use it
  if (error?.message && error.message !== 'Validation failed' && error.message !== 'Internal server error') {
    return error.message;
  }

  if (code === 400 || code === 422) return ERROR_MESSAGES.VALIDATION;

  return ERROR_MESSAGES.UNKNOWN;
};
