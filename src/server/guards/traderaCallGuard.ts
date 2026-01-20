import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../redis/client";
import { TraderaRateLimitResult } from "@/models/TraderaRateLimitResult";

const ratelimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(1, "24 h") })
  : null;

export async function canCallTraderaGlobal(): Promise<TraderaRateLimitResult> {
  if (!ratelimit) {
    return { success: true };
  }

  const res = await ratelimit.limit("tradera:global");

  return {
    success: res.success,
    limit: res.limit,
    remaining: res.remaining,
    reset: res.reset,
  };
}
