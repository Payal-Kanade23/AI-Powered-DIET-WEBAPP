function getOffsetMilliseconds(date, timeZone) {
  const value = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value;
  const match = value?.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return (match[1] === "+" ? minutes : -minutes) * 60_000;
}

function dateParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

function zonedMidnightUtc({ year, month, day }, timeZone) {
  let utc = Date.UTC(year, month - 1, day);
  // Recalculate once so daylight-saving transitions use the offset at that date.
  utc = Date.UTC(year, month - 1, day) - getOffsetMilliseconds(new Date(utc), timeZone);
  utc = Date.UTC(year, month - 1, day) - getOffsetMilliseconds(new Date(utc), timeZone);
  return new Date(utc);
}

export function getLocalDayRange(timeZone = "UTC", now = new Date()) {
  try {
    const today = dateParts(now, timeZone);
    const start = zonedMidnightUtc(today, timeZone);
    const tomorrowParts = dateParts(new Date(start.getTime() + 36 * 60 * 60 * 1000), timeZone);
    const end = zonedMidnightUtc(tomorrowParts, timeZone);
    return { start, end, timeZone, date: `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}` };
  } catch {
    return getLocalDayRange("UTC", now);
  }
}

export const requestTimeZone = (req) => req.get("X-Timezone") || "UTC";
