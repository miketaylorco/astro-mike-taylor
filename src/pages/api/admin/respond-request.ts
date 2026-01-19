import type { APIRoute } from 'astro';
import { getUser, isAdmin, createSupabaseAdminClient } from '../../../lib/supabase';
import { sendAccessGrantedEmail, sendFullAccessGrantedEmail } from '../../../lib/email';
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

  if (action !== 'approve' && action !== 'deny' && action !== 'grant_full_access') {
    return new Response(JSON.stringify({ error: 'Action must be "approve", "deny", or "grant_full_access"' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createSupabaseAdminClient();

  try {
    // Update the request status (grant_full_access counts as approved)
    const { error: updateError } = await supabaseAdmin
      .from('access_requests')
      .update({
        status: action === 'deny' ? 'denied' : 'approved',
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
        // Get user's email
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        // Get article details from Sanity
        const article = await sanityClient.fetch(
          `*[_id == $documentId][0]{ title, "slug": slug.current }`,
          { documentId }
        );

        if (profile?.email && article) {
          const origin = new URL(request.url).origin;
          const postUrl = `${origin}/posts/${article.slug}`;

          await sendAccessGrantedEmail({
            userEmail: profile.email,
            postTitle: article.title,
            postUrl,
          });
        }
      } catch (emailError) {
        // Don't fail the request if email fails - access was still granted
        console.error('Failed to send access granted email:', emailError);
      }
    }

    // If granting full access, update the user's profile and send email
    if (action === 'grant_full_access' && userId) {
      const { error: fullAccessError } = await supabaseAdmin
        .from('profiles')
        .update({ has_full_access: true })
        .eq('id', userId);

      if (fullAccessError) {
        console.error('Error granting full access:', fullAccessError);
        return new Response(JSON.stringify({ error: 'Request updated but failed to grant full access' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Send email notification to the user
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        if (profile?.email) {
          const origin = new URL(request.url).origin;
          await sendFullAccessGrantedEmail({
            userEmail: profile.email,
            siteUrl: origin,
          });
        }
      } catch (emailError) {
        // Don't fail the request if email fails - full access was still granted
        console.error('Failed to send full access granted email:', emailError);
      }
    }

    const messages: Record<string, string> = {
      approve: 'Access granted successfully',
      deny: 'Request denied',
      grant_full_access: 'Full access granted successfully',
    };

    return new Response(JSON.stringify({
      success: true,
      message: messages[action],
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
