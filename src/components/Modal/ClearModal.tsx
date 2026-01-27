"use client";

import { useEffect, useRef } from "react";
import Button from "../Buttons/Button/Button";
import styles from "./ClearModal.module.scss";
import Image from "next/image";

type ClearModalProp = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ClearModal({ open, onClose, onConfirm }: ClearModalProp) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      data-testid="clear-modal"
      className={styles.modal}
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <h2>Är du säker?</h2>
      <span className={styles.warningIcon} aria-hidden="true">
        <Image src="/icons/warning.svg" alt="" width={37} height={32} />
      </span>
      <p>
        All din sparade data på den här enheten kommer att raderas och kan inte
        återfås.
      </p>
      <div className={styles.buttonWrapper}>
        <Button
          data-testid="clear-modal-cancel"
          variant="secondary"
          type="button"
          onClick={onClose}
        >
          Avbryt
        </Button>
        <Button
          data-testid="clear-modal-confirm"
          variant="danger"
          type="button"
          onClick={onConfirm}
        >
          Rensa data
        </Button>
      </div>
    </dialog>
  );
}
