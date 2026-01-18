import { s as sanityClient } from '../../../chunks/page-ssr_DzKzsCPd.mjs';
import { c as createComponent, d as createAstro, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../../../chunks/astro/server_YtkIaNi7.mjs';
import 'piccolore';
import { $ as $$Main } from '../../../chunks/main_D51iTxx8.mjs';
import { g as getUser, i as isAdmin, c as createSupabaseAdminClient } from '../../../chunks/supabase_CCpIJb0g.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const contentProps = { title: "Manage User" };
  const user = await getUser(Astro2.cookies);
  if (!user) {
    return Astro2.redirect("/auth/error?message=access_denied");
  }
  if (!isAdmin(user.email)) {
    return Astro2.redirect("/auth/error?message=access_denied");
  }
  const { id: userId } = Astro2.params;
  if (!userId) {
    return Astro2.redirect("/admin");
  }
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: profile, error: profileError } = await supabaseAdmin.from("profiles").select("*").eq("id", userId).single();
  if (profileError || !profile) {
    return Astro2.redirect("/admin");
  }
  const { data: userAccess } = await supabaseAdmin.from("article_access").select("*").eq("user_id", userId);
  const { data: accessLogs } = await supabaseAdmin.from("content_access_log").select("*").eq("user_id", userId).order("accessed_at", { ascending: false }).limit(20);
  const protectedArticles = await sanityClient.fetch(`
  *[_type == "post" && accessLevel == "protected"]{
    _id,
    title,
    slug
  }
`);
  const accessedArticleIds = new Set(userAccess?.map((a) => a.sanity_document_id) || []);
  return renderTemplate`${renderComponent($$result, "Main", $$Main, { "content": contentProps }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto min-h-screen max-w-3xl p-8"> <div class="flex items-center justify-between mb-8"> <h1 class="text-3xl font-bold">Manage User</h1> <a href="/admin" class="text-gray-500 hover:underline">&larr; Back to Dashboard</a> </div> <!-- User Info --> <div class="bg-white rounded-lg shadow p-6 mb-8"> <h2 class="text-xl font-semibold mb-4">User Information</h2> <dl class="grid grid-cols-2 gap-4"> <div> <dt class="text-sm text-gray-500">Email</dt> <dd class="font-medium">${profile.email}</dd> </div> <div> <dt class="text-sm text-gray-500">Display Name</dt> <dd class="font-medium">${profile.display_name || "\u2014"}</dd> </div> <div> <dt class="text-sm text-gray-500">Created</dt> <dd class="font-medium">${new Date(profile.created_at).toLocaleDateString()}</dd> </div> <div> <dt class="text-sm text-gray-500">User ID</dt> <dd class="font-mono text-sm">${profile.id}</dd> </div> </dl> </div> <!-- Article Access --> <div class="bg-white rounded-lg shadow p-6 mb-8"> <h2 class="text-xl font-semibold mb-4">Article Access</h2> ${protectedArticles && protectedArticles.length > 0 ? renderTemplate`<div class="space-y-3"> ${protectedArticles.map((article) => {
    const hasAccess = accessedArticleIds.has(article._id);
    return renderTemplate`<div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"> <div> <div class="font-medium">${article.title}</div> <div class="text-sm text-gray-500">${article._id}</div> </div> <button type="button" class="access-toggle px-4 py-2 rounded-lg text-sm font-medium transition-colors"${addAttribute(userId, "data-user-id")}${addAttribute(article._id, "data-article-id")}${addAttribute(hasAccess.toString(), "data-has-access")}${addAttribute(hasAccess ? "background-color: rgb(220 38 38); color: white;" : "background-color: rgb(22 163 74); color: white;", "style")}> ${hasAccess ? "Revoke Access" : "Grant Access"} </button> </div>`;
  })} </div>` : renderTemplate`<p class="text-gray-500">No protected articles found.</p>`} </div> <!-- Access History --> <div class="bg-white rounded-lg shadow p-6"> <h2 class="text-xl font-semibold mb-4">Access History</h2> ${accessLogs && accessLogs.length > 0 ? renderTemplate`<div class="overflow-x-auto"> <table class="w-full text-sm"> <thead> <tr class="border-b border-gray-200"> <th class="text-left py-2 px-2">Article</th> <th class="text-left py-2 px-2">Date</th> <th class="text-left py-2 px-2">IP</th> </tr> </thead> <tbody> ${accessLogs.map((log) => renderTemplate`<tr class="border-b border-gray-100"> <td class="py-2 px-2 font-mono text-xs truncate max-w-[200px]"> ${log.sanity_document_id} </td> <td class="py-2 px-2"> ${new Date(log.accessed_at).toLocaleString()} </td> <td class="py-2 px-2 text-gray-500"> ${log.ip_address || "\u2014"} </td> </tr>`)} </tbody> </table> </div>` : renderTemplate`<p class="text-gray-500">No access history yet.</p>`} </div> </main> ` })} ${renderScript($$result, "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/user/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/user/[id].astro", void 0);

const $$file = "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/user/[id].astro";
const $$url = "/admin/user/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
