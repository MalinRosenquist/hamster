import { TraderaAuction } from "./TraderaAuction";

export type TraderaAuctionsResponse = {
  status: "ok" | "no_results" | "rate_limited";
  cached: boolean;
  fetchedAt: string;
  setNum: string;
  auctions: TraderaAuction[];
  message?: string;
  retryAfterSeconds?: number;
  rateLimitResetAt?: string;
  rateLimitRemaingin?: number;
};
