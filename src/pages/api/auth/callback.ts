import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/';

  if (!code) {
    return redirect('/auth/error?message=missing_code');
  }

  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(cookies, responseHeaders);

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Auth callback error:', error.message);
    return redirect('/auth/error?message=auth_failed');
  }

  // Return redirect with cookies set
  responseHeaders.set('Location', next);
  return new Response(null, {
    status: 302,
    headers: responseHeaders,
  });
};
