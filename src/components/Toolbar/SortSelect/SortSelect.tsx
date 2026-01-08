"use client";
import SortIcon from "@/components/Icons/SortIcon";
import styles from "./SortSelect.module.scss";
import { useDismissPopover } from "@/hooks/useDismissPopover";

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
  const { isOpen, setIsOpen, rootRef, triggerRef, onKeyDown } = useDismissPopover();

  return (
    <div className={styles.sortSelect} ref={rootRef} onKeyDown={onKeyDown}>
      <button
        className={styles.triggerButton}
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls="sortPanel"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Sortera
        <SortIcon aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.panel} id="sortPanel">
          <ul className={styles.list}>
            {options.map((opt) => (
              <li key={opt.value} className={styles.item}>
                <label className={styles.option}>
                  <input
                    className={styles.radio}
                    type="radio"
                    name="sort"
                    value={opt.value}
                    checked={opt.value === value}
                    onChange={() => {
                      onChange(opt.value);
                    }}
                  />
                  <span className={styles.optionLabel}>{opt.label}</span>
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
