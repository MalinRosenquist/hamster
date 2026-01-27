import { getThemeById } from "@/server/services/themeService";
import ItemsSection from "./ItemsSection";
import { getSetItems } from "@/server/services/setService";
import { Metadata } from "next";

type ThemeProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{
    ordering?: string;
    q?: string;
    min_year?: string;
    max_year?: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  const theme = await getThemeById(Number(categoryId));

  return {
    title: theme.name, // => "Temanamn | Hamster"
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: ThemeProps) {
  const { categoryId } = await params;
  const { ordering, q, min_year, max_year } = await searchParams;
  const initialOrdering = ordering ?? "";
  const initialSearch = (q ?? "").trim();
  const initialMinYear = min_year ?? "";
  const initialMaxYear = max_year ?? "";
  const theme = await getThemeById(Number(categoryId));
  const setsData = await getSetItems(
    1,
    10,
    theme.id,
    initialSearch || undefined,
    initialOrdering || undefined,
    initialMinYear ? Number(initialMinYear) : undefined,
    initialMaxYear ? Number(initialMaxYear) : undefined
  );

  return (
    <div className="container">
      <section>
        <h1>{theme.name}</h1>
      </section>

      <ItemsSection
        initialItems={setsData.results}
        total={setsData.count}
        themeId={theme.id}
        initialOrdering={initialOrdering}
        initialSearch={initialSearch}
        initialMinYear={initialMinYear}
        initialMaxYear={initialMaxYear}
      />
    </div>
  );
}
