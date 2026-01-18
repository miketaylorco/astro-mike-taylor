import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServerClient(cookies);

  await supabase.auth.signOut();

  // Clear auth cookies
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });

  return redirect('/');
};

// Also support GET for simple sign-out links
export const GET: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServerClient(cookies);

  await supabase.auth.signOut();

  // Clear auth cookies
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });

  return redirect('/');
};
