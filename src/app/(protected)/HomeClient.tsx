"use client";

import { useAuth } from "@/hooks/useAuth";
import styles from "./page.module.scss";
import { ButtonLink } from "@/components/Buttons/Button/ButtonLink";
import { useContext } from "react";
import { SetListsContext } from "@/contexts/SetListsContext";

export default function HomeClient() {
  const { userName, isAuthed } = useAuth();
  const { counts } = useContext(SetListsContext);
  const showWatchlistButton = counts.watchlist > 0;

  if (!isAuthed) {
    return null;
  }

  return (
    <div className={"container"}>
      <h1 data-testid="greeting">Hej {userName}!</h1>

      <div className={styles.card}>
        <h2>Översikt</h2>
        <p className={styles.lead}>
          Här är din snabbkoll — redo att hamstra vidare?
        </p>

        <div className={styles.counters}>
          <div className={styles.counter}>
            <span data-testid="collection-count" className={styles.value}>
              {counts.collection}
            </span>
            <span className={styles.label}>set samlade</span>
          </div>

          <div className={styles.counter}>
            <span data-testid="watchlist-count" className={styles.value}>
              {counts.watchlist}
            </span>
            <span className={styles.label}>set bevakade</span>
          </div>
        </div>

        <div className={styles.actions}>
          <ButtonLink href="/categories" variant="primary">
            Utforska set
          </ButtonLink>

          {showWatchlistButton && (
            <ButtonLink href="/watchlist" variant="secondary">
              Bevakningar
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
