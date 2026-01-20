import { TraderaAuctionsResponse } from "@/models/TraderaAuctionsResponse";
import "server-only";
import { REDIS_KEYS } from "../redis/keys";
import { cacheGet, cacheSet } from "../redis/cache";
import { canCallTraderaGlobal } from "../guards/traderaCallGuard";
import { TraderaAuction } from "@/models/TraderaAuction";
import { TraderaSearchItems } from "./traderaSoap";

const CACHE_TTL_SEC = 60 * 60 * 12;

export async function getTraderaAuctionsBySetNum(
  rawSetNum: string
): Promise<TraderaAuctionsResponse> {
  const setNum = rawSetNum.trim();
  const fetchedAt = new Date().toISOString();

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

  const items = await TraderaSearchItems(setNum);

  // Map raw Tradera SearchService items (parsed from SOAP XML) into internal model.
  // Keep the fields the UI needs and normalize types (strings -> numbers, optional fields -> undefined).
  // Skip invalid entries (missing id/title/url) to avoid rendering broken links.

  const auctions: TraderaAuction[] = items
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
      if (it.ThumbnailLink) {
        auction.thumbnailUrl = String(it.ThumbnailLink);
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
