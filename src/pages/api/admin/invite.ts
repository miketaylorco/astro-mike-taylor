import type { APIRoute } from 'astro';
import { getUser, createSupabaseAdminClient, isAdmin } from '../../../lib/supabase';

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

  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const displayName = formData.get('displayName')?.toString();
  const fullAccess = formData.get('fullAccess')?.toString() === 'true';
  const articleIds = formData.getAll('articleIds').map(id => id.toString()).filter(Boolean);

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createSupabaseAdminClient();

  try {
    // Send invite email using the admin API
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${new URL(request.url).origin}/auth/confirm`,
      }
    );

    if (inviteError) {
      console.error('Invite error:', inviteError);
      return new Response(JSON.stringify({ error: inviteError.message || 'Failed to send invite' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create profile for the new user
    const userId = inviteData.user.id;

    // Insert profile (upsert in case it already exists)
    await supabaseAdmin.from('profiles').upsert({
      id: userId,
      email,
      display_name: displayName || null,
      has_full_access: fullAccess,
    }, {
      onConflict: 'id',
    });

    // Grant access to specified articles
    if (articleIds.length > 0) {
      const accessRecords = articleIds.map(sanityDocumentId => ({
        user_id: userId,
        sanity_document_id: sanityDocumentId,
      }));

      const { error: accessError } = await supabaseAdmin
        .from('article_access')
        .upsert(accessRecords, {
          onConflict: 'user_id,sanity_document_id',
        });

      if (accessError) {
        console.error('Access grant error:', accessError);
        // Continue anyway - user is created, access can be added later
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Invite email sent successfully',
      userId,
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
