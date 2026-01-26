import "server-only";
import { ThemesResponse } from "@/models/RebrickableResponses";
import { get } from "./serviceBase";
import { Theme } from "@/models/Theme";
import { getSetItems } from "./setService";
import { unstable_cache } from "next/cache";
import { mockDataEnabled, readMockJson } from "./readMockJson";

const BASE_URL = "https://rebrickable.com/api/v3/lego/themes/";

export const getThemes = async (
  page = 1,
  pageSize = 10,
  ordering = ""
): Promise<ThemesResponse> => {
  if (mockDataEnabled()) {
    const mock = await readMockJson<{ count: number; results: Theme[] }>(
      "rebrickable/themes/mockThemes.json"
    );

    return {
      count: mock.count,
      next: null,
      previous: null,
      results: mock.results, // innehåller thumb om du har det i json
    };
  }

  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = new URL(BASE_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(pageSize));
  if (ordering) url.searchParams.set("ordering", ordering);

  return get<ThemesResponse>(url.toString(), {
    headers: { Authorization: `key ${key}` },
  });
};

// Get themethumbnail by fetching 1 set from the theme and using its set_img_url
export const getThemeThumbnail = async (themeId: number): Promise<string | null> => {
  if (mockDataEnabled()) return null;
  const sets = await getSetItems(1, 1, themeId, undefined, "-year");
  return sets.results[0]?.set_img_url ?? null;
};

// Cache theme thumbnails on server for 24h to save API calls
export const getThemeThumbnailCached = (themeId: number) =>
  unstable_cache(
    () => getThemeThumbnail(themeId),
    ["theme-thumb", String(themeId)],
    { revalidate: 60 * 60 * 24 } // 24 timmar
  )();

export const getThemeById = async (id: number): Promise<Theme> => {
  if (mockDataEnabled()) {
    const mock = await readMockJson<{ count: number; results: Theme[] }>(
      "rebrickable/themes/mockThemes.json"
    );
    const found = mock.results.find((t) => t.id === id);
    if (!found) throw new Error(`Theme ${id} not found in mockThemes.json`);
    return found;
  }

  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = `${BASE_URL}${id}/`;

  return get<Theme>(url, {
    headers: { Authorization: `key ${key}` },
  });
};
