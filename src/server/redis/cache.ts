import "server-only";
import { redis } from "./client";

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  return (await redis.get<T>(key)) ?? null;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number) {
  if (!redis) return;
  await redis.set(key, value, { ex: ttlSeconds });
}
