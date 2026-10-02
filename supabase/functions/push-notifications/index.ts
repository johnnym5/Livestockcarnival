import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const siteOrigin = (Deno.env.get('SITE_URL') ?? 'https://livestockcarnival.ng').replace(/\/$/, '');
const cronSecret = Deno.env.get('PUSH_CRON_SECRET') ?? '';
const allowedOrigins = new Set([siteOrigin, 'https://www.livestockcarnival.ng', 'http://localhost:3000', 'http://localhost:3001']);
const permissionKey = 'push_notifications';

function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : siteOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
  };
}

function respond(status: number, body: Record<string, unknown>, origin: string | null) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}

function validOrigin(origin: string | null) { return Boolean(origin && allowedOrigins.has(origin)); }

const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function authorizeSender(request: Request) {
  const bearer = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!bearer) return { error: 'Sign in to send announcements.' } as const;
  const userClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: authError } = await userClient.auth.getUser(bearer);
  if (authError || !userData.user) return { error: 'Your session is invalid or expired.' } as const;
  const { data: profile, error: profileError } = await adminClient.from('cms_users').select('role').eq('user_id', userData.user.id).maybeSingle();
  if (profileError || !profile) return { error: 'This account is not authorized to send announcements.' } as const;
  if (profile.role === 'super_admin') return { userId: userData.user.id } as const;
  const { data: grant, error: grantError } = await adminClient.from('cms_user_permissions').select('permission_key').eq('user_id', userData.user.id).eq('permission_key', permissionKey).maybeSingle();
  if (grantError || !grant) return { error: 'Push-notification permission is required.' } as const;
  return { userId: userData.user.id } as const;
}

function validateMessage(input: Record<string, unknown>) {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const body = typeof input.message === 'string' ? input.message.trim() : '';
  if (!title || title.length > 100) return { error: 'Enter a title between 1 and 100 characters.' } as const;
  if (!body || body.length > 240) return { error: 'Enter a message between 1 and 240 characters.' } as const;
  let url: string | null = null;
  if (input.url !== null && input.url !== undefined && input.url !== '') {
    if (typeof input.url !== 'string') return { error: 'The destination link is invalid.' } as const;
    try {
      const parsed = new URL(input.url, siteOrigin);
      if (parsed.origin !== siteOrigin || parsed.protocol !== 'https:') return { error: 'Destination links must be secure pages on this website.' } as const;
      url = parsed.toString();
    } catch { return { error: 'The destination link is invalid.' } as const; }
  }
  return { title, body, url } as const;
}

async function deliverCampaign(campaign: Record<string, unknown>) {
  if (!vapidPublicKey || !vapidPrivateKey) throw new Error('VAPID keys are not configured.');
  webpush.setVapidDetails('mailto:info@livestockcarnival.ng', vapidPublicKey, vapidPrivateKey);
  const { data: subscriptions, error } = await adminClient.from('push_subscriptions').select('id,endpoint,p256dh,auth');
  if (error) throw error;
  let sent = 0;
  let failed = 0;
  const expired: string[] = [];
  const payload = JSON.stringify({ title: campaign.title, body: campaign.body, url: campaign.url ?? '/', tag: campaign.id });
  for (const subscription of subscriptions ?? []) {
    try {
      await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, payload, { TTL: 3600, urgency: 'normal' });
      sent += 1;
    } catch (error) {
      failed += 1;
      const statusCode = error && typeof error === 'object' && 'statusCode' in error ? Number(error.statusCode) : 0;
      if (statusCode === 404 || statusCode === 410) expired.push(subscription.id);
    }
  }
  if (expired.length) await adminClient.from('push_subscriptions').delete().in('id', expired);
  const { error: updateError } = await adminClient.from('push_campaigns').update({ status: 'sent', sent_count: sent, failed_count: failed, sent_at: new Date().toISOString() }).eq('id', campaign.id);
  if (updateError) throw updateError;
  return { sent, failed };
}

async function allowPublicRequest(request: Request, maxHits: number) {
  const sourceAddress = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(sourceAddress));
  const fingerprint = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  const { data, error } = await adminClient.rpc('consume_push_rate_limit', { request_fingerprint: fingerprint, max_hits: maxHits });
  if (error) throw error;
  return data === true;
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get('Origin');
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (request.method !== 'POST') return respond(405, { error: 'Method not allowed.' }, origin);
  if (!validOrigin(origin) && request.headers.get('x-push-cron') !== 'true') return respond(403, { error: 'Origin is not allowed.' }, origin);
  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return respond(400, { error: 'Request body must be valid JSON.' }, origin); }
  const action = input.action;

  if (action === 'public_key') {
    if (!vapidPublicKey) return respond(503, { error: 'Push notifications are not configured.' }, origin);
    return respond(200, { public_key: vapidPublicKey }, origin);
  }

  if (action === 'subscribe') {
    try { if (!(await allowPublicRequest(request, 10))) return respond(429, { error: 'Too many subscription attempts. Please try again later.' }, origin); }
    catch { return respond(503, { error: 'Subscription service is temporarily unavailable.' }, origin); }
    const subscription = input.subscription as Record<string, unknown> | null;
    const keys = subscription?.keys as Record<string, unknown> | null;
    if (typeof subscription?.endpoint !== 'string' || subscription.endpoint.length > 2048 || typeof keys?.p256dh !== 'string' || typeof keys?.auth !== 'string') {
      return respond(400, { error: 'The browser subscription is invalid.' }, origin);
    }
    try {
      const endpointUrl = new URL(subscription.endpoint);
      if (endpointUrl.protocol !== 'https:') throw new Error('Invalid endpoint scheme.');
    } catch { return respond(400, { error: 'The browser subscription endpoint is invalid.' }, origin); }
    const { error } = await adminClient.from('push_subscriptions').upsert({ endpoint: subscription.endpoint, p256dh: keys.p256dh, auth: keys.auth, consented_at: new Date().toISOString(), last_seen_at: new Date().toISOString() }, { onConflict: 'endpoint' });
    if (error) return respond(500, { error: 'Could not save the notification subscription.' }, origin);
    return respond(200, { subscribed: true }, origin);
  }

  if (action === 'unsubscribe') {
    try { if (!(await allowPublicRequest(request, 30))) return respond(429, { error: 'Too many requests. Please try again later.' }, origin); }
    catch { return respond(503, { error: 'Subscription service is temporarily unavailable.' }, origin); }
    if (typeof input.endpoint !== 'string' || input.endpoint.length > 2048) return respond(400, { error: 'A valid subscription endpoint is required.' }, origin);
    const { error } = await adminClient.from('push_subscriptions').delete().eq('endpoint', input.endpoint);
    if (error) return respond(500, { error: 'Could not remove the notification subscription.' }, origin);
    return respond(200, { unsubscribed: true }, origin);
  }

  if (action === 'dispatch_due') {
    const secret = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    if (!cronSecret || !secret || secret !== cronSecret || request.headers.get('x-push-cron') !== 'true') return respond(403, { error: 'Scheduled dispatch is not authorized.' }, origin);
    const { data: due, error } = await adminClient.rpc('claim_due_push_campaigns');
    if (error) return respond(500, { error: 'Could not claim scheduled announcements.' }, origin);
    const results = await Promise.all((due ?? []).map(async (campaign: Record<string, unknown>) => {
      try { return await deliverCampaign(campaign); }
      catch { await adminClient.from('push_campaigns').update({ status: 'failed' }).eq('id', campaign.id); return { sent: 0, failed: 1 }; }
    }));
    return respond(200, { campaigns: results.length }, origin);
  }

  if (action === 'cleanup_accreditations') {
    const secret = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    if (!cronSecret || !secret || secret !== cronSecret || request.headers.get('x-push-cron') !== 'true') return respond(403, { error: 'Scheduled cleanup is not authorized.' }, origin);
    if (Date.now() < Date.parse('2026-11-24T00:00:00+01:00')) return respond(200, { deleted: 0, reason: 'The event has not ended.' }, origin);
    const { data: rows, error } = await adminClient.from('accreditations').select('id,file_path').neq('status', 'pending');
    if (error) return respond(500, { error: 'Could not load completed accreditation records.' }, origin);
    let deleted = 0;
    for (const row of rows ?? []) {
      if (typeof row.file_path === 'string' && row.file_path) {
        const { error: storageError } = await adminClient.storage.from('credentials').remove([row.file_path]);
        if (storageError && !/not found/i.test(storageError.message)) continue;
      }
      const { error: deleteError } = await adminClient.from('accreditations').delete().eq('id', row.id).neq('status', 'pending');
      if (!deleteError) deleted += 1;
    }
    return respond(200, { deleted }, origin);
  }

  if (action === 'list') {
    const auth = await authorizeSender(request);
    if ('error' in auth) return respond(403, { error: auth.error }, origin);
    const { data, error } = await adminClient.from('push_campaigns').select('id,title,body,url,scheduled_at,status,sent_count,failed_count,created_at').order('created_at', { ascending: false }).limit(30);
    if (error) return respond(500, { error: 'Could not load announcements.' }, origin);
    return respond(200, { campaigns: data ?? [] }, origin);
  }

  if (action === 'cancel') {
    const auth = await authorizeSender(request);
    if ('error' in auth) return respond(403, { error: auth.error }, origin);
    if (typeof input.id !== 'string') return respond(400, { error: 'Choose a scheduled announcement.' }, origin);
    const { data, error } = await adminClient.from('push_campaigns').delete().eq('id', input.id).eq('status', 'queued').select('id').maybeSingle();
    if (error || !data) return respond(409, { error: 'This announcement is no longer queued.' }, origin);
    return respond(200, { cancelled: true }, origin);
  }

  if (action === 'send' || action === 'schedule') {
    const auth = await authorizeSender(request);
    if ('error' in auth) return respond(403, { error: auth.error }, origin);
    const validated = validateMessage(input);
    if ('error' in validated) return respond(400, { error: validated.error }, origin);
    const scheduledAt = action === 'schedule' && typeof input.scheduled_at === 'string' ? new Date(input.scheduled_at) : null;
    if (action === 'schedule' && (!scheduledAt || !Number.isFinite(scheduledAt.getTime()) || scheduledAt.getTime() < Date.now() + 60_000)) return respond(400, { error: 'Choose a valid send time at least one minute in the future.' }, origin);
    const { data: campaign, error } = await adminClient.from('push_campaigns').insert({ title: validated.title, body: validated.body, url: validated.url, scheduled_at: scheduledAt?.toISOString() ?? null, created_by: auth.userId, status: scheduledAt ? 'queued' : 'sending' }).select('id,title,body,url,scheduled_at,status,sent_count,failed_count,created_at').single();
    if (error || !campaign) return respond(500, { error: 'Could not save the announcement.' }, origin);
    if (scheduledAt) return respond(201, { scheduled: true, campaign }, origin);
    try {
      const counts = await deliverCampaign(campaign);
      return respond(200, { sent: counts.sent, failed: counts.failed, campaign: { ...campaign, ...counts, status: 'sent' } }, origin);
    } catch {
      await adminClient.from('push_campaigns').update({ status: 'failed' }).eq('id', campaign.id);
      return respond(500, { error: 'The announcement could not be delivered. Check VAPID configuration and try again.' }, origin);
    }
  }

  return respond(400, { error: 'Unsupported push-notification action.' }, origin);
});
