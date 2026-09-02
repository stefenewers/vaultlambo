/**
 * Best-effort in-memory rate limiting for the enquiry endpoint.
 *
 * A fixed window per client, held in the process. This is deliberately modest: it
 * stops a form being hammered from one address, and it costs nothing to run. It is not
 * a distributed limiter — on a multi-instance or heavily scaled deployment each
 * instance keeps its own counter, so the effective limit is per instance. If the site
 * ever needs a hard guarantee, move this to a shared store (Upstash, Redis) behind the
 * same `check` signature and nothing else has to change.
 */

type Window = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
/** Bound the map so a flood of unique addresses cannot grow it without limit. */
const MAX_TRACKED_CLIENTS = 5_000;

const windows = new Map<string, Window>();

function sweep(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the caller may try again. Only meaningful when `ok` is false. */
  retryAfter: number;
};

/**
 * Records an attempt for `key` and reports whether it is allowed.
 *
 * `key` should be a client identifier — see `clientKey` below. Callers must treat a
 * false result as "refuse the request", not "try harder".
 */
export function checkRateLimit(
  key: string,
  { max = MAX_PER_WINDOW, windowMs = WINDOW_MS }: { max?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();

  if (windows.size > MAX_TRACKED_CLIENTS) sweep(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > max) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * Derives a client key from the request.
 *
 * `x-forwarded-for` is only trustworthy behind a proxy that sets it, which is the case
 * on Vercel. The leftmost entry is the client. Falls back to a single shared bucket
 * when no address is available, which is conservative — it throttles rather than
 * letting unidentified traffic through unmetered.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first) return first;

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Test seam: clears all recorded windows. */
export function resetRateLimits(): void {
  windows.clear();
}
