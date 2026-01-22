import { Redis } from "@upstash/redis";
import "server-only";

/**
 * Redis client used across the server layer.
 * Redis.fromEnv() reads the env variables that Upstash provides:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

const url = process.env.UPSTASH_REDIS_REST_URL;

const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
