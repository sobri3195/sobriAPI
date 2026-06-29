import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { extractApiKey, parseApiKey } from "@sobriapi/auth";
import { createRequestId, okResponse, PrayerScheduleQuerySchema, PrayerScheduleSchema, problemResponse } from "@sobriapi/core";
import { MemoryTokenBucket } from "@sobriapi/ratelimit";
import { getPrayerSchedule } from "@sobriapi/svc-prayer";

const limiter = new MemoryTokenBucket(10, 60_000);

export const app = new OpenAPIHono();

app.use("/v1/*", async (c, next) => {
  const requestId = createRequestId();
  c.set("requestId", requestId);
  const parsed = parseApiKey(extractApiKey(c.req.raw.headers) ?? "");
  if (!parsed) return c.json(problemResponse({ title: "Unauthorized", status: 401, detail: "Missing or invalid SobriAPI key", code: "SOBRI_ERR_UNAUTHORIZED", request_id: requestId }), 401);
  const decision = limiter.consume(parsed.raw);
  if (!decision.allowed) return c.json(problemResponse({ title: "Rate limit exceeded", status: 429, detail: "Too many requests", code: "SOBRI_ERR_RATE_LIMITED", request_id: requestId }), 429);
  c.set("creditsRemaining", decision.remaining);
  await next();
});

app.get("/healthz", (c) => c.json({ ok: true, service: "gateway" }));

const scheduleRoute = createRoute({
  method: "get",
  path: "/v1/prayer/schedule",
  request: { query: PrayerScheduleQuerySchema },
  responses: {
    200: { description: "Prayer schedule", content: { "application/json": { schema: z.object({ ok: z.literal(true), data: PrayerScheduleSchema, meta: z.object({ request_id: z.string(), credits_used: z.number(), credits_remaining: z.number() }) }) } } },
  },
});

app.openapi(scheduleRoute, async (c) => {
  const data = await getPrayerSchedule(c.req.valid("query"));
  return c.json(okResponse(data, { request_id: c.get("requestId"), credits_used: 1, credits_remaining: c.get("creditsRemaining") }));
});

app.doc("/openapi.json", { openapi: "3.1.0", info: { title: "SobriAPI Gateway", version: "0.1.0" } });

export default app;
