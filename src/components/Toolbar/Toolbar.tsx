"use client";

import SearchBar from "./SearchInput/SearchInput";
import SortSelect from "./SortSelect/SortSelect";

type ToolBarProps = {
  ordering: string;
  onOrderingChange: (value: string) => void;

  search?: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
};

export default function ToolBar({
  ordering,
  onOrderingChange,
  search = "",
  onSearchChange = () => {},
  onSearchSubmit = () => {},
}: ToolBarProps) {
  return (
    <>
      <SearchBar
        value={search}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
      />
      <SortSelect value={ordering} onChange={onOrderingChange} />
    </>
  );
}
