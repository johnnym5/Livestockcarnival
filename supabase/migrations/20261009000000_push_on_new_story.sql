-- Story-created campaigns are system generated, so they do not belong to a CMS sender.
ALTER TABLE public.push_campaigns ALTER COLUMN created_by DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.queue_push_campaign_for_new_story()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status <> 'published' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status = 'published' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.push_campaigns (title, body, url, scheduled_at, status, created_by)
  VALUES (
    LEFT('New story: ' || BTRIM(NEW.title), 100),
    LEFT(COALESCE(NULLIF(BTRIM(NEW.excerpt), ''), 'Read the latest story from the National Livestock Carnival newsroom.'), 240),
    'https://livestockcarnival.ng/media',
    NOW(),
    'queued',
    NULL
  );

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.queue_push_campaign_for_new_story() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS queue_push_campaign_for_new_story ON public.media_posts;
CREATE TRIGGER queue_push_campaign_for_new_story
  AFTER INSERT OR UPDATE OF status ON public.media_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_push_campaign_for_new_story();
