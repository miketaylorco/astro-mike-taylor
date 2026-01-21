import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';
import { sanitizeRedirectUrl } from '../../../lib/security';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const nextParam = url.searchParams.get('next');

  // Validate redirect URL to prevent open redirect attacks
  const next = sanitizeRedirectUrl(nextParam, url.origin);

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
