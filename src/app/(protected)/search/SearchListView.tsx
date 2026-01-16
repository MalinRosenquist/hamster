"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Toolbar from "@/components/Toolbar/Toolbar";
import CardList from "@/components/CardList/CardList";
import SetCard from "@/components/SetCard/SetCard";
import LoadMore from "@/components/LoadMore/LoadMore";
import { SetItem } from "@/models/SetItem";
import { buildSetItemsApiUrl } from "@/lib/rebrickable/buildSetItemsApiUrl";
import { sortSets } from "@/lib/rebrickable/sortSets";
import { setOrRemoveParam } from "@/lib/setOrRemoveParam";

type SearchListViewProps = {
  initialQuery: string;
  initialItems: SetItem[];
  initialTotal: number;

  initialOrdering: string;
  initialMinYear: string;
  initialMaxYear: string;

  initialPage: number;
  pageSize: number;
};

export default function SearchListView({
  initialQuery,
  initialItems,
  initialTotal,
  initialOrdering,
  initialMinYear,
  initialMaxYear,
  initialPage,
  pageSize,
}: SearchListViewProps) {
  const [items, setItems] = useState<SetItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const [estimatedTotal, setEstimatedTotal] = useState(initialTotal);
  const [hasMorePages, setHasMorePages] = useState(
    initialItems.length < initialTotal
  );

  const [ordering, setOrdering] = useState(initialOrdering);
  const [search, setSearch] = useState(initialQuery);
  const [minYearInput, setMinYearInput] = useState(initialMinYear);
  const [maxYearInput, setMaxYearInput] = useState(initialMaxYear);

  const router = useRouter();
  const pathname = usePathname(); // "/search"
  const searchParams = useSearchParams();

  const loadMoreInFlightRef = useRef(false);

  function syncUrl(next: {
    q?: string;
    ordering?: string;
    min_year?: string;
    max_year?: string;
    page?: number;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    setOrRemoveParam(params, "q", next.q ?? "");
    setOrRemoveParam(params, "ordering", next.ordering ?? "");
    setOrRemoveParam(params, "min_year", next.min_year ?? "");
    setOrRemoveParam(params, "max_year", next.max_year ?? "");
    setOrRemoveParam(params, "page", next.page ? String(next.page) : "");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  async function fetchFirstPage(next: {
    ordering: string;
    search: string;
    minYear: string;
    maxYear: string;
  }) {
    const res = await fetch(
      buildSetItemsApiUrl({
        page: 1,
        pageSize,
        ordering: next.ordering,
        search: next.search, // API-param heter "search"
        minYear: next.minYear,
        maxYear: next.maxYear,
      })
    );

    if (!res.ok) {
      console.error(
        "Could not fetch search results",
        res.status,
        await res.text().catch(() => "")
      );
      return null;
    }

    return (await res.json()) as { count: number; results: SetItem[] };
  }

  /**
   * Applies the current search input.
   * Resets pagination back to page 1 and replaces the list with new results.
   */
  async function handleSearchSubmit() {
    if (loading) return;
    setLoading(true);

    try {
      const q = search.trim();
      if (!q) return;

      const data = await fetchFirstPage({
        ordering,
        search: q,
        minYear: minYearInput,
        maxYear: maxYearInput,
      });
      if (!data) return;

      const sorted = sortSets(data.results, ordering);

      setItems(sorted);
      setPage(1);
      setEstimatedTotal(data.count);
      setHasMorePages(sorted.length < data.count);

      syncUrl({
        q,
        ordering,
        min_year: minYearInput,
        max_year: maxYearInput,
        page: 1,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderingChange(value: string) {
    if (loading) return;
    setLoading(true);

    try {
      const q = search.trim();
      if (!q) return;

      const data = await fetchFirstPage({
        ordering: value,
        search: q,
        minYear: minYearInput,
        maxYear: maxYearInput,
      });
      if (!data) return;

      const sorted = sortSets(data.results, value);

      setOrdering(value);
      setItems(sorted);
      setPage(1);
      setEstimatedTotal(data.count);
      setHasMorePages(sorted.length < data.count);

      syncUrl({
        q,
        ordering: value,
        min_year: minYearInput,
        max_year: maxYearInput,
        page: 1,
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Applies year range filter and refreshes results from page 1.
   */
  async function handleYearApply(nextMinYear: string, nextMaxYear: string) {
    if (loading) return;
    setLoading(true);

    try {
      const q = search.trim();
      if (!q) return;

      // Keep inputs in sync with what was applied
      setMinYearInput(nextMinYear);
      setMaxYearInput(nextMaxYear);

      const data = await fetchFirstPage({
        ordering,
        search: q,
        minYear: nextMinYear,
        maxYear: nextMaxYear,
      });
      if (!data) return;

      const sorted = sortSets(data.results, ordering);

      setItems(sorted);
      setPage(1);
      setEstimatedTotal(data.count);
      setHasMorePages(sorted.length < data.count);

      syncUrl({
        q,
        ordering,
        min_year: nextMinYear,
        max_year: nextMaxYear,
        page: 1,
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles "Load More" button click
   * Fetches next page and appends unique items to the list
   * Handles duplicate detection and adjusts total count accordingly
   */
  async function handleLoadMore() {
    if (loading || loadMoreInFlightRef.current) return;

    loadMoreInFlightRef.current = true;
    setLoading(true);

    const nextPage = page + 1;

    try {
      const q = search.trim();
      if (!q) return;

      const res = await fetch(
        buildSetItemsApiUrl({
          page: nextPage,
          pageSize,
          ordering,
          search: q,
          minYear: minYearInput,
          maxYear: maxYearInput,
        })
      );

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error("Could not fetch more results", res.status, errorText);

        if (res.status === 404 && errorText.includes("Invalid page")) {
          setHasMorePages(false);
          setEstimatedTotal(items.length);
        }
        return;
      }

      const data = (await res.json()) as { count: number; results: SetItem[] };

      // De-duplicate on set_num (protects against upstream duplicates across pages)
      const existing = new Set(items.map((x) => x.set_num));
      const newUnique = data.results.filter((x) => !existing.has(x.set_num));

      const duplicates = data.results.length - newUnique.length;
      const newTotalLength = items.length + newUnique.length;

      // Append and re-sort to keep consistent ordering in UI
      const combined = sortSets([...items, ...newUnique], ordering);
      setItems(combined);
      setPage(nextPage);

      // If duplicates were removed, adjust the displayed total
      if (duplicates > 0) setEstimatedTotal((prev) => prev - duplicates);

      // Stop when API returns fewer than a full page, otherwise compare with API count
      if (data.results.length < pageSize) {
        setHasMorePages(false);
        setEstimatedTotal(newTotalLength);
      } else {
        setHasMorePages(combined.length < data.count);
      }

      syncUrl({
        q,
        ordering,
        min_year: minYearInput,
        max_year: maxYearInput,
        page: nextPage,
      });
    } finally {
      loadMoreInFlightRef.current = false;
      setLoading(false);
    }
  }

  return (
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

      {items.length === 0 ? (
        <p>
          Inga träffar för <strong>{search.trim()}</strong>.
        </p>
      ) : (
        <section>
          <CardList>
            {items.map((item) => (
              <li key={item.set_num}>
                <SetCard item={item} source="categories" />
              </li>
            ))}
          </CardList>
        </section>
      )}

      <section>
        <LoadMore
          shown={items.length}
          total={estimatedTotal}
          loading={loading}
          canLoadMore={hasMorePages}
          onLoadMore={handleLoadMore}
        >
          Hämta fler set
        </LoadMore>
      </section>
    </div>
  );
}
