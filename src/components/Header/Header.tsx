import styles from "./Header.module.scss";
import Image from "next/image";

export default function Header() {
  return (
    <header className={styles.header}>
      <Image
        src="/brand/hamster_logo.png"
        alt="Hamster Logo"
        width={95}
        height={95}
      />
      <span className={`${styles.logoName} logoName`}>Hamster App</span>
    </header>
  );
}
