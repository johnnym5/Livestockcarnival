-- Domain accounts become editorial staff automatically. New staff receive all
-- content areas by default, but animation access remains an explicit admin grant.
CREATE OR REPLACE FUNCTION public.cms_register_domain_staff()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  inserted_user_id UUID;
BEGIN
  IF NEW.email IS NULL
     OR right(lower(btrim(NEW.email)), length('@livestockcarnival.ng')) <> '@livestockcarnival.ng'
     OR position('@' IN lower(btrim(NEW.email))) <> length(lower(btrim(NEW.email))) - length('@livestockcarnival.ng') + 1 THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.cms_users (user_id, email, display_name, role)
  VALUES (
    NEW.id,
    lower(btrim(NEW.email)),
    COALESCE(NULLIF(btrim(NEW.raw_user_meta_data ->> 'display_name'), ''),
             NULLIF(btrim(NEW.raw_user_meta_data ->> 'full_name'), ''),
             split_part(NEW.email, '@', 1)),
    'editorial'
  )
  ON CONFLICT (user_id) DO NOTHING
  RETURNING user_id INTO inserted_user_id;

  IF inserted_user_id IS NOT NULL THEN
    INSERT INTO public.cms_user_permissions (user_id, permission_key)
    VALUES
      (inserted_user_id, 'stories'),
      (inserted_user_id, 'galleries'),
      (inserted_user_id, 'media_storage'),
      (inserted_user_id, 'homepage_cards'),
      (inserted_user_id, 'page_magazine'),
      (inserted_user_id, 'page_schedule'),
      (inserted_user_id, 'page_livestock'),
      (inserted_user_id, 'page_fashion'),
      (inserted_user_id, 'live_chat')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.cms_register_domain_staff() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS cms_register_domain_staff ON auth.users;
CREATE TRIGGER cms_register_domain_staff
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.cms_register_domain_staff();

-- Register domain accounts that were created in Supabase before this migration.
WITH inserted_staff AS (
  INSERT INTO public.cms_users (user_id, email, display_name, role)
  SELECT
    u.id,
    lower(btrim(u.email)),
    COALESCE(NULLIF(btrim(u.raw_user_meta_data ->> 'display_name'), ''),
             NULLIF(btrim(u.raw_user_meta_data ->> 'full_name'), ''),
             split_part(u.email, '@', 1)),
    'editorial'
  FROM auth.users u
  WHERE u.email IS NOT NULL
    AND right(lower(btrim(u.email)), length('@livestockcarnival.ng')) = '@livestockcarnival.ng'
    AND position('@' IN lower(btrim(u.email))) = length(lower(btrim(u.email))) - length('@livestockcarnival.ng') + 1
  ON CONFLICT (user_id) DO NOTHING
  RETURNING user_id
)
INSERT INTO public.cms_user_permissions (user_id, permission_key)
SELECT inserted_staff.user_id, permissions.permission_key
FROM inserted_staff
CROSS JOIN (VALUES
  ('stories'), ('galleries'), ('media_storage'), ('homepage_cards'),
  ('page_magazine'), ('page_schedule'), ('page_livestock'), ('page_fashion'), ('live_chat')
) AS permissions(permission_key)
ON CONFLICT DO NOTHING;

-- Give the requested support account all content workspaces and keep animation
-- access off. Super-admin profiles, if any, are not downgraded.
INSERT INTO public.cms_users (user_id, email, display_name, role)
SELECT u.id, lower(btrim(u.email)), 'Support', 'editorial'
FROM auth.users u
WHERE lower(btrim(u.email)) = 'support@livestockcarnival.ng'
ON CONFLICT (user_id) DO UPDATE
  SET email = EXCLUDED.email,
      display_name = CASE WHEN public.cms_users.display_name = '' THEN EXCLUDED.display_name ELSE public.cms_users.display_name END
  WHERE public.cms_users.role = 'editorial';

INSERT INTO public.cms_user_permissions (user_id, permission_key)
SELECT staff.user_id, permissions.permission_key
FROM public.cms_users staff
CROSS JOIN (VALUES
  ('stories'), ('galleries'), ('media_storage'), ('homepage_cards'),
  ('page_magazine'), ('page_schedule'), ('page_livestock'), ('page_fashion'), ('live_chat')
) AS permissions(permission_key)
WHERE lower(staff.email) = 'support@livestockcarnival.ng'
  AND staff.role = 'editorial'
ON CONFLICT DO NOTHING;

DELETE FROM public.cms_user_permissions permissions
USING public.cms_users staff
WHERE permissions.user_id = staff.user_id
  AND lower(staff.email) = 'support@livestockcarnival.ng'
  AND staff.role = 'editorial'
  AND permissions.permission_key = 'animation_settings';

-- An empty list is an intentional full revocation; only super admins can call
-- this service-role RPC, and it still accepts only known permission keys.
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
