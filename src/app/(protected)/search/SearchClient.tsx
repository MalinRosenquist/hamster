"use client";

import { SetItem } from "@/models/SetItem";
import { useSetItemsList } from "@/hooks/useSetItemsList";
import ItemsListContent from "@/components/ItemsListContent/ItemsListContent";

type SearchClientProps = {
  initialQuery: string;
  initialItems: SetItem[];
  initialTotal: number;
  initialOrdering: string;
  initialMinYear: string;
  initialMaxYear: string;
  initialPage: number;
  pageSize: number;
};

export default function SearchClient({
  initialQuery,
  initialItems,
  initialTotal,
  initialOrdering,
  initialMinYear,
  initialMaxYear,
  initialPage,
  pageSize,
}: SearchClientProps) {
  const {
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
  } = useSetItemsList({
    initialItems,
    initialTotal,
    initialPage,
    pageSize,
    initialOrdering,
    initialSearch: initialQuery,
    initialMinYear,
    initialMaxYear,
    requireSearch: true,
  });

  const emptyMessage =
    items.length === 0 && search.trim() ? (
      <p>
        Inga träffar för <strong>{search.trim()}</strong>.
      </p>
    ) : undefined;

  return (
    <ItemsListContent
      items={items}
      loading={loading}
      estimatedTotal={estimatedTotal}
      hasMorePages={hasMorePages}
      ordering={ordering}
      search={search}
      minYearInput={minYearInput}
      maxYearInput={maxYearInput}
      onSearchChange={setSearch}
      onMinYearChange={setMinYearInput}
      onMaxYearChange={setMaxYearInput}
      onSearchSubmit={handleSearchSubmit}
      onOrderingChange={handleOrderingChange}
      onYearApply={handleYearApply}
      onLoadMore={handleLoadMore}
      emptyMessage={emptyMessage}
    />
  );
}
