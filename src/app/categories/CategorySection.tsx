"use client";

import { useState } from "react";
import { ThemeWithThumb } from "@/models/ThemeWithThumb";
import LoadMore from "@/components/LoadMore/LoadMore";
import styles from "./CategorySection.module.scss";
import Image from "next/image";

type Props = {
  initialCategories: ThemeWithThumb[];
  total: number;
};

export default function CategorySection({ initialCategories, total }: Props) {
  const [themes, setThemes] = useState<ThemeWithThumb[]>(initialCategories);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleLoadMore() {
    if (loading) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await fetch(
        `/api/rebrickable/themes?page=${nextPage}&pageSize=10`
      );

      if (!res.ok) {
        console.error("Kunde inte hämta fler teman", res.status);
        return;
      }

      const data: { count: number; results: ThemeWithThumb[] } = await res.json();

      setThemes((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className={styles.listWrapper}>
        <ul className={styles.grid}>
          {themes.map((theme) => (
            <li key={theme.id} className={styles.item}>
              <div className={styles.card}>
                <div className={styles.imgContainer}>
                  {theme.thumb ? (
                    <Image
                      src={theme.thumb}
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
                <span className={styles.title}>{theme.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.loading}>
        <LoadMore
          shown={themes.length}
          total={total}
          onLoadMore={handleLoadMore}
          loading={loading}
        >
          Hämta fler teman
        </LoadMore>
      </section>
    </div>
  );
}
