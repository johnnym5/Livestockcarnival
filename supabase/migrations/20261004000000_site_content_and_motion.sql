CREATE TABLE IF NOT EXISTS public.site_page_content (
  page_key TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_page_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read published site page content" ON public.site_page_content;
CREATE POLICY "public read published site page content" ON public.site_page_content
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.cms_has_editor_access());
DROP POLICY IF EXISTS "editorial users write site page content" ON public.site_page_content;
CREATE POLICY "editorial users write site page content" ON public.site_page_content
  FOR ALL TO authenticated USING (public.cms_has_editor_access()) WITH CHECK (public.cms_has_editor_access());
GRANT SELECT ON public.site_page_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_page_content TO authenticated;

CREATE TABLE IF NOT EXISTS public.homepage_motion_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.homepage_motion_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read homepage motion settings" ON public.homepage_motion_settings;
CREATE POLICY "public read homepage motion settings" ON public.homepage_motion_settings
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "editorial users write homepage motion settings" ON public.homepage_motion_settings;
CREATE POLICY "editorial users write homepage motion settings" ON public.homepage_motion_settings
  FOR ALL TO authenticated USING (public.cms_has_editor_access()) WITH CHECK (public.cms_has_editor_access());
GRANT SELECT ON public.homepage_motion_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_motion_settings TO authenticated;

INSERT INTO public.homepage_motion_settings (id, settings) VALUES
(1, '{"stackStartY":0.82,"stackScaleDesktop":0.66,"stackScaleMobile":0.86,"stackPeek":0.33,"fanSpreadDesktop":68,"fanSpreadMobile":54,"fanDuration":1.7,"riseDuration":0.72,"flipDuration":0.72,"magazineScale":0.88,"magazineBlurDesktop":2,"magazineBlurMobile":0.9}'::jsonb)
ON CONFLICT (id) DO NOTHING;
