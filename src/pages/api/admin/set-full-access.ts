import type { APIRoute } from 'astro';
import { getUser, createSupabaseAdminClient, isAdmin } from '../../../lib/supabase';
import { isValidUUID } from '../../../lib/security';

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
  const { userId, hasFullAccess } = body;

  if (!userId || typeof hasFullAccess !== 'boolean') {
    return new Response(JSON.stringify({ error: 'userId and hasFullAccess (boolean) are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!isValidUUID(userId)) {
    return new Response(JSON.stringify({ error: 'Invalid userId format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createSupabaseAdminClient();

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ has_full_access: hasFullAccess })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Set full access error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update full access' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: hasFullAccess ? 'Full access granted' : 'Full access revoked',
      profile: data,
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
