"use client";

import styles from "./Toolbar.module.scss";
import SearchBar from "./SearchInput/SearchInput";
import SortSelect from "./SortSelect/SortSelect";
import YearFilter from "./YearFilter/YearFilter";

type ToolbarProps = {
  ordering: string;
  onOrderingChange: (value: string) => void;

  search?: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;

  yearFilter?: {
    minYear: string;
    maxYear: string;
    onMinYearChange: (value: string) => void;
    onMaxYearChange: (value: string) => void;
    onApply: () => void;
  };
};

export default function Toolbar({
  ordering,
  onOrderingChange,
  search = "",
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  yearFilter,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <SearchBar
          value={search}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
        />
      </div>
      <div className={`${styles.row} ${styles.rowSortFilter}`}>
        {yearFilter && (
          <YearFilter
            minYear={yearFilter.minYear}
            maxYear={yearFilter.maxYear}
            onMinYearChange={yearFilter.onMinYearChange}
            onMaxYearChange={yearFilter.onMaxYearChange}
            onApply={yearFilter.onApply}
          />
        )}
        <SortSelect value={ordering} onChange={onOrderingChange} />
      </div>
    </div>
  );
}
