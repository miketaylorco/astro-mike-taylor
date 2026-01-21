import type { APIRoute } from 'astro';
import { getUser, createSupabaseAdminClient } from '../../../lib/supabase';
import { sendAccessRequestEmail } from '../../../lib/email';
import { sanitizeInput } from '../../../lib/security';
import { checkRateLimit, rateLimitResponse } from '../../../lib/rate-limit';

export const prerender = false;

// Rate limit: 10 requests per hour per user
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check if user is authenticated
  const user = await getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check rate limit per user
  const rateLimit = checkRateLimit(`request-access:${user.id}`, RATE_LIMIT, RATE_WINDOW_MS);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetAt);
  }

  const formData = await request.formData();
  const documentId = formData.get('documentId')?.toString();
  const postTitle = sanitizeInput(formData.get('postTitle')?.toString(), 200);
  const message = sanitizeInput(formData.get('message')?.toString(), 1000);

  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createSupabaseAdminClient();

  try {
    // Check if there's an existing request
    const { data: existingRequest } = await supabaseAdmin
      .from('access_requests')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('sanity_document_id', documentId)
      .single();

    let error;

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        // Already has a pending request
        return new Response(JSON.stringify({
          success: true,
          message: 'You have already requested access to this article'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Previous request was approved/denied - update it back to pending
      const result = await supabaseAdmin
        .from('access_requests')
        .update({
          status: 'pending',
          message: message || null,
          post_title: postTitle || null,
          requested_at: new Date().toISOString(),
          responded_at: null,
        })
        .eq('id', existingRequest.id);
      error = result.error;
    } else {
      // No existing request - insert new one
      const result = await supabaseAdmin.from('access_requests').insert({
        user_id: user.id,
        sanity_document_id: documentId,
        post_title: postTitle || null,
        message: message || null,
      });
      error = result.error;
    }

    if (error) {
      console.error('Access request error:', error);
      return new Response(JSON.stringify({ error: 'Failed to submit request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email notification to admins
    const origin = new URL(request.url).origin;
    await sendAccessRequestEmail({
      userEmail: user.email || 'Unknown',
      postTitle: postTitle || documentId,
      documentId,
      message: message || undefined,
      adminUrl: `${origin}/admin`,
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Access request submitted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
