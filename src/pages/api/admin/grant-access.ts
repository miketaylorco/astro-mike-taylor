import type { APIRoute } from 'astro';
import { getUser, createSupabaseAdminClient, isAdmin } from '../../../lib/supabase';
import { sendAccessGrantedEmail } from '../../../lib/email';
import { sanityClient } from "sanity:client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check if user is authenticated and is an admin
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
  const { userId, sanityDocumentId, expiresAt, sendEmail } = body;

  if (!userId || !sanityDocumentId) {
    return new Response(JSON.stringify({ error: 'userId and sanityDocumentId are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createSupabaseAdminClient();

  try {
    const { data, error } = await supabaseAdmin
      .from('article_access')
      .upsert({
        user_id: userId,
        sanity_document_id: sanityDocumentId,
        expires_at: expiresAt || null,
      }, {
        onConflict: 'user_id,sanity_document_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Grant access error:', error);
      return new Response(JSON.stringify({ error: 'Failed to grant access' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email notification if requested
    let emailSent = false;
    if (sendEmail) {
      try {
        // Get user email from profiles table
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        // Get article details from Sanity
        const article = await sanityClient.fetch(
          `*[_id == $docId][0]{ title, "slug": slug.current }`,
          { docId: sanityDocumentId }
        );

        if (profile?.email && article?.title) {
          const postUrl = article.slug
            ? `${new URL(request.url).origin}/posts/${article.slug}`
            : `${new URL(request.url).origin}/posts`;

          emailSent = await sendAccessGrantedEmail({
            userEmail: profile.email,
            postTitle: article.title,
            postUrl,
          });
        }
      } catch (emailError) {
        console.error('Error sending access granted email:', emailError);
        // Don't fail the request if email fails - access was still granted
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Access granted successfully',
      access: data,
      emailSent,
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
