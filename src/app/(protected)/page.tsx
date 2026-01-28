import Image from "next/image";
import styles from "./page.module.scss";
import HomeClient from "./HomeClient";

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
      </section>

      <HomeClient />
    </>
  );
}
