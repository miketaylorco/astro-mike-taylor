import type { APIRoute } from 'astro';
import { getUser, createSupabaseAdminClient, isAdmin } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, url }) => {
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

  const supabaseAdmin = createSupabaseAdminClient();

  // Check if requesting a specific user
  const userId = url.searchParams.get('userId');

  try {
    if (userId) {
      // Get specific user with their access
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Get user's article access
      const { data: access, error: accessError } = await supabaseAdmin
        .from('article_access')
        .select('*')
        .eq('user_id', userId);

      // Get user's recent access logs
      const { data: logs, error: logsError } = await supabaseAdmin
        .from('content_access_log')
        .select('*')
        .eq('user_id', userId)
        .order('accessed_at', { ascending: false })
        .limit(20);

      return new Response(JSON.stringify({
        user: profile,
        access: access || [],
        recentActivity: logs || [],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all users with their access counts
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        article_access(count)
      `)
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Profiles fetch error:', profilesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get recent access logs for dashboard
    const { data: recentLogs, error: logsError } = await supabaseAdmin
      .from('content_access_log')
      .select('*, profiles(email, display_name)')
      .order('accessed_at', { ascending: false })
      .limit(50);

    return new Response(JSON.stringify({
      users: profiles || [],
      recentActivity: recentLogs || [],
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
