import { getThemes, getThemeThumbnailCached } from "@/server/services/themeService";
import styles from "./Categories.module.scss";
import CategorySection from "./CategorySection";

export default async function CategoriesPage() {
  const data = await getThemes(1, 10);

  const themesWithThumbs = await Promise.all(
    data.results.map(async (theme) => ({
      ...theme,
      thumb: await getThemeThumbnailCached(theme.id),
    }))
  );

  return (
    <div className="container">
      <section className={styles.top}>
        <h1>Utforska</h1>
      </section>

      <CategorySection initialCategories={themesWithThumbs} total={data.count} />
    </div>
  );
}
