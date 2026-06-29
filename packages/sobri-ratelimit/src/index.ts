export interface RateLimitDecision { readonly allowed: boolean; readonly remaining: number; readonly resetAt: Date; }

/** In-memory token bucket for local development; production adapter will use Upstash Redis. */
export class MemoryTokenBucket {
  private readonly buckets = new Map<string, { tokens: number; resetAt: number }>();
  public constructor(private readonly limit: number, private readonly windowMs: number) {}

  /** Consumes one token for a subject. */
  public consume(subject: string, now: Date = new Date()): RateLimitDecision {
    const current = now.getTime();
    const bucket = this.buckets.get(subject);
    const active = bucket && bucket.resetAt > current ? bucket : { tokens: this.limit, resetAt: current + this.windowMs };
    const allowed = active.tokens > 0;
    const tokens = allowed ? active.tokens - 1 : active.tokens;
    this.buckets.set(subject, { tokens, resetAt: active.resetAt });
    return { allowed, remaining: tokens, resetAt: new Date(active.resetAt) };
  }
}
