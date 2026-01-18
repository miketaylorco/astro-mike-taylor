import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const next = formData.get('next')?.toString() || '/';

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createSupabaseServerClient(cookies);

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

  // Always redirect to check-email page (even on error for security)
  return redirect('/auth/check-email');
};
