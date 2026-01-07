"use client";
import styles from "./FilterSelect.module.scss";

export type FilterOption = {
  label: string;
  value: string;
};

type FilterProps = {
  value: string;
  options: FilterOption[];
  ariaLabel: string;
  onChange: (value: string) => void;
};

const defaultOptions: FilterOption[] = [
  { value: "", label: "Sortera" },
  { value: "-year", label: "Nyast" },
  { value: "year", label: "Äldst" },
  { value: "name", label: "A–Ö" },
  { value: "-name", label: "Ö–A" },
];

export default function FilterSelect({
  value,
  options = defaultOptions,
  ariaLabel = "Sortera",
  onChange = () => {},
}: FilterProps) {
  return (
    <>
      <select
        className={styles.filter}
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
