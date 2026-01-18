import { a as createSupabaseServerClient } from '../../../chunks/supabase_CCpIJb0g.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabase = createSupabaseServerClient(cookies);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      // Only existing/invited users can sign in
      emailRedirectTo: `${new URL(request.url).origin}/api/auth/callback`
    }
  });
  if (error) {
    console.error("Auth error:", error.message);
  }
  return redirect("/auth/check-email");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
