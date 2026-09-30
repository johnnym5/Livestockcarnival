CREATE TABLE IF NOT EXISTS public.cms_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'editorial')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cms_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms users read own profile" ON public.cms_users;
CREATE POLICY "cms users read own profile"
  ON public.cms_users
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.cms_has_editor_access()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cms_users
    WHERE user_id = (SELECT auth.uid())
      AND role IN ('super_admin', 'editorial')
  );
$$;

REVOKE ALL ON FUNCTION public.cms_has_editor_access() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cms_has_editor_access() TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.media_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Newsroom',
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  cover_image_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS media_posts_publication_idx
  ON public.media_posts (status, published_at DESC);

ALTER TABLE public.media_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read published media posts" ON public.media_posts;
CREATE POLICY "public read published media posts"
  ON public.media_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.cms_has_editor_access());

DROP POLICY IF EXISTS "editorial users insert media posts" ON public.media_posts;
CREATE POLICY "editorial users insert media posts"
  ON public.media_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.cms_has_editor_access());

DROP POLICY IF EXISTS "editorial users update media posts" ON public.media_posts;
CREATE POLICY "editorial users update media posts"
  ON public.media_posts
  FOR UPDATE
  TO authenticated
  USING (public.cms_has_editor_access())
  WITH CHECK (public.cms_has_editor_access());

DROP POLICY IF EXISTS "editorial users delete media posts" ON public.media_posts;
CREATE POLICY "editorial users delete media posts"
  ON public.media_posts
  FOR DELETE
  TO authenticated
  USING (public.cms_has_editor_access());

GRANT SELECT ON public.media_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_posts TO authenticated;
GRANT SELECT ON public.cms_users TO authenticated;

CREATE OR REPLACE FUNCTION public.set_media_posts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS media_posts_updated_at ON public.media_posts;
CREATE TRIGGER media_posts_updated_at
  BEFORE UPDATE ON public.media_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_media_posts_updated_at();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-assets',
  'media-assets',
  TRUE,
  12582912,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "public read media assets" ON storage.objects;
CREATE POLICY "public read media assets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media-assets');

DROP POLICY IF EXISTS "editorial users upload media assets" ON storage.objects;
CREATE POLICY "editorial users upload media assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media-assets' AND public.cms_has_editor_access());

DROP POLICY IF EXISTS "editorial users update media assets" ON storage.objects;
CREATE POLICY "editorial users update media assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media-assets' AND public.cms_has_editor_access())
  WITH CHECK (bucket_id = 'media-assets' AND public.cms_has_editor_access());

DROP POLICY IF EXISTS "editorial users delete media assets" ON storage.objects;
CREATE POLICY "editorial users delete media assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'media-assets' AND public.cms_has_editor_access());

INSERT INTO public.cms_users (user_id, email, display_name, role)
SELECT id, LOWER(email), 'Super Admin', 'super_admin'
FROM auth.users
WHERE LOWER(email) = 'admin@livestockcarnival.ng'
ON CONFLICT (user_id) DO UPDATE
SET email = EXCLUDED.email,
    role = 'super_admin';

