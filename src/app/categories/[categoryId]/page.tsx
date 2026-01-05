import { getThemeById } from "@/server/services/themeService";
import ItemsSection from "./ItemsSection";
import { getSetItems } from "@/server/services/setService";

type ThemeProps = {
  params: { categoryId: string };
};

export default async function CategoryDetailPage({ params }: ThemeProps) {
  const { categoryId } = await params;
  const theme = await getThemeById(Number(categoryId));
  const setsData = await getSetItems(1, 10, theme.id);

  return (
    <div className="container">
      <section>
        <h1>{theme.name}</h1>
      </section>

      <ItemsSection
        initialItems={setsData.results}
        total={setsData.count}
        themeId={theme.id}
      />
    </div>
  );
}
