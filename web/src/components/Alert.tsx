import type { ReactNode } from 'react';
import styles from './Alert.module.css';

type AlertTone = 'success' | 'danger' | 'warning' | 'info';

type AlertProps = {
  tone: AlertTone;
  title: string;
  children?: ReactNode;
  className?: string;
};

const iconPaths: Record<AlertTone, ReactNode> = {
  success: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  danger: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3 2 20h20L12 3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
};

export function Alert({ tone, title, children, className }: AlertProps) {
  const classes = [styles.alert, styles[tone], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={classes}>
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
        {iconPaths[tone]}
      </svg>
      <div>
        <p className={styles.title}>{title}</p>
        {children && <div className={styles.body}>{children}</div>}
      </div>
    </div>
  );
}
