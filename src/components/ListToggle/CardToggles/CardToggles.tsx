"use client";

import styles from "./CardToggles.module.scss";
import WatchIcon from "@/components/Icons/WatchIcon";
import CollectIcon from "@/components/Icons/CollectIcon";
import { useSetLists } from "@/hooks/useSetLists";

type CardTogglesProps = {
  setNum: string;
};

export default function CardToggles({ setNum }: CardTogglesProps) {
  const { isWatching, isCollected, toggleWatchlist, toggleCollection } =
    useSetLists(setNum);

  return (
    <div className={styles.cardToggles}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label={isWatching ? "Ta bort bevakning" : "Lägg till i bevakning"}
        aria-pressed={isWatching}
        title={isWatching ? "Ta bort bevakning" : "Lägg till i bevakning"}
        onClick={toggleWatchlist}
      >
        <WatchIcon className={styles.icon} aria-hidden="true" />
      </button>

      <button
        type="button"
        className={styles.iconButton}
        aria-label={isCollected ? "Ta bort från samling" : "Lägg till i samling"}
        aria-pressed={isCollected}
        title={isWatching ? "Ta bort från samling" : "Lägg till i samling"}
        onClick={toggleCollection}
      >
        <CollectIcon className={styles.icon} aria-hidden />
      </button>
    </div>
  );
}
