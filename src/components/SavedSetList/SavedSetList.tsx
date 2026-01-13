"use client";

import { useEffect, useState } from "react";
import styles from "./SavedSetList.module.scss";
import { SetItem } from "@/models/SetItem";
import SetCard from "../SetCard/SetCard";

export type SetListProps = {
  ids: string[];
  emptyText: string;
};

export default function SetList({ ids, emptyText }: SetListProps) {
  const [items, setItems] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (ids.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`/api/rebrickable/setItems/${id}`);
            if (!res.ok) throw new Error("Failed to fetch set");
            return (await res.json()) as SetItem;
          })
        );

        setItems(results);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [ids]);

  return (
    <>
      {loading ? (
        <p>Laddar...</p>
      ) : items.length === 0 ? (
        <p>{emptyText}</p>
      ) : (
        <section>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.set_num}>
                <SetCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
