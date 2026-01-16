import { BuildSetItemsApiUrlParams } from "./models/BuildSetItemsApiUrlParams";

export function buildSetItemsApiUrl(params: BuildSetItemsApiUrlParams) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page));
  searchParams.set("page_size", String(params.pageSize));

  if (params.themeId != null) {
    searchParams.set("theme_id", String(params.themeId));
  }
  if (params.ordering) searchParams.set("ordering", params.ordering);
  if (params.search) searchParams.set("search", params.search);
  if (params.minYear) searchParams.set("min_year", params.minYear);
  if (params.maxYear) searchParams.set("max_year", params.maxYear);

  return `/api/rebrickable/setItems?${searchParams.toString()}`;
}
