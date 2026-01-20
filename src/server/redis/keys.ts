export const REDIS_KEYS = {
  traderaAuctions: (setNum: string) => `tradera:auctions:${setNum}`,
  traderaRateLimitGlobal: "tradera:global",
} as const;
