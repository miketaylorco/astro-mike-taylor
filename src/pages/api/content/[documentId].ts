import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';
import { getUser, checkArticleAccess, logContentAccess, isAdmin } from '../../../lib/supabase';

export const prerender = false;

// Create a Sanity client with the API token for authenticated access
const sanityClient = createClient({
  projectId: '0f5m14sf',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.SANITY_API_TOKEN,
});

export const GET: APIRoute = async ({ params, cookies, request }) => {
  const { documentId } = params;

  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get the authenticated user
  const user = await getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if the article is protected
  const post = await sanityClient.fetch(
    `*[_id == $documentId][0]{_id, accessLevel, body}`,
    { documentId }
  );

  if (!post) {
    return new Response(JSON.stringify({ error: 'Content not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // If public, return content directly
  if (post.accessLevel !== 'protected') {
    return new Response(JSON.stringify({ body: post.body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // For protected content, check access permissions
  // Admins always have access
  const hasAccess = isAdmin(user.email) || await checkArticleAccess(user.id, documentId);

  if (!hasAccess) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Log the access
  const ipAddress = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  await logContentAccess(user.id, documentId, ipAddress, userAgent);

  // Return the protected content
  return new Response(JSON.stringify({ body: post.body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
