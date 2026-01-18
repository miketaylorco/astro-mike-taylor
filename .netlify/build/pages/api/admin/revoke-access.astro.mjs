import { g as getUser, i as isAdmin, c as createSupabaseAdminClient } from '../../../chunks/supabase_CCpIJb0g.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
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
  const body = await request.json();
  const { userId, sanityDocumentId } = body;
  if (!userId || !sanityDocumentId) {
    return new Response(JSON.stringify({ error: "userId and sanityDocumentId are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabaseAdmin = createSupabaseAdminClient();
  try {
    const { error } = await supabaseAdmin.from("article_access").delete().eq("user_id", userId).eq("sanity_document_id", sanityDocumentId);
    if (error) {
      console.error("Revoke access error:", error);
      return new Response(JSON.stringify({ error: "Failed to revoke access" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Access revoked successfully"
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
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
