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
  const rateLimit = checkRateLimit(`set-session:${clientIP}`, RATE_LIMIT, RATE_WINDOW_MS);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetAt);
  }

  try {
    const { access_token, refresh_token } = await request.json();

    if (!access_token || !refresh_token) {
      return new Response(JSON.stringify({ error: 'Missing tokens' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createSupabaseServerClient(cookies);

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.error('Set session error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
