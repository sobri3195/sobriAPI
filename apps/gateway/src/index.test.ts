import { describe, expect, it } from "vitest";
import { app } from "./index";

const key = "sk_sobri_test_123456789012";

describe("gateway", () => {
  it("serves healthz", async () => {
    const res = await app.request("/healthz");
    expect(res.status).toBe(200);
  });

  it("requires an api key", async () => {
    const res = await app.request("/v1/prayer/schedule?city=jakarta&date=2026-06-30");
    expect(res.status).toBe(401);
  });

  it("serves prayer schedule", async () => {
    const res = await app.request("/v1/prayer/schedule?city=jakarta&date=2026-06-30", { headers: { "X-Sobri-Key": key } });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ ok: true, data: { city: "jakarta" } });
  });
});
