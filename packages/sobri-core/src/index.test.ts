import { describe, expect, it } from "vitest";
import { createRequestId, okResponse, problemResponse } from "./index";

describe("sobri-core envelopes", () => {
  it("creates success envelopes", () => {
    expect(okResponse({ hello: "sobri" }, { request_id: "req_1", credits_used: 1, credits_remaining: 999 })).toMatchObject({ ok: true });
  });

  it("creates problem responses", () => {
    expect(problemResponse({ title: "Unauthorized", status: 401, detail: "Missing key", code: "SOBRI_ERR_UNAUTHORIZED", request_id: "req_1" }).status).toBe(401);
  });

  it("creates request ids", () => {
    expect(createRequestId(new Date("2026-06-29T00:00:00Z"))).toMatch(/^req_/);
  });
});
