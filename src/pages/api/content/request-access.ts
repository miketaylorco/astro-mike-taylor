import type { APIRoute } from 'astro';
import { getUser, createSupabaseAdminClient } from '../../../lib/supabase';
import { sendAccessRequestEmail } from '../../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  console.log('[request-access] Starting request');

  // Check if user is authenticated
  const user = await getUser(cookies);
  console.log('[request-access] User:', user ? user.email : 'null');

  if (!user) {
    console.log('[request-access] No user found, returning 401');
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();
  const documentId = formData.get('documentId')?.toString();
  const postTitle = formData.get('postTitle')?.toString();
  const message = formData.get('message')?.toString();

  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createSupabaseAdminClient();

  try {
    console.log('[request-access] Inserting access request for user:', user.id, 'document:', documentId);

    // Store the access request
    const { error } = await supabaseAdmin.from('access_requests').insert({
      user_id: user.id,
      sanity_document_id: documentId,
      post_title: postTitle || null,
      message: message || null,
    });

    if (error) {
      // Check if it's a duplicate request
      if (error.code === '23505') {
        console.log('[request-access] Duplicate request detected');
        return new Response(JSON.stringify({
          success: true,
          message: 'You have already requested access to this article'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      console.error('[request-access] Insert error:', error);
      return new Response(JSON.stringify({ error: 'Failed to submit request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[request-access] Insert successful, sending email');

    // Send email notification to admins
    const origin = new URL(request.url).origin;
    const emailSent = await sendAccessRequestEmail({
      userEmail: user.email || 'Unknown',
      postTitle: postTitle || documentId,
      documentId,
      message: message || undefined,
      adminUrl: `${origin}/admin`,
    });

    console.log('[request-access] Email sent:', emailSent);

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
