# SobriAPI (sobri-data-hub)

**One key, all Indonesian data.**

SobriAPI is a Turborepo + pnpm workspace monorepo for a Data-as-a-Service platform exposing Indonesian-focused APIs through a unified Hono gateway.

## Proposed file tree

- `apps/gateway` — Hono API gateway with API-key auth, rate limiting, OpenAPI, and `GET /v1/prayer/schedule`.
- `apps/dashboard` — Next.js dashboard placeholder.
- `apps/docs` — docs quickstart placeholder.
- `services/svc-prayer` — reference prayer schedule implementation.
- `services/svc-*` — service stubs with source/legal/credit placeholders.
- `packages/sobri-core` — shared envelopes, schemas, errors, request IDs.
- `packages/sobri-auth` — Sobri API key parsing and extraction.
- `packages/sobri-ratelimit` — local token bucket, ready for Upstash adapter.

## Reference request

```bash
curl -H 'X-Sobri-Key: sk_sobri_test_123456789012' \
  'http://localhost:8787/v1/prayer/schedule?city=jakarta&date=2026-06-30'
```
