import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../api/client';

const MAX_RETRIES = 3;

function shouldRetry(failureCount: number, error: Error): boolean {
  const isClientError =
    error instanceof ApiError && error.status >= 400 && error.status < 500;
  if (isClientError) {
    return false;
  }

  return failureCount < MAX_RETRIES;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
    },
  },
});
