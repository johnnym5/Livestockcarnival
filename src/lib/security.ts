/**
 * System-Wide Security Utility: Rate Limiting & Input Sanitization
 * Used across client forms and server API routes on livestockcarnival.ng
 */

// Sliding window rate limiter store
const rateLimitStore = new Map<string, number[]>();

export interface RateLimitOptions {
  limit?: number; // Maximum requests allowed (default: 10)
  windowMs?: number; // Time window in milliseconds (default: 60,000ms / 1 min)
}

/**
 * Checks if a specific key (IP address, User ID, or Form Session ID) is rate-limited.
 * Returns true if rate limit is exceeded, false otherwise.
 */
export function isRateLimited(
  identifier: string,
  options: RateLimitOptions = {}
): boolean {
  const limit = options.limit ?? 10;
  const windowMs = options.windowMs ?? 60 * 1000;
  const now = Date.now();

  const timestamps = rateLimitStore.get(identifier) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    rateLimitStore.set(identifier, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitStore.set(identifier, validTimestamps);
  return false;
}

/**
 * System-wide text sanitization:
 * - Strips all HTML tags and script elements
 * - Sanitizes special HTML characters to prevent XSS attacks
 * - Trims excessive whitespace
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '') // Remove <script> blocks
    .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, '') // Remove <style> blocks
    .replace(/<[^>]*>?/gm, '') // Strip all remaining HTML tags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * Recursively sanitizes string fields within an object or record.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = { ...obj } as Record<string, unknown>;

  for (const key of Object.keys(sanitized)) {
    const val = sanitized[key];
    if (typeof val === 'string') {
      sanitized[key] = sanitizeText(val);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      sanitized[key] = sanitizeObject(val as Record<string, unknown>);
    }
  }

  return sanitized as T;
}
