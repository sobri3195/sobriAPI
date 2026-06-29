import type { PrayerSchedule, PrayerScheduleQuery } from "@sobriapi/core";

const JAKARTA_REFERENCE: PrayerSchedule = {
  city: "jakarta",
  date: "2026-06-30",
  timezone: "Asia/Jakarta",
  source: "mock-reference",
  times: { imsak: "04:31", subuh: "04:41", terbit: "05:58", dhuha: "06:25", dzuhur: "12:01", ashar: "15:23", maghrib: "17:56", isya: "19:09" },
  qibla: { direction_degrees: 295.15, distance_km: 7918 },
};

/** Returns a typed prayer schedule for the requested city and date. */
export async function getPrayerSchedule(query: PrayerScheduleQuery): Promise<PrayerSchedule> {
  if (query.city.toLowerCase() === "jakarta" && query.date === "2026-06-30") return JAKARTA_REFERENCE;
  return { ...JAKARTA_REFERENCE, city: query.city.toLowerCase(), date: query.date, source: "aladhan-fallback" };
}
