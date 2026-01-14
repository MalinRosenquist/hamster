"use client";

import { useState } from "react";
import { ThemeWithThumb } from "@/models/ThemeWithThumb";
import LoadMore from "@/components/LoadMore/LoadMore";
import styles from "./CategorySection.module.scss";
import ThemeCard from "@/components/ThemeCard/ThemeCard";

type CategoryProps = {
  initialCategories: ThemeWithThumb[];
  total: number;
};

export default function CategorySection({
  initialCategories,
  total,
}: CategoryProps) {
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
        console.error("Could not fetch more themes", res.status);
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
      <section>
        <ul className={styles.list}>
          {themes.map((theme) => (
            <li key={theme.id} className={styles.item}>
              <ThemeCard theme={theme} />
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
