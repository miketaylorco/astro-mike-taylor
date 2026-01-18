import { s as sanityClient } from '../chunks/page-ssr_DzKzsCPd.mjs';
import { c as createComponent, d as createAstro, i as renderComponent, r as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../chunks/astro/server_YtkIaNi7.mjs';
import 'piccolore';
import { g as getUser } from '../chunks/supabase_CCpIJb0g.mjs';
import { $ as $$Main } from '../chunks/main_D51iTxx8.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const contentProps = { title: "Posts" };
  const user = await getUser(Astro2.cookies);
  const isAuthenticated = !!user;
  const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  publishedAt,
  accessLevel
}`;
  const posts = await sanityClient.fetch(POSTS_QUERY);
  return renderTemplate`${renderComponent($$result, "Main", $$Main, { "content": contentProps }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto min-h-screen max-w-3xl p-8"> <div class="flex items-center justify-between mb-8"> <h1 class="text-4xl font-bold">${posts.length} Post${posts.length != 1 && "s"}</h1> ${isAuthenticated && renderTemplate`<a href="/api/auth/signout" class="text-sm text-gray-500 hover:underline">Sign out</a>`} </div> <ul class="flex flex-col gap-y-4"> ${posts.map((post) => renderTemplate`<li class="hover:bg-gray-50 rounded-lg transition-colors"> <a${addAttribute(`/posts/${post.slug.current}`, "href")} class="block p-4 -m-4"> <div class="flex items-start justify-between gap-4"> <div> <h2 class="text-xl font-semibold">${post.title}</h2> <p class="text-gray-600">${new Date(post.publishedAt).toLocaleDateString()}</p> </div> ${post.accessLevel === "protected" && renderTemplate`<div class="flex-shrink-0 inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs"> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg>
Protected
</div>`} </div> </a> </li>`)} </ul> </main> ` })}`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/posts/index.astro", void 0);

const $$file = "/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/posts/index.astro";
const $$url = "/posts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
