import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createSupabaseServerClient(cookies);

  // Request magic link - invite-only mode (shouldCreateUser: false)
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Only existing/invited users can sign in
      emailRedirectTo: `${new URL(request.url).origin}/api/auth/callback`,
    },
  });

  if (error) {
    // Don't reveal if user exists or not for security
    console.error('Auth error:', error.message);
  }

  // Always redirect to check-email page (even on error for security)
  return redirect('/auth/check-email');
};
