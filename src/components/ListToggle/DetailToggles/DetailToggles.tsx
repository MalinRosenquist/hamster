"use client";

import styles from "./DetailToggles.module.scss";
import CollectIcon from "@/components/Icons/CollectIcon";
import WatchIcon from "@/components/Icons/WatchIcon";
import { useSetLists } from "@/hooks/useSetLists";

type DetailTogglesProps = {
  setNum: string;
};

export default function DetailToggles({ setNum }: DetailTogglesProps) {
  const { isWatching, isCollected, toggleWatchlist, toggleCollection } =
    useSetLists(setNum);

  return (
    <div className={styles.actions}>
      <button
        className={styles.toggle}
        aria-pressed={isWatching}
        aria-label={isWatching ? "Ta bort från bevakning" : "Lägg till bevakning"}
        title={isWatching ? "Ta bort från bevakning" : "Lägg till bevakning"}
        onClick={toggleWatchlist}
      >
        <WatchIcon className={styles.icon} />
        <span>Bevakar</span>
      </button>
      <button
        className={styles.toggle}
        aria-pressed={isCollected}
        aria-label={isCollected ? "Ta bort från samling" : "Lägg till i samling"}
        title={isCollected ? "Ta bort från samling" : "Lägg till i samling"}
        onClick={toggleCollection}
      >
        <CollectIcon className={styles.icon} />
        <span>Samla</span>
      </button>
    </div>
  );
}
