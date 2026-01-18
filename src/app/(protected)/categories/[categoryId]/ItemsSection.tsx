"use client";

import { SetItem } from "@/models/SetItem";
import { useSetItemsList } from "@/hooks/useSetItemsList";
import ItemsListContent from "@/components/ItemsListContent/ItemsListContent";

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
    initialTotal: total,
    initialPage: 1,
    pageSize: PAGE_SIZE,
    initialOrdering,
    initialSearch,
    initialMinYear,
    initialMaxYear,
    themeId,
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
      categoryId={themeId}
      emptyMessage={emptyMessage}
    />
  );
}
