import { getThemeById } from "@/server/services/themeService";
import ItemsSection from "./ItemsSection";
import { getSetItems } from "@/server/services/setService";

type ThemeProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ ordering?: string }>;
};

export default async function CategoryDetailPage({
  params,
  searchParams,
}: ThemeProps) {
  const { categoryId } = await params;
  const { ordering } = await searchParams;
  const theme = await getThemeById(Number(categoryId));
  const setsData = await getSetItems(1, 10, theme.id, undefined, ordering ?? "");

  return (
    <div className="container">
      <section>
        <h1>{theme.name}</h1>
      </section>

      <ItemsSection
        initialItems={setsData.results}
        total={setsData.count}
        themeId={theme.id}
        initialOrdering={ordering ?? ""}
      />
    </div>
  );
}
