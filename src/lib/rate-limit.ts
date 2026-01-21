// In-memory rate limiting for serverless functions
// Note: This resets when the function instance terminates (typically after 45-60 min idle)
// Provides "best effort" protection against casual abuse

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

// In-memory store for rate limits
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval (5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries(maxWindowMs: number): void {
  const now = Date.now();
  
  // Only run cleanup periodically
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }
  
  lastCleanup = now;
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > maxWindowMs) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param limit - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status, remaining requests, and reset time
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  
  // Run cleanup periodically (use the largest window we care about)
  cleanupExpiredEntries(60 * 60 * 1000); // 1 hour max
  
  const entry = rateLimitStore.get(key);
  
  // No existing entry or window expired - start fresh
  if (!entry || now - entry.windowStart >= windowMs) {
    rateLimitStore.set(key, {
      count: 1,
      windowStart: now,
    });
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: new Date(now + windowMs),
    };
  }
  
  // Within window - check and increment
  const resetAt = new Date(entry.windowStart + windowMs);
  
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }
  
  entry.count++;
  
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt,
  };
}

/**
 * Extract client IP address from request headers
 * Checks Netlify-specific headers first, then standard headers
 */
export function getClientIP(request: Request): string {
  // Netlify-specific header (most reliable on Netlify)
  const nfClientIP = request.headers.get('x-nf-client-connection-ip');
  if (nfClientIP) {
    return nfClientIP;
  }
  
  // Standard forwarded header (may contain multiple IPs)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP (original client)
    return forwardedFor.split(',')[0].trim();
  }
  
  // Fallback headers
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Default fallback (shouldn't happen in production)
  return 'unknown';
}

/**
 * Create a 429 Too Many Requests response
 */
export function rateLimitResponse(resetAt: Date): Response {
  const retryAfter = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
  
  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
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
