import "server-only";
import { SetListResponse } from "@/models/RebrickableResponses";
import { get } from "./serviceBase";
import { SetInfo } from "@/models/SetInfo";
import { mockDataEnabled, readMockJson } from "./readMockJson";

const BASE_URL = "https://rebrickable.com/api/v3/lego/sets/";

/**
 * In-memory cache, process-local (RAM). Restarting the server clears it.
 * - Watchlist/collection can trigger many "fetch by id" requests in a short time.
 * - Rebrickable rate-limits (HTTP 429). Caching reduces repeated upstream calls.
 */
type SetByNumCacheEntry = { data: SetInfo; expiresAt: number };
const setByNumCache = new Map<string, SetByNumCacheEntry>();
const SET_BY_NUM_TTL_MS = 5 * 60_000;

export const getSetItems = async (
  page = 1,
  pageSize = 10,
  themeId?: number,
  search?: string,
  ordering?: string,
  minYear?: number,
  maxYear?: number,
  minParts?: number,
  maxParts?: number
): Promise<SetListResponse> => {
  if (mockDataEnabled()) {
    if (typeof themeId === "number") {
      const mock = await readMockJson<SetListResponse>(
        `rebrickable/setItems/theme-${themeId}.json`
      );

      // (valfritt men bra) stöd för sök i mockläge:
      if (search) {
        const q = search.toLowerCase();
        const filtered = mock.results.filter((s) =>
          s.name.toLowerCase().includes(q)
        );
        return { ...mock, count: filtered.length, results: filtered };
      }

      return mock;
    }

    if (search) {
      const mock = await readMockJson<SetListResponse>(
        `rebrickable/setItems/all.json`
      );

      const q = search.toLowerCase();
      const filtered = mock.results.filter((s) => s.name.toLowerCase().includes(q));

      return { ...mock, count: filtered.length, results: filtered };
    }

    return { count: 0, next: null, previous: null, results: [] };
  }

  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const url = new URL(BASE_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(pageSize));

  // Include filters if provided
  if (themeId !== undefined) url.searchParams.set("theme_id", String(themeId));
  if (search) url.searchParams.set("search", search);
  if (ordering) url.searchParams.set("ordering", ordering);
  if (minYear) url.searchParams.set("min_year", String(minYear));
  if (maxYear) url.searchParams.set("max_year", String(maxYear));
  if (minParts) url.searchParams.set("min_parts", String(minParts));
  if (maxParts) url.searchParams.set("max_parts", String(maxParts));

  return get<SetListResponse>(url.toString(), {
    headers: { Authorization: `key ${key}` },
  });
};

export const getSetBySetNum = async (setNum: string): Promise<SetInfo> => {
  if (mockDataEnabled()) {
    return readMockJson<SetInfo>(`rebrickable/setItems/${setNum}.json`);
  }

  const key = process.env.REBRICKABLE_API_KEY;
  if (!key) throw new Error("REBRICKABLE_API_KEY is missing");

  const now = Date.now();
  const cached = setByNumCache.get(setNum);

  // Return stored data it still valid
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const url = `${BASE_URL}${setNum}/`;

  const data = await get<SetInfo>(url, {
    headers: { Authorization: `key ${key}` },
  });

  // Store in cache with expiration timestamp
  setByNumCache.set(setNum, { data, expiresAt: now + SET_BY_NUM_TTL_MS });

  return data;
};
