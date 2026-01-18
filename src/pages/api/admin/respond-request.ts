import type { APIRoute } from 'astro';
import { getUser, isAdmin, createSupabaseAdminClient } from '../../../lib/supabase';
import { sendAccessGrantedEmail } from '../../../lib/email';
import { sanityClient } from "sanity:client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authentication and admin status
  const user = await getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: 'Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  const { requestId, action, userId, documentId } = body;

  if (!requestId || !action) {
    return new Response(JSON.stringify({ error: 'Request ID and action are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (action !== 'approve' && action !== 'deny') {
    return new Response(JSON.stringify({ error: 'Action must be "approve" or "deny"' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createSupabaseAdminClient();

  try {
    // Update the request status
    const { error: updateError } = await supabaseAdmin
      .from('access_requests')
      .update({
        status: action === 'approve' ? 'approved' : 'denied',
        responded_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating request:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If approved, grant access to the article and send email
    if (action === 'approve' && userId && documentId) {
      const { error: accessError } = await supabaseAdmin
        .from('article_access')
        .upsert({
          user_id: userId,
          sanity_document_id: documentId,
          granted_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,sanity_document_id',
        });

      if (accessError) {
        console.error('Error granting access:', accessError);
        return new Response(JSON.stringify({ error: 'Request updated but failed to grant access' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Send email notification to the user
      try {
        console.log('[respond-request] Fetching profile for userId:', userId);

        // Get user's email
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        console.log('[respond-request] Profile result:', profile, 'Error:', profileError);

        // Get article details from Sanity
        console.log('[respond-request] Fetching article for documentId:', documentId);
        const article = await sanityClient.fetch(
          `*[_id == $documentId][0]{ title, "slug": slug.current }`,
          { documentId }
        );

        console.log('[respond-request] Article result:', article);

        if (profile?.email && article) {
          const origin = new URL(request.url).origin;
          const postUrl = `${origin}/posts/${article.slug}`;

          console.log('[respond-request] Sending email to:', profile.email, 'postUrl:', postUrl);

          const emailSent = await sendAccessGrantedEmail({
            userEmail: profile.email,
            postTitle: article.title,
            postUrl,
          });

          console.log('[respond-request] Email sent result:', emailSent);
        } else {
          console.log('[respond-request] Missing data - profile.email:', profile?.email, 'article:', !!article);
        }
      } catch (emailError) {
        // Don't fail the request if email fails - access was still granted
        console.error('Failed to send access granted email:', emailError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: action === 'approve' ? 'Access granted successfully' : 'Request denied',
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
