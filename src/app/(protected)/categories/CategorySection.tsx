"use client";

import { useState } from "react";
import { ThemeWithThumb } from "@/models/ThemeWithThumb";
import LoadMore from "@/components/LoadMore/LoadMore";
import ThemeCard from "@/components/ThemeCard/ThemeCard";
import Toolbar from "@/components/Toolbar/Toolbar";
import { useRouter } from "next/navigation";
import CardList from "@/components/CardList/CardList";

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
  const [search, setSearch] = useState("");
  const router = useRouter();
  const hasMorePages = themes.length < total;

  function handleSearchSubmit() {
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

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
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
      />

      <section>
        <CardList>
          {themes.map((theme) => (
            <li key={theme.id}>
              <ThemeCard theme={theme} />
            </li>
          ))}
        </CardList>
      </section>

      <section>
        <LoadMore
          shown={themes.length}
          total={total}
          onLoadMore={handleLoadMore}
          loading={loading}
          canLoadMore={hasMorePages}
        >
          Hämta fler teman
        </LoadMore>
      </section>
    </div>
  );
}
