"use client";

import styles from "./ItemsSection.module.scss";
import LoadMore from "@/components/LoadMore/LoadMore";
import { SetItem } from "@/models/SetItem";
import { useState } from "react";
import Toolbar from "@/components/Toolbar/Toolbar";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SetCard from "@/components/SetCard/SetCard";
import { buildSetItemsApiUrl } from "@/lib/rebrickable/buildSetItemsApiUrl";
import { sortSets } from "@/lib/rebrickable/sortSets";
import { setOrRemoveParam } from "@/lib/serOrRemoveParams";

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
  const [totalCount, setTotalCount] = useState(total);
  const router = useRouter();
  const pathname = usePathname();

  async function handleSearchSubmit() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        buildSetItemsApiUrl({
          page: 1,
          pageSize: 10,
          themeId,
          ordering,
          search,
          minYear: minYearInput,
          maxYear: maxYearInput,
        })
      );

      if (!res.ok) {
        console.error("Could not fetch searched sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();

      setItems(sortSets(data.results, ordering));
      setTotalCount(data.count);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());

      setOrRemoveParam(params, "search", search);
      setOrRemoveParam(params, "ordering", ordering);
      setOrRemoveParam(params, "min_year", minYearInput);
      setOrRemoveParam(params, "max_year", maxYearInput);

      router.replace(`${pathname}?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderingChange(value: string) {
    if (loading) return;
    setLoading(true);

    const url = buildSetItemsApiUrl({
      page: 1,
      pageSize: 10,
      themeId,
      ordering: value,
      search,
      minYear: minYearInput,
      maxYear: maxYearInput,
    });

    try {
      const res = await fetch(url);

      if (!res.ok) {
        console.error("Could not fetch sorted sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();
      const sorted = sortSets(data.results, value);

      setOrdering(value);
      setItems(sorted);

      setTotalCount(data.count);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());

      setOrRemoveParam(params, "ordering", value);
      setOrRemoveParam(params, "search", search);
      setOrRemoveParam(params, "min_year", minYearInput);
      setOrRemoveParam(params, "max_year", maxYearInput);

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
        buildSetItemsApiUrl({
          page: 1,
          pageSize: 10,
          themeId,
          ordering,
          search,
          minYear: minYearInput,
          maxYear: maxYearInput,
        })
      );

      if (!res.ok) {
        console.error("Could not fetch filtered sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();

      setItems(sortSets(data.results, ordering));

      setTotalCount(data.count);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());

      setOrRemoveParam(params, "min_year", minYearInput);
      setOrRemoveParam(params, "max_year", maxYearInput);
      setOrRemoveParam(params, "search", search);
      setOrRemoveParam(params, "ordering", ordering);

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
        buildSetItemsApiUrl({
          page: nextPage,
          pageSize: 10,
          themeId,
          ordering,
          search,
          minYear: minYearInput,
          maxYear: maxYearInput,
        })
      );

      if (!res.ok) {
        console.error("Could not fetch more sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();

      setItems((prev) => sortSets([...prev, ...data.results], ordering));

      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <Toolbar
          ordering={ordering}
          onOrderingChange={handleOrderingChange}
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
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
                <SetCard item={item} source="categories" categoryId={themeId} />
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
