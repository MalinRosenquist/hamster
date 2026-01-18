"use client";

import { ReactNode } from "react";
import Toolbar from "@/components/Toolbar/Toolbar";
import CardList from "@/components/CardList/CardList";
import SetCard from "@/components/SetCard/SetCard";
import LoadMore from "@/components/LoadMore/LoadMore";
import { SetItem } from "@/models/SetItem";

type ItemsListContentProps = {
  items: SetItem[];
  loading: boolean;
  estimatedTotal: number;
  hasMorePages: boolean;
  ordering: string;
  search: string;
  minYearInput: string;
  maxYearInput: string;
  onSearchChange: (value: string) => void;
  onMinYearChange: (value: string) => void;
  onMaxYearChange: (value: string) => void;
  onSearchSubmit: () => void;
  onOrderingChange: (value: string) => void;
  onYearApply: (minYear: string, maxYear: string) => void;
  onLoadMore: () => void;
  emptyMessage?: ReactNode;
  categoryId?: number;
};

export default function ItemsListContent({
  items,
  loading,
  estimatedTotal,
  hasMorePages,
  ordering,
  search,
  minYearInput,
  maxYearInput,
  onSearchChange,
  onMinYearChange,
  onMaxYearChange,
  onSearchSubmit,
  onOrderingChange,
  onYearApply,
  onLoadMore,
  emptyMessage,
  categoryId,
}: ItemsListContentProps) {
  return (
    <div>
      <Toolbar
        ordering={ordering}
        onOrderingChange={onOrderingChange}
        search={search}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        yearFilter={{
          minYear: minYearInput,
          maxYear: maxYearInput,
          onMinYearChange: onMinYearChange,
          onMaxYearChange: onMaxYearChange,
          onApply: onYearApply,
        }}
      />

      {items.length === 0 && emptyMessage ? (
        emptyMessage
      ) : (
        <section>
          <CardList>
            {items.map((item) => (
              <li key={item.set_num}>
                <SetCard item={item} source="categories" categoryId={categoryId} />
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
          onLoadMore={onLoadMore}
        >
          Hämta fler set
        </LoadMore>
      </section>
    </div>
  );
}
