-- Keep editor-access updates compatible with deployments that still have the original
-- non-empty-list function definition. An empty list intentionally revokes all access.
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
  IF requested_permissions IS NULL OR EXISTS (
    SELECT 1 FROM unnest(requested_permissions) AS requested(permission_key)
    WHERE requested.permission_key NOT IN ('stories','galleries','media_storage','homepage_cards','page_magazine','page_schedule','page_livestock','page_fashion','animation_settings','live_chat')
  ) THEN
    RAISE EXCEPTION 'The access list contains an invalid area.';
  END IF;

  DELETE FROM public.cms_user_permissions WHERE user_id = target_user_id;
  INSERT INTO public.cms_user_permissions (user_id, permission_key)
    SELECT target_user_id, permission_key FROM unnest(requested_permissions) AS p(permission_key)
    ON CONFLICT DO NOTHING;
END;
$$;
REVOKE ALL ON FUNCTION public.cms_replace_editor_permissions(UUID, UUID, TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cms_replace_editor_permissions(UUID, UUID, TEXT[]) TO service_role;
