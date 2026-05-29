import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// No-op limiter used when Upstash env vars are absent (local development).
// Exposes the same async .limit() interface as a real Upstash Ratelimit.
// ---------------------------------------------------------------------------
const noopLimiter = {
  async limit(_identifier: string): Promise<{ success: boolean }> {
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Factory — returns a real Ratelimit if env vars are present, otherwise
// returns the no-op limiter so the app runs cleanly in local dev.
// ---------------------------------------------------------------------------
function createLimiter(
  limiterFactory: (redis: Redis) => Ratelimit
): { limit: (id: string) => Promise<{ success: boolean }> } {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Graceful degradation: no-op in dev / CI where Upstash is not configured
    return noopLimiter;
  }

  const redis = new Redis({ url, token });
  return limiterFactory(redis);
}

// ---------------------------------------------------------------------------
// checkoutLimiter — 5 requests per 10 minutes (sliding window)
// Used on POST /api/checkout to prevent cart-abuse / enumeration attacks.
// ---------------------------------------------------------------------------
export const checkoutLimiter = createLimiter(
  (redis) =>
    new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: false,
      prefix: "azahara:checkout",
    })
);

// ---------------------------------------------------------------------------
// adminLimiter — 30 requests per minute (sliding window)
// Used on /api/admin/* routes to prevent brute-force against admin endpoints.
// ---------------------------------------------------------------------------
export const adminLimiter = createLimiter(
  (redis) =>
    new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: false,
      prefix: "azahara:admin",
    })
);

// ---------------------------------------------------------------------------
// Best-effort client IP from request headers. Takes any object exposing a
// `Headers` (NextRequest, Request) and imports no Node/next APIs, so it is safe
// to bundle into edge middleware via lib/auth.
// ---------------------------------------------------------------------------
export function getClientIp(req: { headers: Headers }): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}
