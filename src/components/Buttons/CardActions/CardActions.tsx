"use client";

import styles from "./CardActions.module.scss";
import WatchIcon from "@/components/Icons/WatchIcon";
import CollectIcon from "@/components/Icons/CollectIcon";

export default function CardActions() {
  return (
    <div className={styles.cardActions}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Bevaka"
        title="Bevaka"
      >
        <WatchIcon className={styles.icon} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Bevaka"
        title="Bevaka"
      >
        <CollectIcon className={styles.icon} aria-hidden />
      </button>
    </div>
  );
}
