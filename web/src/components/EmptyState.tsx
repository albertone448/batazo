import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <span className={styles.symbol} aria-hidden="true" />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {action}
    </div>
  );
}
