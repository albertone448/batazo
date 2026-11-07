import { useId, type InputHTMLAttributes } from 'react';
import styles from './TextField.module.css';

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string;
  error?: string;
};

export function TextField({
  label,
  error,
  className,
  ...rest
}: TextFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const classes = [styles.field, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
