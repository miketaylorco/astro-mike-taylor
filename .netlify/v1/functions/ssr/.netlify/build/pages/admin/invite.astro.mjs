import { s as sanityClient } from '../../chunks/page-ssr_DzKzsCPd.mjs';
import { c as createComponent, d as createAstro, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../../chunks/astro/server_YtkIaNi7.mjs';
import 'piccolore';
import { $ as $$Main } from '../../chunks/main_D51iTxx8.mjs';
import { g as getUser, i as isAdmin } from '../../chunks/supabase_CCpIJb0g.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Invite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Invite;
  const contentProps = { title: "Invite User" };
  const user = await getUser(Astro2.cookies);
  if (!user) {
    return Astro2.redirect("/auth/error?message=access_denied");
  }
  if (!isAdmin(user.email)) {
    return Astro2.redirect("/auth/error?message=access_denied");
  }
  const protectedArticles = await sanityClient.fetch(`
  *[_type == "post" && accessLevel == "protected"]{
    _id,
    title,
    slug
  }
`);
  return renderTemplate`${renderComponent($$result, "Main", $$Main, { "content": contentProps }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto min-h-screen max-w-2xl p-8"> <div class="flex items-center justify-between mb-8"> <h1 class="text-3xl font-bold">Invite User</h1> <a href="/admin" class="text-gray-500 hover:underline">&larr; Back to Dashboard</a> </div> <div class="bg-white rounded-lg shadow p-6"> <form id="invite-form" class="space-y-6"> <div> <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
Email Address *
</label> <input type="email" id="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="user@example.com"> </div> <div> <label for="displayName" class="block text-sm font-medium text-gray-700 mb-1">
Display Name (Optional)
</label> <input type="text" id="displayName" name="displayName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe"> </div> ${protectedArticles && protectedArticles.length > 0 && renderTemplate`<div> <label class="block text-sm font-medium text-gray-700 mb-2">
Grant Access To
</label> <div class="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2"> ${protectedArticles.map((article) => renderTemplate`<label class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"> <input type="checkbox" name="articleIds"${addAttribute(article._id, "value")} class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"> <div> <div class="font-medium">${article.title}</div> <div class="text-sm text-gray-500">${article._id}</div> </div> </label>`)} </div> <p class="text-sm text-gray-500 mt-2">
Select which protected articles this user should have access to.
</p> </div>`} <div class="pt-4 border-t border-gray-200"> <button type="submit" class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
Send Invite
</button> </div> </form> <!-- Success/Error Messages --> <div id="message" class="hidden mt-6 p-4 rounded-lg"></div> <!-- Invite Link Display --> <div id="invite-link-container" class="hidden mt-6 p-4 bg-gray-50 rounded-lg"> <h3 class="font-medium mb-2">Invite Link (Backup)</h3> <p class="text-sm text-gray-600 mb-3">
An email has been sent. If the user doesn't receive it, you can share this link directly:
</p> <div class="flex gap-2"> <input type="text" id="invite-link" readonly class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"> <button type="button" id="copy-link" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium">
Copy
</button> </div> </div> </div> </main> ` })} ${renderScript($$result, "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/invite.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/invite.astro", void 0);

const $$file = "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/invite.astro";
const $$url = "/admin/invite";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Invite,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
