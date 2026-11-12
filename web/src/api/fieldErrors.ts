import { ApiError } from './client';

// Field name as sent by the API (JSON name), or '' for errors that belong to
// the whole form.
export type FieldErrors = Record<string, string>;

export function getFieldErrors(error: unknown): FieldErrors {
  if (
    !(error instanceof ApiError) ||
    error.status !== 400 ||
    !error.problem?.errors
  ) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(error.problem.errors).map(([field, messages]) => [
      field,
      messages.join(' '),
    ]),
  );
}
