import Image from "next/image";
import styles from "./SearchBar.module.scss";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  ariaLabel?: string;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Sök",
  ariaLabel = "Sök",
}: SearchInputProps) {
  return (
    <>
      <div className={styles.wrap}>
        <form
          className={styles.search}
          onSubmit={(e) => {
            e.preventDefault();
            if (!value.trim()) return;
            onSubmit();
          }}
        >
          <input
            className={styles.searchInput}
            type="search"
            placeholder={placeholder}
            aria-label={ariaLabel}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <button className={styles.searchButton} type="submit">
            <span className={styles.searchIcon} aria-hidden="true">
              <Image src="/icons/search.svg" alt="" width={30} height={30} />
            </span>
            <span>Sök</span>
          </button>
        </form>
      </div>
    </>
  );
}
