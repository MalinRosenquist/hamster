"use client";
import styles from "./SortSelect.module.scss";

export type SortOption = {
  label: string;
  value: string;
};

type SortProps = {
  value: string;
  options?: SortOption[];
  ariaLabel?: string;
  onChange: (value: string) => void;
};

const defaultOptions: SortOption[] = [
  { value: "", label: "Sortera" },
  { value: "-year", label: "Nyast" },
  { value: "year", label: "Äldst" },
  { value: "name", label: "A–Ö" },
  { value: "-name", label: "Ö–A" },
];

export default function SortSelect({
  value,
  options = defaultOptions,
  ariaLabel = "Sortera",
  onChange,
}: SortProps) {
  return (
    <>
      <select
        className={styles.sort}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  );
}
