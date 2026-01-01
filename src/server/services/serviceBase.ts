import "server-only";

/**
 * Generic GET helper for server-side fetch.
 * Supports typing via <T>
 * Accepts optional RequestInit (headers, cache)
 * Throws a readable error on non-2xx responses
 */

export const get = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${message || response.statusText}`);
  }

  return (await response.json()) as T;
};
