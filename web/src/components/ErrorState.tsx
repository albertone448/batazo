import { getErrorMessage } from '../api/errorMessages';

type ErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { title, description } = getErrorMessage(error);

  return (
    <div role="alert">
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
