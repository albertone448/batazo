import { useId, type ReactNode } from 'react';
import styles from './Table.module.css';

type TableProps = {
  caption: string;
  children: ReactNode;
  className?: string;
};

export function Table({ caption, children, className }: TableProps) {
  const captionId = useId();
  const classes = [styles.wrapper, className].filter(Boolean).join(' ');

  return (
    // El contenedor puede desplazarse en horizontal en móvil; con tabIndex se
    // puede recorrer con el teclado, y role="region" le da un nombre.
    <div
      className={classes}
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
    >
      <table className={styles.table}>
        <caption id={captionId} className={styles.caption}>
          {caption}
        </caption>
        {children}
      </table>
    </div>
  );
}
