import { isHexColor, readableTextTone } from '../lib/color';
import styles from './TeamBadge.module.css';

type TeamBadgeProps = {
  code: string;
  color: string;
  className?: string;
};

export function TeamBadge({ code, color, className }: TeamBadgeProps) {
  const hasValidColor = isHexColor(color);
  const toneClass = hasValidColor
    ? readableTextTone(color) === 'light'
      ? styles.lightText
      : styles.darkText
    : undefined;
  const classes = [styles.badge, toneClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      style={hasValidColor ? { backgroundColor: color } : undefined}
      aria-hidden="true"
    >
      {code}
    </span>
  );
}
