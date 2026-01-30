import { useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SetItem } from "@/models/SetItem";
import { buildSetItemsApiUrl } from "@/lib/rebrickable/buildSetItemsApiUrl";
import { sortSets } from "@/lib/rebrickable/sortSets";
import { setOrRemoveParam } from "@/lib/setOrRemoveParam";

type UseSetItemsListParams = {
  initialItems: SetItem[];
  initialTotal: number;
  initialPage: number;
  pageSize: number;
  initialOrdering: string;
  initialSearch: string;
  initialMinYear: string;
  initialMaxYear: string;
  themeId?: number;
  requireSearch?: boolean; // If true, only fetch when search is not empty
};

/**
 * Client-side controller for a paginated list of SetItem.
 *
 * Responsibilities:
 * - Keep UI state for current results + filters/sort
 * - Fetch first page when filters/sort/search changes
 * - Fetch next page and append results (deduplicating by set_num)
 * - Maintain "estimatedTotal" when duplicates are removed across pages
 * - Keep the URL query params in sync (q, ordering, min_year, max_year, page)
 */
export function useSetItemsList({
  initialItems,
  initialTotal,
  initialPage,
  pageSize,
  initialOrdering,
  initialSearch,
  initialMinYear,
  initialMaxYear,
  themeId,
  requireSearch = false,
}: UseSetItemsListParams) {
  const [items, setItems] = useState<SetItem[]>(() =>
    sortSets(initialItems, initialOrdering)
  );
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [estimatedTotal, setEstimatedTotal] = useState(initialTotal);
  const [hasMorePages, setHasMorePages] = useState(
    initialItems.length < initialTotal
  );
  const [ordering, setOrdering] = useState(initialOrdering);
  const [search, setSearch] = useState(initialSearch);
  const [minYearInput, setMinYearInput] = useState(initialMinYear);
  const [maxYearInput, setMaxYearInput] = useState(initialMaxYear);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loadMoreInFlightRef = useRef(false);

  /**
   * Updates the browser URL query string to reflect the current state.
   * This enables shareable links and back/forward navigation.
   */
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

    // Replace (not push) to avoid adding history entries for each change
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  /**
   * Fetches page 1 with the provided filters/sorting.
   * Used by submit search, change ordering, and apply year filter.
   */
  async function fetchFirstPage(next: {
    ordering: string;
    search: string;
    minYear: string;
    maxYear: string;
  }) {
    // For pages that require a search term, avoid calling the API on empty input.
    if (requireSearch && !next.search.trim()) {
      return null;
    }

    const res = await fetch(
      buildSetItemsApiUrl({
        page: 1,
        pageSize,
        themeId,
        ordering: next.ordering,
        search: next.search || undefined,
        minYear: next.minYear || undefined,
        maxYear: next.maxYear || undefined,
      })
    );

    if (!res.ok) {
      console.error(
        "Could not fetch items",
        res.status,
        await res.text().catch(() => "")
      );
      return null;
    }

    return (await res.json()) as { count: number; results: SetItem[] };
  }

  /**
   * Applies the current search input:
   * - resets pagination to page 1
   * - replaces the list with the first page of results
   * - updates totals and URL params
   */
  async function handleSearchSubmit() {
    if (loading) return;
    setLoading(true);

    try {
      const searchTerm = search.trim();
      if (requireSearch && !searchTerm) return;

      const data = await fetchFirstPage({
        ordering,
        search: searchTerm,
        minYear: minYearInput,
        maxYear: maxYearInput,
      });
      if (!data) return;

      // Keep UI ordering consistent with the selected sort
      const sorted = sortSets(data.results, ordering);

      setItems(sorted);
      setPage(1);
      setEstimatedTotal(data.count);
      setHasMorePages(sorted.length < data.count);

      syncUrl({
        q: searchTerm,
        ordering,
        min_year: minYearInput,
        max_year: maxYearInput,
        page: 1,
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Applies a new ordering:
   * - resets pagination to page 1
   * - fetches the first page with the new ordering
   * - updates URL params
   */
  async function handleOrderingChange(value: string) {
    if (loading) return;
    setLoading(true);

    try {
      const searchTerm = search.trim();
      if (requireSearch && !searchTerm) return;

      const data = await fetchFirstPage({
        ordering: value,
        search: searchTerm,
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
        q: searchTerm,
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
   * Applies a year range filter:
   * - keeps inputs in sync with what was applied
   * - resets pagination to page 1
   * - fetches the first page with the new year range
   * - updates URL params
   */
  async function handleYearApply(nextMinYear: string, nextMaxYear: string) {
    if (loading) return;
    setLoading(true);

    try {
      const searchTerm = search.trim();
      if (requireSearch && !searchTerm) return;

      setMinYearInput(nextMinYear);
      setMaxYearInput(nextMaxYear);

      const data = await fetchFirstPage({
        ordering,
        search: searchTerm,
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
        q: searchTerm,
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
   * Loads the next page and appends unique results.
   *
   * Notes:
   * - Deduplicates by set_num to guard against upstream duplicates across pages.
   * - Adjusts estimatedTotal down when duplicates are removed.
   * - Stops pagination when:
   *   - API returns fewer results than pageSize (last page), or
   *   - API returns "Invalid page" (no more pages).
   */
  async function handleLoadMore() {
    if (loading || loadMoreInFlightRef.current) return;

    loadMoreInFlightRef.current = true;
    setLoading(true);

    const nextPage = page + 1;

    try {
      const searchTerm = search.trim();
      if (requireSearch && !searchTerm) return;

      const res = await fetch(
        buildSetItemsApiUrl({
          page: nextPage,
          pageSize,
          themeId,
          ordering,
          search: searchTerm || undefined,
          minYear: minYearInput || undefined,
          maxYear: maxYearInput || undefined,
        })
      );

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error("Could not fetch more results", res.status, errorText);

        // Backend can signal "no more pages" via a 404 + "Invalid page"
        if (res.status === 404 && errorText.includes("Invalid page")) {
          setHasMorePages(false);
          setEstimatedTotal(items.length);
        }
        return;
      }

      const data = (await res.json()) as { count: number; results: SetItem[] };

      // De-duplicate on set_num (protects against duplicates across pages)
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
        q: searchTerm,
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

  return {
    items,
    loading,
    estimatedTotal,
    hasMorePages,
    ordering,
    search,
    minYearInput,
    maxYearInput,
    setSearch,
    setMinYearInput,
    setMaxYearInput,
    handleSearchSubmit,
    handleOrderingChange,
    handleYearApply,
    handleLoadMore,
  };
}
