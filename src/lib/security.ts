// Security utility functions

/**
 * Validates that a redirect URL is safe (relative path or same origin).
 * Prevents open redirect attacks.
 */
export function isValidRedirectUrl(url: string, origin: string): boolean {
  // Empty or whitespace-only URLs default to home
  if (!url || !url.trim()) {
    return true;
  }

  // Must start with / for relative paths (but not // which is protocol-relative)
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true;
  }

  // Check if it's an absolute URL matching our origin
  try {
    const parsed = new URL(url);
    const originUrl = new URL(origin);
    return parsed.origin === originUrl.origin;
  } catch {
    // Invalid URL format - reject
    return false;
  }
}

/**
 * Sanitizes a redirect URL, returning '/' if invalid.
 */
export function sanitizeRedirectUrl(url: string | null | undefined, origin: string): string {
  const target = url?.trim() || '/';
  return isValidRedirectUrl(target, origin) ? target : '/';
}

/**
 * Validates UUID format (v4).
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Validates email format (basic check).
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Truncates and sanitizes string input.
 */
export function sanitizeInput(input: string | null | undefined, maxLength: number = 1000): string {
  if (!input) return '';
  return input.trim().slice(0, maxLength);
}
