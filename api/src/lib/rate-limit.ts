import type { Context, Next } from 'hono';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to prevent memory leaks
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export function rateLimit(opts: { max: number; windowMs: number }) {
  return async (c: Context, next: Next) => {
    cleanup();

    const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown';
    const key = `${ip}:${c.req.path}`;
    const now = Date.now();

    const entry = store.get(key);
    if (entry && now < entry.resetAt) {
      entry.count++;
      if (entry.count > opts.max) {
        c.res.headers.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
        return c.json({ error: 'Too many requests. Please try again later.' }, 429);
      }
    } else {
      store.set(key, { count: 1, resetAt: now + opts.windowMs });
    }

    await next();
  };
}
