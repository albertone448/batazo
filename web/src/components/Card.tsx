import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'article' | 'li';
};

export function Card({ as: Element = 'div', className, ...rest }: CardProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ');

  return <Element {...rest} className={classes} />;
}
