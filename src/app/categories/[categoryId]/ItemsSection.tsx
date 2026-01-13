"use client";

import styles from "./ItemsSection.module.scss";
import LoadMore from "@/components/LoadMore/LoadMore";
import { SetItem } from "@/models/SetItem";
import { useState } from "react";
import ToolBar from "@/components/ToolBar/ToolBar";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SetCard from "@/components/SetCard/SetCard";

type ItemsListProps = {
  initialItems: SetItem[];
  total: number;
  themeId: number;
  initialOrdering: string;
  initialSearch: string;
  initialMinYear: string;
  initialMaxYear: string;
};

export default function ItemsSection({
  initialItems,
  total,
  themeId,
  initialOrdering,
  initialSearch,
  initialMinYear,
  initialMaxYear,
}: ItemsListProps) {
  const [items, setItems] = useState<SetItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState(initialOrdering);
  const [search, setSearch] = useState(initialSearch);
  const [minYearInput, setMinYearInput] = useState(initialMinYear);
  const [maxYearInput, setMaxYearInput] = useState(initialMaxYear);
  const searchParams = useSearchParams();
  const minYearParam = minYearInput ? `&min_year=${minYearInput}` : "";
  const maxYearParam = maxYearInput ? `&max_year=${maxYearInput}` : "";
  const searchQueryParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const [totalCount, setTotalCount] = useState(total);
  const router = useRouter();
  const pathname = usePathname();

  async function handleSearchSumbit() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/rebrickable/setItems?page=1&page_size=10&theme_id=${themeId}&ordering=${ordering}${searchQueryParam}${minYearParam}${maxYearParam}`
      );

      if (!res.ok) {
        console.error("Could not fetch searched sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();

      setItems(data.results);
      setTotalCount(data.count);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      router.replace(`${pathname}?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderingChange(value: string) {
    if (loading) return;
    setLoading(true);

    try {
      console.log("DEBUG search:", search, "typeof:", typeof search);
      const res = await fetch(
        `/api/rebrickable/setItems?page=1&page_size=10&theme_id=${themeId}&ordering=${value}${searchQueryParam}${minYearParam}${maxYearParam}`
      );

      if (!res.ok) {
        console.error("Could not fetch sorted sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();

      setOrdering(value);
      setItems(data.results);
      setTotalCount(data.count);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("ordering", value);
      } else {
        params.delete("ordering");
      }

      router.replace(`${pathname}?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleYearApply() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/rebrickable/setItems?page=1&page_size=10&theme_id=${themeId}&ordering=${ordering}${searchQueryParam}${minYearParam}${maxYearParam}`
      );

      if (!res.ok) {
        console.error("Could not fetch filtered sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();

      setItems(data.results);
      setTotalCount(data.count);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());

      if (minYearInput) {
        params.set("min_year", minYearInput);
      } else {
        params.delete("min_year");
      }

      if (maxYearInput) {
        params.set("max_year", maxYearInput);
      } else {
        params.delete("max_year");
      }

      router.replace(`${pathname}?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    if (loading) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await fetch(
        `/api/rebrickable/setItems?page=${nextPage}&page_size=10&theme_id=${themeId}&ordering=${ordering}${searchQueryParam}${minYearParam}${maxYearParam}`
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
        <ToolBar
          ordering={ordering}
          onOrderingChange={handleOrderingChange}
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSumbit}
          yearFilter={{
            minYear: minYearInput,
            maxYear: maxYearInput,
            onMinYearChange: setMinYearInput,
            onMaxYearChange: setMaxYearInput,
            onApply: handleYearApply,
          }}
        />
        <section>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.set_num} className={styles.item}>
                <SetCard item={item} />
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.loading}>
          <LoadMore
            shown={items.length}
            total={totalCount}
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
