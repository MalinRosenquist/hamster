"use client";
import CloseIcon from "@/components/Icons/CloseIcon";
import styles from "./YearFilter.module.scss";
import Button from "@/components/Buttons/Button/Button";

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
  return (
    <div>
      <input
        type="number"
        placeholder="Från år"
        value={minYear}
        onChange={(e) => onMinYearChange(e.target.value)}
        inputMode="numeric"
      />
      <input
        type="number"
        placeholder="Till år"
        value={maxYear}
        onChange={(e) => onMaxYearChange(e.target.value)}
        inputMode="numeric"
      />
      <div className={styles.actions}>
        <Button variant="primary" type="button" onClick={onApply}>
          Filtrera
        </Button>
        <button className={styles.resetButton}>
          <CloseIcon aria-hidden="true" />
          <span className={styles.buttonTitle}>Rensa filter</span>
        </button>
      </div>
    </div>
  );
}
