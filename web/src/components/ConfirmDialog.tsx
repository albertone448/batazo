import { useEffect, useId, useRef, type SyntheticEvent } from 'react';
import { Button } from './Button';
import styles from './ConfirmDialog.module.css';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // <dialog> se abre y se cierra con métodos del DOM, no con un atributo:
  // este efecto sincroniza el elemento con la prop open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    // Escape dispara "cancel". El estado lo decide quien usa el diálogo.
    event.preventDefault();
    if (!isConfirming) {
      onCancel();
    }
  }

  function handleClose() {
    // Si el navegador cerró el diálogo por su cuenta, se avisa para no quedar
    // con open en true y el diálogo cerrado.
    if (open) {
      onCancel();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancel}
      onClose={handleClose}
    >
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p id={descriptionId} className={styles.description}>
        {description}
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={isConfirming}>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} isLoading={isConfirming}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
