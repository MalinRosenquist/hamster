"use client";

import LoadMore from "@/components/LoadMore/LoadMore";
import { SetItem } from "@/models/SetItem";
import { useState, useRef } from "react";
import Toolbar from "@/components/Toolbar/Toolbar";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SetCard from "@/components/SetCard/SetCard";
import { buildSetItemsApiUrl } from "@/lib/rebrickable/buildSetItemsApiUrl";
import { sortSets } from "@/lib/rebrickable/sortSets";
import { setOrRemoveParam } from "@/lib/setOrRemoveParam";
import CardList from "@/components/CardList/CardList";

const PAGE_SIZE = 10;

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

  // Pagination state
  // estimatedTotal starts with API count, then adjusts down when duplicates are found
  const [estimatedTotal, setEstimatedTotal] = useState(total);
  const [hasMorePages, setHasMorePages] = useState(total > PAGE_SIZE);

  // Filter and sort state
  const [ordering, setOrdering] = useState(initialOrdering);
  const [search, setSearch] = useState(initialSearch);
  const [minYearInput, setMinYearInput] = useState(initialMinYear);
  const [maxYearInput, setMaxYearInput] = useState(initialMaxYear);

  // Router for URL updates
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Prevents double-clicks and React strict mode double renders
  const loadMoreInFlightRef = useRef(false);

  /**
   * Handles search form submission
   * Resets pagination and fetches first page with new search term
   */
  async function handleSearchSubmit() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        buildSetItemsApiUrl({
          page: 1,
          pageSize: PAGE_SIZE,
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
      const sorted = sortSets(data.results, ordering);

      // Reset to first page with new results

      setItems(sorted);
      setPage(1);
      setEstimatedTotal(data.count);
      setHasMorePages(data.count > PAGE_SIZE);

      // Update URL with search params
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

  /**
   * Handles sorting change
   * Resets pagination and fetches first page with new sort order
   */
  async function handleOrderingChange(value: string) {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        buildSetItemsApiUrl({
          page: 1,
          pageSize: PAGE_SIZE,
          themeId,
          ordering: value,
          search,
          minYear: minYearInput,
          maxYear: maxYearInput,
        })
      );

      if (!res.ok) {
        console.error("Could not fetch sorted sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();
      const sorted = sortSets(data.results, value);

      // Reset to first page with new sort order
      setOrdering(value);
      setItems(sorted);
      setPage(1);
      setEstimatedTotal(data.count);
      setHasMorePages(data.count > PAGE_SIZE);

      // Update URL with new ordering
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

  /**
   * Handles year filter application
   * Resets pagination and fetches first page with new year range
   */
  async function handleYearApply(nextMinYear: string, nextMaxYear: string) {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        buildSetItemsApiUrl({
          page: 1,
          pageSize: PAGE_SIZE,
          themeId,
          ordering,
          search,
          minYear: nextMinYear,
          maxYear: nextMaxYear,
        })
      );

      if (!res.ok) {
        console.error("Could not fetch filtered sets", res.status);
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();
      const sorted = sortSets(data.results, ordering);

      // Reset to first page with new filters
      setItems(sorted);
      setPage(1);
      setEstimatedTotal(data.count);
      setHasMorePages(data.count > PAGE_SIZE);

      // Update URL with year filters
      const params = new URLSearchParams(searchParams.toString());
      setOrRemoveParam(params, "min_year", nextMinYear);
      setOrRemoveParam(params, "max_year", nextMaxYear);
      setOrRemoveParam(params, "search", search);
      setOrRemoveParam(params, "ordering", ordering);
      router.replace(`${pathname}?${params.toString()}`);
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
    // Prevent multiple simultaneous requests
    if (loading || loadMoreInFlightRef.current) return;

    loadMoreInFlightRef.current = true;
    setLoading(true);

    const nextPage = page + 1;

    try {
      const res = await fetch(
        buildSetItemsApiUrl({
          page: nextPage,
          pageSize: PAGE_SIZE,
          themeId,
          ordering,
          search,
          minYear: minYearInput,
          maxYear: maxYearInput,
        })
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Could not fetch more sets", res.status, errorText);

        // Handle "Invalid page" error (no more pages available)
        if (res.status === 404 && errorText.includes("Invalid page")) {
          setHasMorePages(false);
          // Set exact total to current items count
          setEstimatedTotal(items.length);
        }
        return;
      }

      const data: { count: number; results: SetItem[] } = await res.json();

      // Deduplicate: filter out items already in the list
      const existingSetNums = new Set(items.map((item) => item.set_num));
      const newUniqueItems = data.results.filter(
        (item) => !existingSetNums.has(item.set_num)
      );

      const duplicatesCount = data.results.length - newUniqueItems.length;
      const newTotalLength = items.length + newUniqueItems.length;

      // Append new unique items and re-sort
      const combinedItems = sortSets([...items, ...newUniqueItems], ordering);
      setItems(combinedItems);
      setPage(nextPage);

      // Adjust estimated total if duplicates were found
      if (duplicatesCount > 0) {
        setEstimatedTotal((prev) => prev - duplicatesCount);
      }

      // Check if this is the last page (received fewer than PAGE_SIZE results)
      if (data.results.length < PAGE_SIZE) {
        setHasMorePages(false);
        // Set exact total when reaching the end
        setEstimatedTotal(newTotalLength);
      }
    } finally {
      loadMoreInFlightRef.current = false;
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
          <CardList>
            {items.map((item) => (
              <li key={item.set_num}>
                <SetCard item={item} source="categories" categoryId={themeId} />
              </li>
            ))}
          </CardList>
        </section>

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
    </>
  );
}
