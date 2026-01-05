import { getThemes } from "@/server/services/themeService";
import styles from "./Categories.module.scss";
import { getThemeThumbnail } from "@/server/services/themeService";
import Image from "next/image";

const data = await getThemes(1, 10);

const themesWithThumbs = await Promise.all(
  data.results.map(async (theme) => ({
    ...theme,
    thumb: await getThemeThumbnail(theme.id),
  }))
);

export default function CategoriesPage() {
  return (
    <div className="container">
      <section className={styles.top}>
        <h1>Utforska</h1>
      </section>

      <section className={styles.listWrapper}>
        <ul className={styles.grid}>
          {themesWithThumbs.map((theme) => (
            <li key={theme.id} className={styles.item}>
              <div className={styles.card}>
                <div className={styles.imgContainer}>
                  {theme.thumb ? (
                    <Image
                      src={theme.thumb}
                      alt=""
                      fill
                      sizes="180"
                      className={styles.thumb}
                      aria-hidden="true"
                    />
                  ) : (
                    <Image
                      src="/icons/no_photo.svg"
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <span className={styles.title}>{theme.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
