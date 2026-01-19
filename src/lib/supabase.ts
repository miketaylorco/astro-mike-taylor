import { createServerClient, serializeCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

// Environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Cookie names used by Supabase
const COOKIE_NAMES = [
  'sb-access-token',
  'sb-refresh-token',
];

// Browser client for client-side usage
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server client for API routes (handles cookies automatically)
export function createSupabaseServerClient(
  cookies: AstroCookies,
  responseHeaders?: Headers
) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'implicit',
    },
    cookies: {
      getAll() {
        const allCookies: { name: string; value: string }[] = [];

        // Get known Supabase cookies
        for (const name of COOKIE_NAMES) {
          const cookie = cookies.get(name);
          if (cookie?.value) {
            allCookies.push({ name, value: cookie.value });
          }
        }

        // Also check for project-specific cookie formats
        // Supabase uses this format in newer versions
        const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\./)?.[1];
        if (projectRef) {
          // Auth token cookie
          const authTokenName = `sb-${projectRef}-auth-token`;
          const authToken = cookies.get(authTokenName);
          if (authToken?.value) {
            allCookies.push({ name: authTokenName, value: authToken.value });
          }

          // PKCE code verifier cookie
          const codeVerifierName = `sb-${projectRef}-auth-token-code-verifier`;
          const codeVerifier = cookies.get(codeVerifierName);
          if (codeVerifier?.value) {
            allCookies.push({ name: codeVerifierName, value: codeVerifier.value });
          }
        }

        return allCookies;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (responseHeaders) {
            responseHeaders.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options)
            );
          } else {
            cookies.set(name, value, options);
          }
        });
      },
    },
  });
}

// Admin client with service role key (bypasses RLS)
export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper to get user from request
export async function getUser(cookies: AstroCookies, responseHeaders?: Headers) {
  const supabase = createSupabaseServerClient(cookies, responseHeaders);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

// Check if user has full access to all protected content
export async function hasFullAccess(userId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from('profiles')
    .select('has_full_access')
    .eq('id', userId)
    .single();
  return !!data?.has_full_access;
}

// Check if user has access to a specific article
export async function checkArticleAccess(userId: string, sanityDocumentId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();

  // First check if user has full access
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_full_access')
    .eq('id', userId)
    .single();

  if (profile?.has_full_access) {
    return true;
  }

  // Fall back to per-article access check
  const { data, error } = await supabase
    .from('article_access')
    .select('id, expires_at')
    .eq('user_id', userId)
    .eq('sanity_document_id', sanityDocumentId)
    .single();

  if (error || !data) {
    return false;
  }

  // Check if access has expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return false;
  }

  return true;
}

// Log content access
export async function logContentAccess(
  userId: string,
  sanityDocumentId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const supabase = createSupabaseAdminClient();

  // First try with IP address
  let { error } = await supabase.from('content_access_log').insert({
    user_id: userId,
    sanity_document_id: sanityDocumentId,
    ip_address: ipAddress || null,
    user_agent: userAgent || null,
  });

  // If IP address format is invalid, retry without it
  if (error && error.message?.includes('ip_address')) {
    console.warn('IP address format invalid, retrying without IP:', ipAddress);
    const result = await supabase.from('content_access_log').insert({
      user_id: userId,
      sanity_document_id: sanityDocumentId,
      ip_address: null,
      user_agent: userAgent || null,
    });
    error = result.error;
  }

  if (error) {
    console.error('Failed to log content access:', JSON.stringify(error, null, 2));
  }
}

// Check if user is an admin
export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;

  const adminEmails = (import.meta.env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}
