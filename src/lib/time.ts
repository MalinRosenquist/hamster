export function formatDurationSv(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "0 min";
  }

  const minutesTotal = Math.ceil(totalSeconds / 60);

  if (minutesTotal < 1) return "mindre än 1 min";

  const hours = Math.floor(minutesTotal / 60);
  const minutes = minutesTotal % 60;

  if (hours <= 0) {
    return `${minutesTotal} min`;
  }

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}
