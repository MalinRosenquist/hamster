"use client";

import { useContext, useEffect, useState } from "react";
import styles from "./WatchlistSection.module.scss";
import CardToggles from "@/components/ListToggle/CardToggles/CardToggles";
import { SetListsContext } from "@/contexts/SetListsContext";
import { SetItem } from "@/models/SetItem";
import Image from "next/image";
import Link from "next/link";

export default function CollectionSection() {
  const { watchlistIds } = useContext(SetListsContext);
  const [items, setItems] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (watchlistIds.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          watchlistIds.map(async (id) => {
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
  }, [watchlistIds]);

  return (
    <>
      {loading ? (
        <p>Laddar...</p>
      ) : items.length === 0 ? (
        <p>Din samling är tom.</p>
      ) : (
        <section className={styles.listWrapper}>
          <ul className={styles.grid}>
            {items.map((s) => (
              <li key={s.set_num}>
                <div className={styles.card}>
                  <Link prefetch={false} href={`/items/${s.set_num}`}>
                    <div className={styles.imgContainer}>
                      {s.set_img_url ? (
                        <Image
                          src={s.set_img_url}
                          alt=""
                          fill
                          sizes="180"
                          className={styles.thumb}
                          aria-hidden="true"
                        />
                      ) : (
                        <Image
                          src="/icons/no_photo.svg"
                          alt=""
                          width={40}
                          height={40}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className={styles.meta}>
                      <span className={styles.setNumber}>{s.set_num}</span>
                      <span className={styles.title}>{s.name}</span>
                    </div>
                  </Link>
                  <div className={styles.actions}>
                    <CardToggles setNum={s.set_num} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
