import styles from './ErrorState.module.css';
import { getErrorMessage } from '../api/errorMessages';
import { Button } from './Button';

type ErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { title, description } = getErrorMessage(error);

  return (
    <div role="alert" className={styles.alert}>
      <svg
        className={styles.icon}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m15 9-6 6M9 9l6 6" />
      </svg>
      <div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {onRetry && (
          <Button
            variant="secondary"
            className={styles.retry}
            onClick={onRetry}
          >
            Intentar de nuevo
          </Button>
        )}
      </div>
    </div>
  );
}
