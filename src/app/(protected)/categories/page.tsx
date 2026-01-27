import { getThemes, getThemeThumbnailCached } from "@/server/services/themeService";
import CategorySection from "./CategorySection";
import { Suspense } from "react";
import Spinner from "@/components/Spinner/Spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utforska",
};

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
      <section>
        <h1>Utforska</h1>
      </section>
      <Suspense
        fallback={
          <div>
            <Spinner size={"default"} />
          </div>
        }
      >
        <CategorySection initialCategories={themesWithThumbs} total={data.count} />
      </Suspense>
    </div>
  );
}
