import styles from './LoadingState.module.css';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Cargando…' }: LoadingStateProps) {
  return (
    <div role="status" className={styles.loading}>
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.label}>{label}</p>
    </div>
  );
}
