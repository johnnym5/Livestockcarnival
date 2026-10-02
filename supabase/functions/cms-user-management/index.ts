import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const appUrl = Deno.env.get('SITE_URL') ?? 'https://livestockcarnival.ng';
const permissionKeys = new Set([
  'stories', 'galleries', 'media_storage', 'homepage_cards', 'page_magazine',
  'page_schedule', 'page_livestock', 'page_fashion', 'animation_settings', 'live_chat', 'push_notifications',
]);

const parsePermissions = (input: unknown): string[] | null => {
  if (!Array.isArray(input)) return null;
  const values = [...new Set(input.filter((value): value is string => typeof value === 'string'))];
  if (values.length !== input.length || values.some((value) => !permissionKeys.has(value))) return null;
  return values;
};

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

  let body: { action?: string; email?: string; display_name?: string; user_id?: string; permissions?: unknown };
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
    const { data: grants, error: grantsError } = await adminClient.from('cms_user_permissions').select('user_id,permission_key');
    if (grantsError) return jsonResponse(500, { error: 'Unable to load editor permissions.' });
    const permissionsByUser = new Map<string, string[]>();
    for (const grant of grants ?? []) permissionsByUser.set(grant.user_id, [...(permissionsByUser.get(grant.user_id) ?? []), grant.permission_key]);
    return jsonResponse(200, { users: (data ?? []).map((staff) => ({ ...staff, permissions: permissionsByUser.get(staff.user_id) ?? [] })) });
  }

  if (body.action === 'invite') {
    const permissions = parsePermissions(body.permissions);
    if (!permissions?.length) return jsonResponse(400, { error: 'Select at least one valid access area for this editor.' });
    if (!body.display_name?.trim()) return jsonResponse(400, { error: 'Enter the staff member’s name.' });
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

    const { error: insertError } = await adminClient.from('cms_users').upsert({
      user_id: invitation.user.id,
      email,
      display_name: body.display_name?.trim() ?? '',
      role: 'editorial',
    }, { onConflict: 'user_id' });

    if (insertError) {
      await adminClient.auth.admin.deleteUser(invitation.user.id);
      return jsonResponse(500, { error: 'Invitation could not be registered. Please try again.' });
    }

    const { error: permissionsError } = await adminClient.rpc('cms_replace_editor_permissions', {
      actor_id: userResult.user.id, target_user_id: invitation.user.id, requested_permissions: permissions,
    });
    if (permissionsError) {
      await adminClient.auth.admin.deleteUser(invitation.user.id);
      return jsonResponse(500, { error: 'The editor access could not be saved. Please try again.' });
    }

    return jsonResponse(201, { invited: true, email });
  }

  if (body.action === 'update_permissions') {
    const permissions = parsePermissions(body.permissions);
    if (!body.user_id || !permissions) return jsonResponse(400, { error: 'Choose a user and provide a valid access list.' });
    const { error: replaceError } = await adminClient.rpc('cms_replace_editor_permissions', {
      actor_id: userResult.user.id, target_user_id: body.user_id, requested_permissions: permissions,
    });
    if (replaceError) return jsonResponse(400, { error: replaceError.message || 'Could not update editor access.' });
    return jsonResponse(200, { updated: true, permissions });
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
