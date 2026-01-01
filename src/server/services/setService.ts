import "server-only";
import { SetListResponse } from "@/models/RebrickableResponses";
import { get } from "./serviceBase";
import { SetInfo } from "@/models/SetInfo";

const BASE_URL = "https://rebrickable.com/api/v3/lego/sets/";

export const getSetItems = async (
  page = 1,
  pageSize = 10,
  themeId?: number,
  search?: string
): Promise<SetListResponse> => {
  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = new URL(BASE_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(pageSize));

  // Include filters if provided
  if (themeId !== undefined) url.searchParams.set("theme_id", String(themeId));
  if (search) url.searchParams.set("search", search);

  return get<SetListResponse>(url.toString(), {
    headers: { Authorization: `key ${key}` },
  });
};

export const getSetBySetNum = async (setNum: string): Promise<SetInfo> => {
  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = `${BASE_URL}${setNum}/`;

  return get<SetInfo>(url, {
    headers: { Authorization: `key ${key}` },
  });
};
