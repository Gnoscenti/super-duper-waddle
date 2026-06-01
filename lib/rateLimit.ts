import type { NextApiRequest } from 'next';

// Simple in-memory rate limiter for guest users (IP-based)
// In production, this should use Redis or a persistent store

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const PRUNE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
let lastPrunedAt = 0;

function pruneExpiredEntries(now: number): void {
  if (now - lastPrunedAt < PRUNE_INTERVAL_MS) {
    return;
  }

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }

  lastPrunedAt = now;
}

export function checkRateLimit(identifier: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  pruneExpiredEntries(now);
  const entry = rateLimitStore.get(identifier);

  // If no entry or expired, create new one
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Increment count
  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(req: NextApiRequest): string | null {
  // Try common headers for IP address
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0];
    return ip?.trim() || null;
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    const ip = typeof realIp === 'string' ? realIp : realIp[0];
    return ip?.trim() || null;
  }

  return req.socket.remoteAddress?.trim() || null;
}
