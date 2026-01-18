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
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const displayName = formData.get("displayName")?.toString();
  const articleIds = formData.getAll("articleIds").map((id) => id.toString()).filter(Boolean);
  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabaseAdmin = createSupabaseAdminClient();
  try {
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email,
      options: {
        redirectTo: `${new URL(request.url).origin}/api/auth/callback`
      }
    });
    if (inviteError) {
      console.error("Invite error:", inviteError);
      return new Response(JSON.stringify({ error: "Failed to generate invite" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userId = inviteData.user.id;
    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email,
      display_name: displayName || null
    }, {
      onConflict: "id"
    });
    if (articleIds.length > 0) {
      const accessRecords = articleIds.map((sanityDocumentId) => ({
        user_id: userId,
        sanity_document_id: sanityDocumentId
      }));
      const { error: accessError } = await supabaseAdmin.from("article_access").upsert(accessRecords, {
        onConflict: "user_id,sanity_document_id"
      });
      if (accessError) {
        console.error("Access grant error:", accessError);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Invite sent successfully",
      inviteLink: inviteData.properties?.action_link,
      userId
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
