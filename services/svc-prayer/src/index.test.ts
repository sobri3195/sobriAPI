import { describe, expect, it } from "vitest";
import { getPrayerSchedule } from "./index";

describe("svc-prayer", () => {
  it("returns the Jakarta reference schedule", async () => {
    await expect(getPrayerSchedule({ city: "jakarta", date: "2026-06-30" })).resolves.toMatchObject({ city: "jakarta", times: { dzuhur: "12:01" } });
  });
});
