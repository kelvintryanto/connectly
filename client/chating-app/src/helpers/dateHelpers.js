// src/helpers/timeUtils.js
export function formatRelativeTime(dateString) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const then = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - then) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(months / 12);

  if (Math.abs(years) > 0) return rtf.format(-years, "year");
  if (Math.abs(months) > 0) return rtf.format(-months, "month");
  if (Math.abs(days) > 0) return rtf.format(-days, "day");
  if (Math.abs(hours) > 0) return rtf.format(-hours, "hour");
  if (Math.abs(minutes) > 0) return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
}
