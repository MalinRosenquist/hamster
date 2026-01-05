import "server-only";
import { ThemesResponse } from "@/models/RebrickableResponses";
import { get } from "./serviceBase";
import { Theme } from "@/models/Theme";
import { getSetItems } from "./setService";

const BASE_URL = "https://rebrickable.com/api/v3/lego/themes/";

export const getThemes = async (
  page = 1,
  pageSize = 10
): Promise<ThemesResponse> => {
  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = new URL(BASE_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(pageSize));

  return get<ThemesResponse>(url.toString(), {
    headers: { Authorization: `key ${key}` },
  });
};

// Get themethumbnail by fetching 1 set from the theme and using its set_img_url
export const getThemeThumbnail = async (themeId: number): Promise<string | null> => {
  const sets = await getSetItems(1, 1, themeId, undefined, "-year");
  return sets.results[0]?.set_img_url ?? null;
};

export const getThemeById = async (id: number): Promise<Theme> => {
  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = `${BASE_URL}${id}/`;

  return get<Theme>(url, {
    headers: { Authorization: `key ${key}` },
  });
};
