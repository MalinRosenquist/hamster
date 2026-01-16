import { getSetItems } from "@/server/services/setService";
import { redirect } from "next/navigation";
import SearchListView from "./SearchListView";

const PAGE_SIZE = 24;

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    ordering?: string;
    min_year?: string;
    max_year?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const q = (params?.q ?? "").trim();
  if (!q) redirect("/categories");

  const page = Math.max(1, Number(params?.page ?? "1") || 1);
  const ordering = params?.ordering ?? "-year";
  const minYear = params?.min_year ?? "";
  const maxYear = params?.max_year ?? "";

  const minYearNum = Number(minYear);
  const maxYearNum = Number(maxYear);

  const data = await getSetItems(
    page,
    PAGE_SIZE,
    undefined,
    q,
    ordering || undefined,
    Number.isFinite(minYearNum) ? minYearNum : undefined,
    Number.isFinite(maxYearNum) ? maxYearNum : undefined
  );

  return (
    <div className="container">
      <h1>Sökresultat</h1>

      <SearchListView
        initialQuery={q}
        initialOrdering={ordering}
        initialMinYear={minYear}
        initialMaxYear={maxYear}
        initialItems={data.results}
        initialTotal={data.count}
        initialPage={page}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
