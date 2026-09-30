CREATE TABLE IF NOT EXISTS public.media_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  description TEXT NOT NULL DEFAULT '' CHECK (char_length(description) <= 500),
  images JSONB NOT NULL CHECK (jsonb_typeof(images) = 'array' AND jsonb_array_length(images) BETWEEN 1 AND 10),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS media_galleries_publication_idx
  ON public.media_galleries (status, published_at DESC);

ALTER TABLE public.media_galleries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read published media galleries" ON public.media_galleries;
CREATE POLICY "public read published media galleries"
  ON public.media_galleries
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.cms_has_editor_access());

DROP POLICY IF EXISTS "editorial users insert media galleries" ON public.media_galleries;
CREATE POLICY "editorial users insert media galleries"
  ON public.media_galleries
  FOR INSERT
  TO authenticated
  WITH CHECK (public.cms_has_editor_access());

DROP POLICY IF EXISTS "editorial users update media galleries" ON public.media_galleries;
CREATE POLICY "editorial users update media galleries"
  ON public.media_galleries
  FOR UPDATE
  TO authenticated
  USING (public.cms_has_editor_access())
  WITH CHECK (public.cms_has_editor_access());

DROP POLICY IF EXISTS "editorial users delete media galleries" ON public.media_galleries;
CREATE POLICY "editorial users delete media galleries"
  ON public.media_galleries
  FOR DELETE
  TO authenticated
  USING (public.cms_has_editor_access());

GRANT SELECT ON public.media_galleries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_galleries TO authenticated;

DROP TRIGGER IF EXISTS media_galleries_updated_at ON public.media_galleries;
CREATE TRIGGER media_galleries_updated_at
  BEFORE UPDATE ON public.media_galleries
  FOR EACH ROW
  EXECUTE FUNCTION public.set_media_posts_updated_at();
