import { g as getUser, i as isAdmin, c as createSupabaseAdminClient } from '../../../chunks/supabase_CCpIJb0g.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies, url }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabaseAdmin = createSupabaseAdminClient();
  const userId = url.searchParams.get("userId");
  try {
    if (userId) {
      const { data: profile, error: profileError } = await supabaseAdmin.from("profiles").select("*").eq("id", userId).single();
      if (profileError) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      const { data: access, error: accessError } = await supabaseAdmin.from("article_access").select("*").eq("user_id", userId);
      const { data: logs, error: logsError2 } = await supabaseAdmin.from("content_access_log").select("*").eq("user_id", userId).order("accessed_at", { ascending: false }).limit(20);
      return new Response(JSON.stringify({
        user: profile,
        access: access || [],
        recentActivity: logs || []
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: profiles, error: profilesError } = await supabaseAdmin.from("profiles").select(`
        *,
        article_access(count)
      `).order("created_at", { ascending: false });
    if (profilesError) {
      console.error("Profiles fetch error:", profilesError);
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: recentLogs, error: logsError } = await supabaseAdmin.from("content_access_log").select("*, profiles(email, display_name)").order("accessed_at", { ascending: false }).limit(50);
    return new Response(JSON.stringify({
      users: profiles || [],
      recentActivity: recentLogs || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
