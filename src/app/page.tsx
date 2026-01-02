import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/Buttons/Button";
import Link from "next/link";

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
          <Button variant="primary" className="">
            <Link href="/categories">Utforska set</Link>
          </Button>
        </div>
        <div className={styles.card}>
          <h2>bevaka</h2>
          <p>Bevaka LEGO set och håll koll på nya annonser</p>
          <Button variant="secondary" className={styles.button}>
            <Link href="/watchlist">Hantera bevakningar</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
