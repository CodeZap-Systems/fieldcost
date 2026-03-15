/**
 * Rate Limiting Utility
 * Provides rate limiting for auth and API endpoints
 * Supports per-IP and per-user rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

// In-memory store for rate limiting
// In production, use Redis for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Get IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns { allowed: boolean, retryAfter?: number }
 */
export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; retryAfter?: number } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();

  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset existing one
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + finalConfig.windowMs,
    });
    return { allowed: true };
  }

  // Check if limit exceeded
  if (entry.count >= finalConfig.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment counter
  entry.count++;
  return { allowed: true };
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse(retryAfter: number) {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Please try again in ${retryAfter} seconds`,
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

/**
 * Middleware to apply rate limiting
 * Usage in route.ts:
 * ```
 * import { applyRateLimit } from '@/lib/rateLimit';
 *
 * export async function POST(req: Request) {
 *   const rateLimitResult = applyRateLimit(req, { maxRequests: 3, windowMs: 60000 });
 *   if (!rateLimitResult.allowed) {
 *     return rateLimitResult.response;
 *   }
 *   // ... rest of handler
 * }
 * ```
 */
export function applyRateLimit(
  request: Request,
  config?: Partial<RateLimitConfig>
): { allowed: boolean; response?: Response } {
  const identifier = getClientIp(request);
  const result = checkRateLimit(identifier, config);

  if (!result.allowed) {
    return {
      allowed: false,
      response: rateLimitResponse(result.retryAfter || 60),
    };
  }

  return { allowed: true };
}

/**
 * Reset rate limit for identifier (useful for testing)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Get rate limit stats for identifier
 */
export function getRateLimitStats(identifier: string) {
  const entry = rateLimitStore.get(identifier);
  if (!entry) {
    return null;
  }
  const now = Date.now();
  const remaining = Math.max(0, DEFAULT_CONFIG.maxRequests - entry.count);
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);
  return {
    requests: entry.count,
    remaining,
    resetIn,
    resetTime: new Date(entry.resetTime),
  };
}

/**
 * Cleanup old entries periodically
 * Should be called periodically to clean up memory
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Rate limit cleanup: removed ${cleaned} expired entries`);
  }
}

// Cleanup every hour
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredEntries, 60 * 60 * 1000);
}

export default {
  getClientIp,
  checkRateLimit,
  applyRateLimit,
  rateLimitResponse,
  resetRateLimit,
  clearAllRateLimits,
  getRateLimitStats,
  cleanupExpiredEntries,
};
