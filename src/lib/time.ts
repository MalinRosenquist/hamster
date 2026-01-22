/**
 * Formats a duration given in seconds into a Swedish short string.
 */
export function formatDurationSv(totalSeconds: number): string {
  // Guard against NaN/Infinity and negative values
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "0 min";
  }

  const minutesTotal = Math.floor(totalSeconds / 60);
  if (minutesTotal < 1) return "mindre än 1 min";

  const days = Math.floor(minutesTotal / (60 * 24));
  const hours = Math.floor((minutesTotal % (60 * 24)) / 60);
  const minutes = minutesTotal % 60;

  if (days > 0) {
    if (hours === 0) return `${days} d`;
    return `${days} d ${hours} h`;
  }

  if (hours > 0) {
    if (minutes === 0) return `${hours} h`;
    return `${hours} h ${minutes} min`;
  }

  if (totalSeconds < 60) return "mindre än 1 min";

  return `${minutesTotal} min`;
}

/**
 * Returns the number of whole seconds between two ISO timestamps.
 * endIso = end of auction
 * nowIso = current time
 * Pass `nowIso` from the server (`fetchedAt`) to keep rendering pure and stable,
 * avoiding `Date.now()` during React render.
 */
export function secondsBetweenIso(endIso: string, nowIso: string): number {
  const ms = new Date(endIso).getTime() - new Date(nowIso).getTime();
  return Math.max(0, Math.floor(ms / 1000));
}

/**
 * Builds a Swedish label for an auction end time.
 *
 * - If the remaining time is >= threshold (default: 24h), show both:
 *   "Slutar YYYY-MM-DD HH:MM (Xd Yh)"
 * - Otherwise show countdown only:
 *   "Slutar om Xh Y min"
 */
export function formatAuctionEndTime(params: {
  endIso: string;
  nowIso: string;
  thresholdSeconds?: number;
}): { text: string; mode: "countdown" | "date+countdown" } {
  const threshold = params.thresholdSeconds ?? 60 * 60 * 24;

  const secondsLeft = secondsBetweenIso(params.endIso, params.nowIso);
  const countdownText = formatDurationSv(secondsLeft);

  const endDateText = new Date(params.endIso).toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (secondsLeft >= threshold) {
    return {
      mode: "date+countdown",
      text: `Slutar ${endDateText} (${countdownText})`,
    };
  }

  return {
    mode: "countdown",
    text: `Slutar om ${countdownText}`,
  };
}
