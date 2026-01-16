"use client";

import { useEffect, useState } from "react";
import { SetItem } from "@/models/SetItem";
import SetCard from "../SetCard/SetCard";
import Spinner from "../Spinner/Spinner";
import CardList from "../CardList/CardList";

export type SavedSetListProps = {
  ids: string[];
  emptyText: string;
  source: "watchlist" | "collection";
};

export default function SavedSetList({ ids, emptyText, source }: SavedSetListProps) {
  const [items, setItems] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Show loading-message and spinner only if loading takes longer than 200ms (prevents flash)
  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
      return;
    }

    const t = setTimeout(() => setShowLoader(true), 200);
    return () => clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      const safeIds = Array.from(new Set(ids)).filter(
        (id): id is string => typeof id === "string" && id.length > 0
      );

      if (safeIds.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);

      try {
        const results = await Promise.all(
          safeIds.map(async (id) => {
            const res = await fetch(
              `/api/rebrickable/setItems/${encodeURIComponent(id)}`,
              { signal: ac.signal }
            );

            if (!res.ok) {
              console.warn("Failed to fetch", id, res.status);
              return null;
            }

            return (await res.json()) as SetItem;
          })
        );

        setItems(results.filter((x): x is SetItem => x !== null));
      } catch (err) {
        // When aborted, fetch throws AbortError - ignore it.
        if (err instanceof DOMException && err.name === "AbortError") return;
        throw err;
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => ac.abort();
  }, [ids]);

  return (
    <>
      {showLoader ? (
        <div>
          <p>Laddar...</p>
          <Spinner size="default" />
        </div>
      ) : ids.length === 0 ? (
        <p>{emptyText}</p>
      ) : items.length === 0 ? null : (
        <section>
          <CardList>
            {items.map((item) => (
              <li key={item.set_num}>
                <SetCard item={item} source={source} />
              </li>
            ))}
          </CardList>
        </section>
      )}
    </>
  );
}
