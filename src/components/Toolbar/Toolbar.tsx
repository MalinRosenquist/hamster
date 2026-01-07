"use client";

import SearchBar from "./SearchInput/SearchInput";
import SortSelect from "./SortSelect/SortSelect";
import YearFilter from "./YearFilter/YearFilter";

type ToolBarProps = {
  ordering: string;
  onOrderingChange: (value: string) => void;

  search?: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;

  minYear?: string;
  maxYear?: string;
  onMinYearChange?: (value: string) => void;
  onMaxYearChange?: (value: string) => void;
  onYearApply: () => void;
};

export default function ToolBar({
  ordering,
  onOrderingChange,
  search = "",
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  minYear = "",
  maxYear = "",
  onMinYearChange = () => {},
  onMaxYearChange = () => {},
  onYearApply = () => {},
}: ToolBarProps) {
  return (
    <>
      <SearchBar
        value={search}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
      />
      <SortSelect value={ordering} onChange={onOrderingChange} />
      <YearFilter
        minYear={minYear}
        maxYear={maxYear}
        onMinYearChange={onMinYearChange}
        onMaxYearChange={onMaxYearChange}
        onApply={onYearApply}
      />
    </>
  );
}
