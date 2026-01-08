"use client";
import CloseIcon from "@/components/Icons/CloseIcon";
import FilterIcon from "@/components/Icons/FilterIcon";
import styles from "./YearFilter.module.scss";
import Button from "@/components/Buttons/Button/Button";
import { useEffect, useState, useRef } from "react";

type YearFilterProps = {
  minYear: string;
  maxYear: string;
  onMinYearChange: (value: string) => void;
  onMaxYearChange: (value: string) => void;
  onApply: () => void;
};

export default function YearFilter({
  minYear,
  maxYear,
  onMinYearChange,
  onMaxYearChange,
  onApply,
}: YearFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isYear = (value: string) => /^\d{4}$/.test(value.trim());
  const isEmpty = (value: string) => value.trim() === "";
  const [touched, setTouched] = useState(false);

  function getYearFilterError(minYear: string, maxYear: string) {
    const minEmpty = isEmpty(minYear);
    const maxEmpty = isEmpty(maxYear);

    const minValid = minEmpty || isYear(minYear);
    const maxValid = maxEmpty || isYear(maxYear);

    if (!minValid) return "Från-år måste vara 4 siffror";
    if (!maxValid) return "Till-år måste vara 4 siffror";

    const hasAny = isYear(minYear) || isYear(maxYear);
    if (!hasAny) return "Ange minst ett år";

    if (isYear(minYear) && isYear(maxYear) && Number(minYear) > Number(maxYear)) {
      return "Från-år kan inte vara större än Till-år";
    }

    return null;
  }

  const error = getYearFilterError(minYear, maxYear);
  const canApply = error === null;

  function handleApply() {
    onApply();
    setIsOpen(false);
  }

  function handleReset() {
    onMinYearChange("");
    onMaxYearChange("");
    onApply();
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    const onClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("touchstart", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("touchstart", onClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={styles.yearFilter}
      ref={rootRef}
      onKeyDown={(e) => {
        if (e.key === "Escape" && isOpen) {
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        className={styles.triggerButton}
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="year-filter-panel"
        onClick={() =>
          setIsOpen((prev) => {
            const next = !prev;
            if (next) setTouched(false);
            return next;
          })
        }
      >
        Filtrera
        <FilterIcon aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.panel} id="year-filter-panel">
          <div className={styles.title}>Utgivningsår</div>

          <div className={styles.inputs}>
            <label className={styles.label}>
              <span className={styles.labelText}>Från</span>
              <input
                autoFocus
                className={styles.input}
                type="number"
                placeholder="1960"
                value={minYear}
                onBlur={() => setTouched(true)}
                onChange={(e) => onMinYearChange(e.target.value)}
                inputMode="numeric"
              />
            </label>
            <label className={styles.label}>
              <span className={styles.labelText}>Till</span>
              <input
                className={styles.input}
                type="number"
                placeholder="2026"
                value={maxYear}
                onBlur={() => setTouched(true)}
                onChange={(e) => onMaxYearChange(e.target.value)}
                inputMode="numeric"
              />
            </label>

            {/* Display validation message */}
            {touched && error && (
              <p className={styles.error} role="status">
                {error}
              </p>
            )}

            <div className={styles.actions}>
              <button
                className={styles.resetButton}
                type="button"
                onClick={handleReset}
              >
                <CloseIcon aria-hidden="true" />
                <span className={styles.buttonTitle}>Rensa filter</span>
              </button>
              <Button
                variant="primary"
                type="button"
                aria-disabled={!canApply}
                disabled={!canApply}
                onClick={handleApply}
              >
                Filtrera
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
