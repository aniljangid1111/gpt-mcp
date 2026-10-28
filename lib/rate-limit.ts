import { NextResponse } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale records periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (now - record.resetTime > 600000) {
        memoryStore.delete(key);
      }
    }
  }, 300000);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

export async function checkRateLimit(
  key: string,
  maxRequests = 60,
  windowSeconds = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const now = Date.now();
      const windowMs = windowSeconds * 1000;
      const clearBefore = now - windowMs;

      const pipelineRes = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["ZREMRANGEBYSCORE", key, "0", String(clearBefore)],
          ["ZADD", key, String(now), `${now}-${Math.random()}`],
          ["ZCARD", key],
          ["EXPIRE", key, String(windowSeconds * 2)],
        ]),
      });

      if (pipelineRes.ok) {
        const results = await pipelineRes.json();
        const count = results[2]?.result || 1;
        const remaining = Math.max(0, maxRequests - count);
        return {
          success: count <= maxRequests,
          limit: maxRequests,
          remaining,
          reset: Math.ceil((now + windowMs) / 1000),
        };
      }
    } catch (err) {
      console.warn("[RateLimit] Upstash check failed, falling back to memory store:", err);
    }
  }

  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = memoryStore.get(key);
  if (!record || now > record.resetTime) {
    record = {
      timestamps: [],
      resetTime: now + windowMs,
    };
    memoryStore.set(key, record);
  }

  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
  record.timestamps.push(now);

  const count = record.timestamps.length;
  const remaining = Math.max(0, maxRequests - count);
  const resetSeconds = Math.ceil(record.resetTime / 1000);

  return {
    success: count <= maxRequests,
    limit: maxRequests,
    remaining,
    reset: resetSeconds,
  };
}

export function rateLimitResponse(rateLimitResult: { limit: number; remaining: number; reset: number }) {
  const retryAfter = Math.max(1, rateLimitResult.reset - Math.ceil(Date.now() / 1000));
  return NextResponse.json(
    {
      error: "Too many requests. Please slow down.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(rateLimitResult.limit),
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        "X-RateLimit-Reset": String(rateLimitResult.reset),
      },
    }
  );
}
