import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';
import { checkRateLimit, getClientIP, rateLimitResponse } from '../../../lib/rate-limit';

export const prerender = false;

// Rate limit: 10 requests per minute per IP
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check rate limit before processing
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`exchange-code:${clientIP}`, RATE_LIMIT, RATE_WINDOW_MS);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetAt);
  }

  const { code } = await request.json();

  if (!code) {
    return new Response(JSON.stringify({ error: 'Code is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(cookies, responseHeaders);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Code exchange error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, user: data.user }), {
    status: 200,
    headers: responseHeaders,
  });
};
