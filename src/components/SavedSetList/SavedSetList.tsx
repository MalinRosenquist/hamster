"use client";

import { useEffect, useState, useMemo } from "react";
import { SetItem } from "@/models/SetItem";
import SetCard from "../SetCard/SetCard";
import Spinner from "../Spinner/Spinner";
import CardList from "../CardList/CardList";
import Toolbar from "../Toolbar/Toolbar";
import { sortSets } from "@/lib/rebrickable/sortSets";

export type SavedSetListProps = {
  ids: string[];
  emptyText: string;
  source: "watchlist" | "collection";
};

export default function SavedSetList({ ids, emptyText, source }: SavedSetListProps) {
  const [items, setItems] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-year");

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
      // Normalize incoming ids: remove duplicates (Set) and remove invalid/empty values
      const safeIds = Array.from(new Set(ids)).filter(
        (id): id is string => typeof id === "string" && id.length > 0
      );

      // If there are no ids, clear the list and cancel early.
      if (safeIds.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);

      try {
        // Fetch item details for each id in parallel.
        // Each failed request returns `null` to be filter it out afterwards.
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

        // Remove failed fetches (nulls) and store only valid SetItem objects.
        setItems(results.filter((item): item is SetItem => item !== null));
      } catch (err) {
        // When aborted, fetch throws AbortError - ignore it.
        if (err instanceof DOMException && err.name === "AbortError") return;
        throw err;
      } finally {
        setLoading(false);
      }
    }

    load();

    // Cleanup: abort any ongoing requests from this effect run.
    return () => ac.abort();
  }, [ids]);

  // Filter items by search term
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    const searchLower = search.trim().toLowerCase();
    return items.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(searchLower);
      const setNumMatch = item.set_num.toLowerCase().includes(searchLower);
      return nameMatch || setNumMatch;
    });
  }, [items, search]);

  // Sort filtered items
  const sortedItems = useMemo(() => {
    return sortSets(filteredItems, ordering);
  }, [filteredItems, ordering]);

  // Handle search submission, filter on change
  const handleSearchSubmit = () => {
    // Search filtering happens automatically via useMemo
  };

  // Handle ordering change
  const handleOrderingChange = (value: string) => {
    setOrdering(value);
  };

  return (
    <div>
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        ordering={ordering}
        onOrderingChange={handleOrderingChange}
      />

      {showLoader ? (
        <div>
          <p>Laddar...</p>
          <Spinner size="default" />
        </div>
      ) : ids.length === 0 ? (
        <p>{emptyText}</p>
      ) : sortedItems.length === 0 ? (
        <p>
          {search.trim()
            ? `Inga träffar för "${search.trim()}".`
            : "Inga objekt att visa."}
        </p>
      ) : (
        <section>
          <CardList>
            {sortedItems.map((item) => (
              <li key={item.set_num}>
                <SetCard item={item} source={source} />
              </li>
            ))}
          </CardList>
        </section>
      )}
    </div>
  );
}
