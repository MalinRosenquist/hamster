export type TraderaRateLimitResult = {
  success?: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
};
