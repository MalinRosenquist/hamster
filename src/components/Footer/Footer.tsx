import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 id="footer-heading" className="srOnly">
        Sidfot
      </h2>
      <div className="container">
        <div className={styles.topGrid}>
          <div className={styles.colNav}>
            <h3 className={styles.colHeading}>Hamster</h3>
            <nav aria-label="Footernavigering">
              <ul>
                <li>
                  <Link href={"/"}>Hem</Link>
                </li>
                <li>
                  <Link href={"/categories"}>Utforska</Link>
                </li>
                <li>
                  <Link href={"/faq"}>FAQ</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className={styles.colInfo}>
            <h3 className={styles.infoHeading}>
              <span aria-hidden="true">ℹ️</span>
              Viktigt om din data
            </h3>
            <p>
              Dina samlingar och bevakningslistor sparas{" "}
              <strong>endast lokalt i den här webbläsaren</strong> på den här
              enheten.
            </p>
            <small className={styles.finePrint}>
              Om du byter enhet, använder privat läge eller rensar webbläsarens
              historik kommer dina listor att försvinna.
            </small>
          </div>

          <div className={styles.colAbout}>
            <h3 className={styles.colHeading}>Om projektet</h3>
            <p>
              Hamster är ett studentprojekt. Inte associerat med Rebrickable eller
              Tradera. LEGO® är ett varumärke som tillhör LEGO Group och webbplatsen
              är inte sponsrad, auktoriserad eller godkänd av LEGO Group.
            </p>

            <Link href={"/about"} className={styles.readMoreLink}>
              Läs mer om projektet →
            </Link>
          </div>
        </div>{" "}
        <div className={styles.bottom}>
          <small className={styles.copyright}>© 2026 Hamster</small>
        </div>
      </div>
    </footer>
  );
}
