import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';
import { sanitizeRedirectUrl, isValidEmail } from '../../../lib/security';
import { checkRateLimit, getClientIP, rateLimitResponse } from '../../../lib/rate-limit';

export const prerender = false;

// Rate limit: 5 requests per 15 minutes per IP
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check rate limit before processing
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`signin:${clientIP}`, RATE_LIMIT, RATE_WINDOW_MS);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetAt);
  }

  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const nextParam = formData.get('next')?.toString();

  // Validate redirect URL to prevent open redirect attacks
  const origin = new URL(request.url).origin;
  const next = sanitizeRedirectUrl(nextParam, origin);

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Create response headers to capture any cookies Supabase needs to set (e.g., code_verifier for PKCE)
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(cookies, responseHeaders);

  // Build redirect URL with the 'next' parameter
  const redirectUrl = `${origin}/auth/confirm?next=${encodeURIComponent(next)}`;

  // Request magic link - invite-only mode (shouldCreateUser: false)
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Only existing/invited users can sign in
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    // Don't reveal if user exists or not for security
    console.error('Auth error:', error.message);
  }

  // Redirect to check-email page, including any cookies that were set
  responseHeaders.set('Location', '/auth/check-email');
  return new Response(null, {
    status: 302,
    headers: responseHeaders,
  });
};
