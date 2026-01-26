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
        data-testid={`toggle-watchlist-${setNum}`}
        type="button"
        className={`${styles.iconButton} ${isWatching ? styles.iconActive : ""}`}
        aria-label={isWatching ? "Ta bort bevakning" : "Lägg till i bevakning"}
        aria-pressed={isWatching}
        title={isWatching ? "Ta bort bevakning" : "Lägg till i bevakning"}
        onClick={toggleWatchlist}
      >
        <WatchIcon
          className={styles.icon}
          strokeWidth={isWatching ? 2.5 : 2}
          aria-hidden="true"
        />
      </button>

      <button
        data-testid={`toggle-collection-${setNum}`}
        type="button"
        className={`${styles.iconButton} ${isCollected ? styles.iconActive : ""}`}
        aria-label={isCollected ? "Ta bort från samling" : "Lägg till i samling"}
        aria-pressed={isCollected}
        title={isCollected ? "Ta bort från samling" : "Lägg till i samling"}
        onClick={toggleCollection}
      >
        <CollectIcon
          className={styles.icon}
          strokeWidth={isCollected ? 2.5 : 2}
          aria-hidden
        />
      </button>
    </div>
  );
}
