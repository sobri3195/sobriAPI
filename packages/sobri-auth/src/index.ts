export type SobriKeyMode = "live" | "test";

export interface ParsedApiKey { readonly raw: string; readonly mode: SobriKeyMode; }

/** Extracts a SobriAPI key from Authorization bearer or X-Sobri-Key headers. */
export function extractApiKey(headers: Headers): string | null {
  const bearer = headers.get("authorization");
  if (bearer?.toLowerCase().startsWith("bearer ")) return bearer.slice(7).trim();
  return headers.get("x-sobri-key");
}

/** Validates SobriAPI key shape and returns its mode. */
export function parseApiKey(raw: string): ParsedApiKey | null {
  if (/^sk_sobri_live_[A-Za-z0-9]{12,}$/.test(raw)) return { raw, mode: "live" };
  if (/^sk_sobri_test_[A-Za-z0-9]{12,}$/.test(raw)) return { raw, mode: "test" };
  return null;
}
