"use client";

import FilterSelect from "./FilterSelect/FilterSelect";
import SearchBar from "./SearchInput/SearchInput";
import SortSelect from "./SortSelect/SortSelect";

type ToolBarProps = {
  ordering: string;
  onOrderingChange: (value: string) => void;
};

export default function ToolBar({ ordering, onOrderingChange }: ToolBarProps) {
  return (
    <>
      <SearchBar />
      <SortSelect value={ordering} onChange={onOrderingChange} />
      <FilterSelect />
    </>
  );
}
