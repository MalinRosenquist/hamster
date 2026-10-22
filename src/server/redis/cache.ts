import "server-only";
import { redis } from "./client";

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    if (!redis) return null;
    return (await redis.get<T>(key)) ?? null;
  } catch (error) {
    console.error(`Error occurred while fetching from cache: ${error}`);
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number) {
  try {
    if (!redis) return;
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error(`Error occurred while setting cache: ${error}`);
  }
}
