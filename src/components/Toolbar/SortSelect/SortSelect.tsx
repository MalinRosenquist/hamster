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
        <span className={styles.iconWrapper}>
          <SortIcon className={styles.sortIcon} aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className={styles.panel} id="sortPanel">
          <ul className={styles.list}>
            {options.map((opt) => {
              const selected = opt.value === value;

              return (
                <li key={opt.value} className={styles.item}>
                  <button
                    type="button"
                    className={styles.option}
                    aria-pressed={selected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      triggerRef.current?.focus();
                    }}
                  >
                    <span className={styles.optionLabel}>{opt.label}</span>
                    <span className={styles.check} aria-hidden="true">
                      ✓
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
