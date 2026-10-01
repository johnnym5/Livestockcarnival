CREATE TABLE IF NOT EXISTS public.cms_user_permissions (
  user_id UUID NOT NULL REFERENCES public.cms_users(user_id) ON DELETE CASCADE,
  permission_key TEXT NOT NULL CHECK (permission_key IN (
    'stories', 'galleries', 'media_storage', 'homepage_cards',
    'page_magazine', 'page_schedule', 'page_livestock', 'page_fashion',
    'animation_settings', 'live_chat'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, permission_key)
);

ALTER TABLE public.cms_user_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "editors read own permissions" ON public.cms_user_permissions;
CREATE POLICY "editors read own permissions" ON public.cms_user_permissions
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
GRANT SELECT ON public.cms_user_permissions TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.cms_user_permissions FROM authenticated;

-- Preserve the current access of existing editors. Super admins continue to bypass grants.
INSERT INTO public.cms_user_permissions (user_id, permission_key)
SELECT u.user_id, permission.permission_key
FROM public.cms_users u
CROSS JOIN (VALUES
  ('stories'), ('galleries'), ('media_storage'), ('homepage_cards'),
  ('page_magazine'), ('page_schedule'), ('page_livestock'), ('page_fashion'),
  ('animation_settings'), ('live_chat')
) AS permission(permission_key)
WHERE u.role = 'editorial'
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.cms_has_permission(requested_permission TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cms_users u
    WHERE u.user_id = (SELECT auth.uid())
      AND (u.role = 'super_admin' OR EXISTS (
        SELECT 1 FROM public.cms_user_permissions p
        WHERE p.user_id = u.user_id AND p.permission_key = requested_permission
      ))
  );
$$;
REVOKE ALL ON FUNCTION public.cms_has_permission(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cms_has_permission(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.cms_replace_editor_permissions(actor_id UUID, target_user_id UUID, requested_permissions TEXT[])
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.cms_users WHERE user_id = actor_id AND role = 'super_admin') THEN
    RAISE EXCEPTION 'Super-admin access is required.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.cms_users WHERE user_id = target_user_id AND role = 'editorial') THEN
    RAISE EXCEPTION 'Editorial account not found.';
  END IF;
  IF requested_permissions IS NULL OR cardinality(requested_permissions) = 0 OR EXISTS (
    SELECT 1 FROM unnest(requested_permissions) AS requested(permission_key)
    WHERE requested.permission_key NOT IN ('stories','galleries','media_storage','homepage_cards','page_magazine','page_schedule','page_livestock','page_fashion','animation_settings','live_chat')
  ) THEN
    RAISE EXCEPTION 'Select at least one valid access area.';
  END IF;
  DELETE FROM public.cms_user_permissions WHERE user_id = target_user_id;
  INSERT INTO public.cms_user_permissions (user_id, permission_key)
    SELECT target_user_id, permission_key FROM unnest(requested_permissions) AS p(permission_key)
    ON CONFLICT DO NOTHING;
END;
$$;
REVOKE ALL ON FUNCTION public.cms_replace_editor_permissions(UUID, UUID, TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cms_replace_editor_permissions(UUID, UUID, TEXT[]) TO service_role;

-- Page-specific editorial policies.
DROP POLICY IF EXISTS "public read published site page content" ON public.site_page_content;
CREATE POLICY "public read published site page content" ON public.site_page_content
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.cms_has_permission('page_' || page_key));
DROP POLICY IF EXISTS "editorial users write site page content" ON public.site_page_content;
CREATE POLICY "editorial users write site page content" ON public.site_page_content
  FOR ALL TO authenticated
  USING (public.cms_has_permission('page_' || page_key))
  WITH CHECK (public.cms_has_permission('page_' || page_key));

DROP POLICY IF EXISTS "editorial users write homepage motion settings" ON public.homepage_motion_settings;
CREATE POLICY "editorial users write homepage motion settings" ON public.homepage_motion_settings
  FOR ALL TO authenticated USING (public.cms_has_permission('animation_settings'))
  WITH CHECK (public.cms_has_permission('animation_settings'));

CREATE TABLE IF NOT EXISTS public.site_animation_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.site_animation_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read site animation settings" ON public.site_animation_settings;
CREATE POLICY "public read site animation settings" ON public.site_animation_settings
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "editorial users write site animation settings" ON public.site_animation_settings;
CREATE POLICY "editorial users write site animation settings" ON public.site_animation_settings
  FOR ALL TO authenticated USING (public.cms_has_permission('animation_settings'))
  WITH CHECK (public.cms_has_permission('animation_settings'));
GRANT SELECT ON public.site_animation_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_animation_settings TO authenticated;
INSERT INTO public.site_animation_settings (id, settings) VALUES (1, '{
  "defaults": {
    "transitionEffect": "blur-fade",
    "transitionDuration": 0.5,
    "homepageRevealDuration": 3,
    "scrollDuration": 0.85,
    "scrollRevealDuration": 0.5,
    "skeletonDuration": 1.4,
    "skeletonEnabled": true,
    "interactionDuration": 0.2,
    "cardDeckEnabled": true
  },
  "pageOverrides": {}
}'::jsonb) ON CONFLICT (id) DO NOTHING;

-- Lock existing editorial records to the specific content areas granted to them.
DROP POLICY IF EXISTS "public read published media posts" ON public.media_posts;
CREATE POLICY "public read published media posts" ON public.media_posts
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.cms_has_permission('stories'));
DROP POLICY IF EXISTS "editorial users insert media posts" ON public.media_posts;
CREATE POLICY "editorial users insert media posts" ON public.media_posts
  FOR INSERT TO authenticated WITH CHECK (public.cms_has_permission('stories'));
DROP POLICY IF EXISTS "editorial users update media posts" ON public.media_posts;
CREATE POLICY "editorial users update media posts" ON public.media_posts
  FOR UPDATE TO authenticated USING (public.cms_has_permission('stories')) WITH CHECK (public.cms_has_permission('stories'));
DROP POLICY IF EXISTS "editorial users delete media posts" ON public.media_posts;
CREATE POLICY "editorial users delete media posts" ON public.media_posts
  FOR DELETE TO authenticated USING (public.cms_has_permission('stories'));

DROP POLICY IF EXISTS "public read published media galleries" ON public.media_galleries;
CREATE POLICY "public read published media galleries" ON public.media_galleries
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.cms_has_permission('galleries'));
DROP POLICY IF EXISTS "editorial users insert media galleries" ON public.media_galleries;
CREATE POLICY "editorial users insert media galleries" ON public.media_galleries
  FOR INSERT TO authenticated WITH CHECK (public.cms_has_permission('galleries'));
DROP POLICY IF EXISTS "editorial users update media galleries" ON public.media_galleries;
CREATE POLICY "editorial users update media galleries" ON public.media_galleries
  FOR UPDATE TO authenticated USING (public.cms_has_permission('galleries')) WITH CHECK (public.cms_has_permission('galleries'));
DROP POLICY IF EXISTS "editorial users delete media galleries" ON public.media_galleries;
CREATE POLICY "editorial users delete media galleries" ON public.media_galleries
  FOR DELETE TO authenticated USING (public.cms_has_permission('galleries'));

DROP POLICY IF EXISTS "public read published homepage cards" ON public.homepage_cards;
CREATE POLICY "public read published homepage cards" ON public.homepage_cards
  FOR SELECT TO anon, authenticated USING ((status = 'published' AND enabled) OR public.cms_has_permission('homepage_cards'));
DROP POLICY IF EXISTS "editorial users insert homepage cards" ON public.homepage_cards;
CREATE POLICY "editorial users insert homepage cards" ON public.homepage_cards
  FOR INSERT TO authenticated WITH CHECK (public.cms_has_permission('homepage_cards'));
DROP POLICY IF EXISTS "editorial users update homepage cards" ON public.homepage_cards;
CREATE POLICY "editorial users update homepage cards" ON public.homepage_cards
  FOR UPDATE TO authenticated USING (public.cms_has_permission('homepage_cards')) WITH CHECK (public.cms_has_permission('homepage_cards'));
DROP POLICY IF EXISTS "editorial users delete homepage cards" ON public.homepage_cards;
CREATE POLICY "editorial users delete homepage cards" ON public.homepage_cards
  FOR DELETE TO authenticated USING (public.cms_has_permission('homepage_cards'));

DROP POLICY IF EXISTS "editorial users upload media assets" ON storage.objects;
CREATE POLICY "editorial users upload media assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media-assets' AND public.cms_has_permission('media_storage'));
DROP POLICY IF EXISTS "editorial users update media assets" ON storage.objects;
CREATE POLICY "editorial users update media assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media-assets' AND public.cms_has_permission('media_storage'))
  WITH CHECK (bucket_id = 'media-assets' AND public.cms_has_permission('media_storage'));
DROP POLICY IF EXISTS "editorial users delete media assets" ON storage.objects;
CREATE POLICY "editorial users delete media assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media-assets' AND public.cms_has_permission('media_storage'));

DROP POLICY IF EXISTS "Users can view own thread or admin views all" ON public.chat_threads;
CREATE POLICY "Users can view own thread or admin views all" ON public.chat_threads
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()) OR public.cms_has_permission('live_chat'));
DROP POLICY IF EXISTS "Users and admin can update threads" ON public.chat_threads;
CREATE POLICY "Users and admin can update threads" ON public.chat_threads
  FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()) OR public.cms_has_permission('live_chat'))
  WITH CHECK (user_id = (SELECT auth.uid()) OR public.cms_has_permission('live_chat'));
DROP POLICY IF EXISTS "Users and admin view thread messages" ON public.chat_messages;
CREATE POLICY "Users and admin view thread messages" ON public.chat_messages
  FOR SELECT TO authenticated USING (
    thread_id IN (SELECT id FROM public.chat_threads WHERE user_id = (SELECT auth.uid()))
    OR public.cms_has_permission('live_chat')
  );
DROP POLICY IF EXISTS "Users and admin insert thread messages" ON public.chat_messages;
CREATE POLICY "Users and admin insert thread messages" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK (
    thread_id IN (SELECT id FROM public.chat_threads WHERE user_id = (SELECT auth.uid()))
    OR public.cms_has_permission('live_chat')
  );
