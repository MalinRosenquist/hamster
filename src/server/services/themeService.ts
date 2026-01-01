import "server-only";
import { SetListResponse } from "@/models/RebrickableResponses";
import { get } from "./serviceBase";
import { Theme } from "@/models/Theme";

const BASE_URL = "https://rebrickable.com/api/v3/lego/themes/";

export const getThemes = async (
  page = 1,
  pageSize = 10
): Promise<SetListResponse> => {
  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = new URL(BASE_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(pageSize));

  return get<SetListResponse>(url.toString(), {
    headers: { Authorization: `key ${key}` },
  });
};

export const getThemeById = async (id: number): Promise<Theme> => {
  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = `${BASE_URL}${id}/`;

  return get<Theme>(url, {
    headers: { Authorization: `key ${key}` },
  });
};
