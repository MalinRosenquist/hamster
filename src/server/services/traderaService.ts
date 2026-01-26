import { TraderaAuctionsResponse } from "@/models/TraderaAuctionsResponse";
import "server-only";
import { REDIS_KEYS } from "../redis/keys";
import { cacheGet, cacheSet } from "../redis/cache";
import { canCallTraderaGlobal } from "../guards/traderaCallGuard";
import { TraderaAuction } from "@/models/TraderaAuction";
import { traderaSearchItems } from "./traderaSoap";
import { TraderaSearchItem } from "@/models/TraderaSearchItem";
import { mockDataEnabled, readMockJson } from "./readMockJson";

const CACHE_TTL_SEC = 60 * 60 * 12;

// Escape special characters for use in RegExp
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Check if the given title or description matches the set number.
function matchSetNumber(title: string, setNum: string): boolean {
  const full = setNum.trim();
  const base = full.split("-")[0]?.trim() ?? full;

  // Match either the full set number or the base number (e.g "8009-1" or "8009")
  // Should not match pattern inside a longer number (e.g "8009" should not match "18009")
  const fullPattern = new RegExp(`\\b${escapeRegExp(full)}\\b`, "i");
  const basePattern = new RegExp(`\\b${escapeRegExp(base)}\\b`, "i");
  return fullPattern.test(title) || basePattern.test(title);
}

/**
 * Picks the best available image URL for an item.
 * Tradera provides multiple formats; we prefer "normal" (largest), then "gallery"/"medium",
 * then "thumb", and finally fall back to ThumbnailLink.
 */
function pickBestImageUrl(item: TraderaSearchItem): string | undefined {
  const links = item.ImageLinks?.ImageLink;
  const arr = Array.isArray(links) ? links : links ? [links] : [];

  // 1) Best: highest resolution
  const normal = arr.find((l) => l.Format === "normal")?.Url;
  if (normal) return normal;

  // 2) Next best
  const galleryOrMedium = arr.find(
    (l) => l.Format === "gallery" || l.Format === "medium"
  )?.Url;
  if (galleryOrMedium) return galleryOrMedium;

  // 3) Low-res fallback
  const thumb = arr.find((l) => l.Format === "thumb")?.Url;

  // 4) Final fallback from Tradera
  const fallback = thumb ?? item.ThumbnailLink;
  if (!fallback) return undefined;

  // If fallback is a thumbs-ish URL, try to upgrade it to the larger "images" version.
  return item.ThumbnailLink;
}

export async function getTraderaAuctionsBySetNum(
  rawSetNum: string
): Promise<TraderaAuctionsResponse> {
  const setNum = rawSetNum.trim();
  const fetchedAt = new Date().toISOString();
  console.log("[TRADERA]", { mock: mockDataEnabled(), setNum });

  if (mockDataEnabled()) {
    if (!setNum) {
      return {
        status: "no_results",
        cached: false,
        fetchedAt,
        setNum,
        auctions: [],
      };
    }

    try {
      return await readMockJson<TraderaAuctionsResponse>(`tradera/${setNum}.json`);
    } catch {
      return {
        status: "no_results",
        cached: false,
        fetchedAt,
        setNum,
        auctions: [],
        message: `Missing mock file for Tradera: ${setNum}`,
      };
    }
  }

  // Empty input should not trigger cache reads, rate limiting, or external calls.
  if (!setNum) {
    return {
      status: "no_results",
      cached: false,
      fetchedAt,
      setNum,
      auctions: [],
    };
  }

  // Cache check: if we already have results for this set number,
  // return them immediately and do NOT call Tradera.
  const key = REDIS_KEYS.traderaAuctions(setNum);
  const cached = await cacheGet<TraderaAuctionsResponse>(key);

  if (cached) {
    // Mark as cached so the UI can display "from cache".
    return { ...cached, cached: true };
  }

  // Rate limit check before any external call.
  // If we are out of allowed calls, return data so the UI can show a retry timer.
  const rateLimitResult = await canCallTraderaGlobal();

  if (!rateLimitResult.success) {
    const now = Date.now();
    const retryAfterSeconds =
      typeof rateLimitResult.reset === "number"
        ? Math.max(1, Math.ceil((rateLimitResult.reset - now) / 1000))
        : undefined;

    return {
      status: "rate_limited",
      cached: false,
      fetchedAt,
      setNum,
      auctions: [],
      message: "Tradera-anrop är tillfälligt begränsade. Försök igen senare",
      retryAfterSeconds,
      rateLimitResetAt:
        typeof rateLimitResult.reset === "number"
          ? new Date(rateLimitResult.reset).toISOString()
          : undefined,
      rateLimitRemaingin: rateLimitResult.remaining,
    };
  }

  const items = await traderaSearchItems(setNum);

  // Filter items to only those matching the set number in title or description
  const filteredItems = items.filter((it) => {
    const haystack = `${it.ShortDescription ?? ""} ${it.LongDescription ?? ""}`;
    return matchSetNumber(haystack, setNum);
  });

  // Map raw Tradera SearchService items (parsed from SOAP XML) into internal model.
  // Keep the fields the UI needs and normalize types (strings -> numbers, optional fields -> undefined).
  // Skip invalid entries (missing id/title/url) to avoid rendering broken links.
  const auctions: TraderaAuction[] = filteredItems
    .map((it) => {
      const id = it.Id != null ? String(it.Id) : "";
      const title = it.ShortDescription ?? "";
      const url = it.ItemUrl ?? "";

      if (!id || !title || !url) return null;

      const maxBid = it.MaxBid != null ? Number(it.MaxBid) : undefined;
      const buyItNowPrice =
        it.BuyItNowPrice != null ? Number(it.BuyItNowPrice) : undefined;

      const auction: TraderaAuction = {
        id,
        title,
        url,
        endDate: it.EndDate ? String(it.EndDate) : undefined,
        buyItNowPrice,
        maxBid,
        price: maxBid ?? buyItNowPrice,
      };

      // Only add thumbnailUrl if we actually have one
      const imageUrl = pickBestImageUrl(it);

      if (imageUrl) {
        auction.thumbnailUrl = imageUrl;
      }

      return auction;
    })
    .filter((a): a is TraderaAuction => a !== null);

  // Build response and cache it (including empty results) to avoid repeated API calls.
  const result: TraderaAuctionsResponse = {
    status: auctions.length > 0 ? "ok" : "no_results",
    cached: false,
    fetchedAt,
    setNum,
    auctions,
  };

  await cacheSet(key, result, CACHE_TTL_SEC);

  return result;
}
