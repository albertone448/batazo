import { getErrorMessage } from '../api/errorMessages';
import { Alert } from './Alert';
import { Button } from './Button';
import styles from './ErrorState.module.css';

type ErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { title, description } = getErrorMessage(error);

  return (
    <Alert tone="danger" title={title}>
      <p className={styles.description}>{description}</p>
      {onRetry && (
        <Button variant="secondary" className={styles.retry} onClick={onRetry}>
          Intentar de nuevo
        </Button>
      )}
    </Alert>
  );
}
