import { a as createSupabaseServerClient } from '../../../chunks/supabase_CCpIJb0g.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";
  if (!code) {
    return redirect("/auth/error?message=missing_code");
  }
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClient(cookies, responseHeaders);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Auth callback error:", error.message);
    return redirect("/auth/error?message=auth_failed");
  }
  responseHeaders.set("Location", next);
  return new Response(null, {
    status: 302,
    headers: responseHeaders
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
