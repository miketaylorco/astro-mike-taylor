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

        // Also check for project-specific cookie format (sb-<project-ref>-auth-token)
        // Supabase uses this format in newer versions
        const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\./)?.[1];
        if (projectRef) {
          const authTokenName = `sb-${projectRef}-auth-token`;
          const authToken = cookies.get(authTokenName);
          if (authToken?.value) {
            allCookies.push({ name: authTokenName, value: authToken.value });
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

// Check if user has access to a specific article
export async function checkArticleAccess(userId: string, sanityDocumentId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();

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

  const { error } = await supabase.from('content_access_log').insert({
    user_id: userId,
    sanity_document_id: sanityDocumentId,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  if (error) {
    console.error('Failed to log content access:', error);
  } else {
    console.log('Content access logged:', { userId, sanityDocumentId });
  }
}

// Check if user is an admin
export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;

  const adminEmails = (import.meta.env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}
