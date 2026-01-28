import Image from "next/image";
import styles from "./page.module.scss";
import { ButtonLink } from "@/components/Buttons/Button/ButtonLink";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <Image
          src={"/images/hero_green3.webp"}
          alt="LEGO sets"
          fill
          priority
          sizes="100vw"
          className={styles.heroImg}
        />
        <div className={`container ${styles.content}`}>
          <h1>Välkommen till Hamster</h1>
          <p>Samla och bevaka på ett ställe</p>
        </div>
      </section>

      <section className={styles.cards}>
        <div className={styles.card}>
          <h2>Utforska set</h2>
          <p>Bläddra bland LEGO och lägg till i din egna samling.</p>
          <ButtonLink href="/categories" variant="primary" className={styles.button}>
            Utforska set
          </ButtonLink>
        </div>
        <div className={styles.card}>
          <h2>bevaka</h2>
          <p>Bevaka LEGO set och håll koll på nya annonser</p>
          <ButtonLink
            href="/watchlist"
            variant="secondary"
            className={styles.button}
          >
            Hantera bevakningar
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
