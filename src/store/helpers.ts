import { getErrorMessage } from '@shared/constants/errorMessages';

export interface RequestState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const initialRequestState: RequestState = {
  status: 'idle',
  error: null,
};

export const handlePending = (state: RequestState): void => {
  state.status = 'loading';
  state.error = null;
};

export const handleFulfilled = (state: RequestState): void => {
  state.status = 'succeeded';
  state.error = null;
};

export const handleRejected = (
  state: RequestState,
  action: { payload?: unknown; error: { message?: string } }
): void => {
  state.status = 'failed';
  const payload = action.payload as { message?: string; code?: number } | null | undefined;
  state.error = getErrorMessage(payload ?? { message: action.error?.message });
};
