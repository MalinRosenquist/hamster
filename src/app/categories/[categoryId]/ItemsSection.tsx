"use client";

import CardActions from "@/components/Buttons/CardActions/CardActions";
import styles from "./ItemsSection.module.scss";
import LoadMore from "@/components/LoadMore/LoadMore";
import { SetItem } from "@/models/SetItem";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ItemsListProps = {
  initialItems: SetItem[];
  total: number;
  themeId: number;
};

export default function ItemsSection({
  initialItems,
  total,
  themeId,
}: ItemsListProps) {
  const [items, setItems] = useState<SetItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleLoadMore() {
    if (loading) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await fetch(
        `/api/rebrickable/setItems?page=${nextPage}&page_size=10&theme_id=${themeId}`
      );

      if (!res.ok) {
        console.error("Could not fetch more sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();

      setItems((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <section className={styles.listWrapper}>
          <ul className={styles.grid}>
            {items.map((s) => (
              <li key={s.set_num} className={styles.item}>
                <Link href={`/items/${s.set_num}`}>
                  <div className={styles.card}>
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
                    <span className={styles.setNumber}>{s.set_num}</span>
                    <span className={styles.title}>{s.name}</span>
                    <div className={styles.actions}>
                      <CardActions />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.loading}>
          <LoadMore
            shown={items.length}
            total={total}
            loading={loading}
            onLoadMore={handleLoadMore}
          >
            Hämta fler set
          </LoadMore>
        </section>
      </div>
    </>
  );
}
