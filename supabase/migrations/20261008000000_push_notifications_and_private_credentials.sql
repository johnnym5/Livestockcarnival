-- Allow an explicitly granted editor permission to publish public announcements.
ALTER TABLE public.cms_user_permissions DROP CONSTRAINT IF EXISTS cms_user_permissions_permission_key_check;
ALTER TABLE public.cms_user_permissions ADD CONSTRAINT cms_user_permissions_permission_key_check CHECK (permission_key IN (
  'stories','galleries','media_storage','homepage_cards','page_magazine','page_schedule',
  'page_livestock','page_fashion','animation_settings','live_chat','push_notifications'
));

CREATE OR REPLACE FUNCTION public.cms_replace_editor_permissions(actor_id UUID, target_user_id UUID, requested_permissions TEXT[])
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.cms_users WHERE user_id = actor_id AND role = 'super_admin') THEN RAISE EXCEPTION 'Super-admin access is required.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.cms_users WHERE user_id = target_user_id AND role = 'editorial') THEN RAISE EXCEPTION 'Editorial account not found.'; END IF;
  IF requested_permissions IS NULL OR EXISTS (
    SELECT 1 FROM unnest(requested_permissions) AS requested(permission_key)
    WHERE requested.permission_key NOT IN ('stories','galleries','media_storage','homepage_cards','page_magazine','page_schedule','page_livestock','page_fashion','animation_settings','live_chat','push_notifications')
  ) THEN RAISE EXCEPTION 'The access list contains an invalid area.'; END IF;
  DELETE FROM public.cms_user_permissions WHERE user_id = target_user_id;
  INSERT INTO public.cms_user_permissions(user_id, permission_key)
    SELECT target_user_id, permission_key FROM unnest(requested_permissions) AS p(permission_key) ON CONFLICT DO NOTHING;
END; $$;
REVOKE ALL ON FUNCTION public.cms_replace_editor_permissions(UUID, UUID, TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cms_replace_editor_permissions(UUID, UUID, TEXT[]) TO service_role;

-- Accreditation credentials contain identity documents and must not be public.
UPDATE storage.buckets SET public = false, file_size_limit = 5242880, allowed_mime_types = ARRAY['application/pdf']
WHERE id = 'credentials';
ALTER TABLE public.accreditations RENAME COLUMN file_url TO file_path;
UPDATE public.accreditations
SET file_path = regexp_replace(file_path, '^.*/storage/v1/object/public/credentials/', '')
WHERE file_path LIKE '%/storage/v1/object/public/credentials/%';
DROP POLICY IF EXISTS "Allow public upload to credentials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read credentials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read credentials" ON storage.objects;
CREATE POLICY "Public upload accreditation credential PDFs"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'credentials' AND name LIKE 'accreditations/%');

CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.push_subscriptions FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;

CREATE TABLE public.push_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 100),
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 240),
  url TEXT,
  scheduled_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('queued','sending','sent','failed')),
  created_by UUID NOT NULL REFERENCES public.cms_users(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX push_campaigns_due_idx ON public.push_campaigns(scheduled_at) WHERE status = 'queued';
CREATE INDEX push_campaigns_recent_idx ON public.push_campaigns(created_at DESC);
ALTER TABLE public.push_campaigns ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.push_campaigns FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.push_campaigns TO service_role;

CREATE TABLE public.push_api_rate_limits (
  fingerprint TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.push_api_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.push_api_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.push_api_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_push_rate_limit(request_fingerprint TEXT, max_hits INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_count INTEGER;
BEGIN
  INSERT INTO public.push_api_rate_limits(fingerprint, window_started_at, request_count, updated_at)
  VALUES(request_fingerprint, NOW(), 1, NOW())
  ON CONFLICT(fingerprint) DO UPDATE SET
    window_started_at = CASE WHEN public.push_api_rate_limits.window_started_at < NOW() - INTERVAL '1 hour' THEN NOW() ELSE public.push_api_rate_limits.window_started_at END,
    request_count = CASE WHEN public.push_api_rate_limits.window_started_at < NOW() - INTERVAL '1 hour' THEN 1 ELSE public.push_api_rate_limits.request_count + 1 END,
    updated_at = NOW()
  RETURNING request_count INTO current_count;
  RETURN current_count <= max_hits;
END; $$;
REVOKE ALL ON FUNCTION public.consume_push_rate_limit(TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_push_rate_limit(TEXT, INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.purge_push_data_retention()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.push_campaigns WHERE COALESCE(sent_at, created_at) < NOW() - INTERVAL '90 days';
  DELETE FROM public.push_api_rate_limits WHERE updated_at < NOW() - INTERVAL '3 hours';
END; $$;
REVOKE ALL ON FUNCTION public.purge_push_data_retention() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_push_data_retention() TO service_role;

CREATE OR REPLACE FUNCTION public.claim_due_push_campaigns()
RETURNS SETOF public.push_campaigns LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
    WITH due AS (
      SELECT id FROM public.push_campaigns WHERE status = 'queued' AND scheduled_at <= NOW()
      ORDER BY scheduled_at FOR UPDATE SKIP LOCKED LIMIT 50
    )
    UPDATE public.push_campaigns campaign SET status = 'sending'
    FROM due WHERE campaign.id = due.id RETURNING campaign.*;
END; $$;
REVOKE ALL ON FUNCTION public.claim_due_push_campaigns() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_due_push_campaigns() TO service_role;

-- Supabase Vault secrets named push_function_url and push_cron_secret must be
-- configured by the operator before the scheduled calls can succeed.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;
DO $$ BEGIN
  PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname IN ('livestock-push-dispatch','livestock-accreditation-cleanup','livestock-push-data-retention');
EXCEPTION WHEN undefined_table OR undefined_function THEN NULL;
END $$;
SELECT cron.schedule('livestock-push-dispatch', '* * * * *', $cron$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'push_function_url' LIMIT 1),
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'push_cron_secret' LIMIT 1),'x-push-cron','true'),
    body := '{"action":"dispatch_due"}'::jsonb
  );
$cron$);
SELECT cron.schedule('livestock-accreditation-cleanup', '10 2 * * *', $cron$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'push_function_url' LIMIT 1),
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'push_cron_secret' LIMIT 1),'x-push-cron','true'),
    body := '{"action":"cleanup_accreditations"}'::jsonb
  );
$cron$);
SELECT cron.schedule('livestock-push-data-retention', '30 2 * * *', $cron$
  SELECT public.purge_push_data_retention();
$cron$);
