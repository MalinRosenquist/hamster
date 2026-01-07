import Image from "next/image";
import styles from "./SearchBar.module.scss";

export default function SearchBar() {
  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Sök på namn eller nummer"
          />
          <button className={styles.searchButton}>
            <span className={styles.searchIcon} aria-hidden="true">
              <Image src="/icons/search.svg" alt="" width={30} height={30} />
            </span>
            <span>Sök</span>
          </button>
        </div>
      </div>
    </>
  );
}
