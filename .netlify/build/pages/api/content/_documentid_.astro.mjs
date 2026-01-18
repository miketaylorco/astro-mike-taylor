import { createClient } from '@sanity/client';
import { g as getUser, i as isAdmin, b as checkArticleAccess, l as logContentAccess } from '../../../chunks/supabase_CCpIJb0g.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const sanityClient = createClient({
  projectId: "0f5m14sf",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: undefined                                
});
const GET = async ({ params, cookies, request }) => {
  const { documentId } = params;
  if (!documentId) {
    return new Response(JSON.stringify({ error: "Document ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const post = await sanityClient.fetch(
    `*[_id == $documentId][0]{_id, accessLevel, body}`,
    { documentId }
  );
  if (!post) {
    return new Response(JSON.stringify({ error: "Content not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (post.accessLevel !== "protected") {
    return new Response(JSON.stringify({ body: post.body }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  const hasAccess = isAdmin(user.email) || await checkArticleAccess(user.id, documentId);
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: "Access denied" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || void 0;
  const userAgent = request.headers.get("user-agent") || void 0;
  await logContentAccess(user.id, documentId, ipAddress, userAgent);
  return new Response(JSON.stringify({ body: post.body }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
