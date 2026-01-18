import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = undefined                                   ;
const supabaseAnonKey = undefined                                        ;
const supabaseServiceRoleKey = undefined                                         ;
function createSupabaseServerClient(cookies, responseHeaders) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(cookies.get("sb-access-token")?.value ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (responseHeaders) {
            responseHeaders.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            );
          } else {
            cookies.set(name, value, options);
          }
        });
      }
    }
  });
}
function createSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
async function getUser(cookies, responseHeaders) {
  const supabase = createSupabaseServerClient(cookies, responseHeaders);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  return user;
}
async function checkArticleAccess(userId, sanityDocumentId) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("article_access").select("id, expires_at").eq("user_id", userId).eq("sanity_document_id", sanityDocumentId).single();
  if (error || !data) {
    return false;
  }
  if (data.expires_at && new Date(data.expires_at) < /* @__PURE__ */ new Date()) {
    return false;
  }
  return true;
}
async function logContentAccess(userId, sanityDocumentId, ipAddress, userAgent) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("content_access_log").insert({
    user_id: userId,
    sanity_document_id: sanityDocumentId,
    ip_address: ipAddress,
    user_agent: userAgent
  });
}
function isAdmin(email) {
  if (!email) return false;
  const adminEmails = ("").split(",").map((e) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

export { createSupabaseServerClient as a, checkArticleAccess as b, createSupabaseAdminClient as c, getUser as g, isAdmin as i, logContentAccess as l };
