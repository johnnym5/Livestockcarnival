import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const appUrl = Deno.env.get('SITE_URL') ?? 'https://livestockcarnival.ng';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const authorization = request.headers.get('Authorization');
  const accessToken = authorization?.replace(/^Bearer\s+/i, '');
  if (!accessToken || !supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse(401, { error: 'A valid signed-in session is required.' });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userResult, error: authError } = await userClient.auth.getUser(accessToken);
  if (authError || !userResult.user) {
    return jsonResponse(401, { error: 'Your session is invalid or expired.' });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: profile, error: profileError } = await adminClient
    .from('cms_users')
    .select('role')
    .eq('user_id', userResult.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== 'super_admin') {
    return jsonResponse(403, { error: 'Super-admin access is required for user management.' });
  }

  let body: { action?: string; email?: string; display_name?: string; user_id?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: 'Request body must be valid JSON.' });
  }

  if (body.action === 'list') {
    const { data, error } = await adminClient
      .from('cms_users')
      .select('user_id,email,display_name,role,created_at')
      .order('created_at', { ascending: false });

    if (error) return jsonResponse(500, { error: 'Unable to load editorial accounts.' });
    return jsonResponse(200, { users: data ?? [] });
  }

  if (body.action === 'invite') {
    const email = body.email?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(400, { error: 'Enter a valid email address.' });
    }
    if (email === 'admin@livestockcarnival.ng') {
      return jsonResponse(400, { error: 'The super-admin account cannot be re-invited as an editor.' });
    }

    const { data: invitation, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { display_name: body.display_name?.trim() ?? '' },
      redirectTo: `${appUrl.replace(/\/$/, '')}/admin/accept-invite`,
    });

    if (inviteError || !invitation.user) {
      return jsonResponse(400, { error: inviteError?.message ?? 'Could not send the invitation.' });
    }

    const { error: insertError } = await adminClient.from('cms_users').insert({
      user_id: invitation.user.id,
      email,
      display_name: body.display_name?.trim() ?? '',
      role: 'editorial',
    });

    if (insertError) {
      await adminClient.auth.admin.deleteUser(invitation.user.id);
      return jsonResponse(500, { error: 'Invitation could not be registered. Please try again.' });
    }

    return jsonResponse(201, { invited: true, email });
  }

  if (body.action === 'remove') {
    if (!body.user_id || body.user_id === userResult.user.id) {
      return jsonResponse(400, { error: 'Choose another editorial account to remove.' });
    }

    const { data: target, error: targetError } = await adminClient
      .from('cms_users')
      .select('role')
      .eq('user_id', body.user_id)
      .maybeSingle();

    if (targetError || !target || target.role !== 'editorial') {
      return jsonResponse(404, { error: 'Editorial account not found.' });
    }

    const { error: removeError } = await adminClient.auth.admin.deleteUser(body.user_id);
    if (removeError) return jsonResponse(500, { error: 'Could not remove this account.' });
    return jsonResponse(200, { removed: true });
  }

  return jsonResponse(400, { error: 'Unsupported user-management action.' });
});