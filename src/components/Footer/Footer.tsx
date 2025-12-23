import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <small>© 2024 Hamster</small>
      <small>
        Hamster är ett studentprojekt och är inte kopplat till LEGO®,
        Rebrickable eller Tradera.
      </small>
    </footer>
  );
}
