import { z } from "zod";

export const RequestMetaSchema = z.object({
  request_id: z.string().startsWith("req_"),
  credits_used: z.number().int().nonnegative(),
  credits_remaining: z.number().int().nonnegative(),
});

export const ProblemSchema = z.object({
  type: z.string().url().default("https://docs.sobriapi.id/errors"),
  title: z.string(),
  status: z.number().int().min(400).max(599),
  detail: z.string(),
  code: z.string().startsWith("SOBRI_ERR_"),
  request_id: z.string().startsWith("req_"),
});

export type RequestMeta = z.infer<typeof RequestMetaSchema>;
export type Problem = z.infer<typeof ProblemSchema>;

export const PrayerScheduleQuerySchema = z.object({
  city: z.string().min(2).describe("Indonesian city name, for example jakarta"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("ISO calendar date"),
});

export const PrayerScheduleSchema = z.object({
  city: z.string(),
  date: z.string(),
  timezone: z.string(),
  source: z.enum(["kemenag-bimas-islam", "aladhan-fallback", "mock-reference"]),
  times: z.object({
    imsak: z.string(),
    subuh: z.string(),
    terbit: z.string(),
    dhuha: z.string(),
    dzuhur: z.string(),
    ashar: z.string(),
    maghrib: z.string(),
    isya: z.string(),
  }),
  qibla: z.object({ direction_degrees: z.number(), distance_km: z.number() }),
});

export type PrayerScheduleQuery = z.infer<typeof PrayerScheduleQuerySchema>;
export type PrayerSchedule = z.infer<typeof PrayerScheduleSchema>;

/** Wraps successful API data in the SobriAPI envelope. */
export function okResponse<T>(data: T, meta: RequestMeta): { ok: true; data: T; meta: RequestMeta } {
  return { ok: true, data, meta };
}

/** Builds an RFC 7807-compatible SobriAPI problem response body. */
export function problemResponse(input: Omit<Problem, "type"> & { type?: string }): Problem {
  return ProblemSchema.parse({ type: "https://docs.sobriapi.id/errors", ...input });
}

/** Creates a sortable request id suitable for logs and responses. */
export function createRequestId(now: Date = new Date()): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `req_${now.getTime().toString(36)}_${suffix}`;
}
