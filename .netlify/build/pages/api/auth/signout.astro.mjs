import { a as createSupabaseServerClient } from '../../../chunks/supabase_CCpIJb0g.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServerClient(cookies);
  await supabase.auth.signOut();
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return redirect("/");
};
const GET = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServerClient(cookies);
  await supabase.auth.signOut();
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return redirect("/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
