import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const next = formData.get('next')?.toString() || '/';

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Create response headers to capture any cookies Supabase needs to set (e.g., code_verifier for PKCE)
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(cookies, responseHeaders);

  // Build redirect URL with the 'next' parameter
  const origin = new URL(request.url).origin;
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
