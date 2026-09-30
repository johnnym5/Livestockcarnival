-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table: chat_threads
CREATE TABLE IF NOT EXISTS public.chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  last_message_text TEXT,
  last_message_timestamp TIMESTAMPTZ DEFAULT NOW(),
  unread_by_admin BOOLEAN DEFAULT TRUE,
  unread_by_user BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own thread or admin views all" ON public.chat_threads;
CREATE POLICY "Users can view own thread or admin views all"
  ON public.chat_threads
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.cms_has_editor_access());

DROP POLICY IF EXISTS "Users can insert own thread" ON public.chat_threads;
CREATE POLICY "Users can insert own thread"
  ON public.chat_threads
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users and admin can update threads" ON public.chat_threads;
CREATE POLICY "Users and admin can update threads"
  ON public.chat_threads
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.cms_has_editor_access())
  WITH CHECK (user_id = (SELECT auth.uid()) OR public.cms_has_editor_access());

-- 2. Table: chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX IF NOT EXISTS chat_messages_thread_idx ON public.chat_messages(thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_expires_idx ON public.chat_messages(expires_at);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users and admin view thread messages" ON public.chat_messages;
CREATE POLICY "Users and admin view thread messages"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (
    thread_id IN (SELECT id FROM public.chat_threads WHERE user_id = (SELECT auth.uid()))
    OR public.cms_has_editor_access()
  );

DROP POLICY IF EXISTS "Users and admin insert thread messages" ON public.chat_messages;
CREATE POLICY "Users and admin insert thread messages"
  ON public.chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    thread_id IN (SELECT id FROM public.chat_threads WHERE user_id = (SELECT auth.uid()))
    OR public.cms_has_editor_access()
  );

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.chat_threads TO authenticated;
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;

-- 3. Automated 24-Hour Message Purge Function
CREATE OR REPLACE FUNCTION public.purge_expired_chat_messages()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.chat_messages WHERE expires_at < NOW();
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_chat_messages() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purge_expired_chat_messages() TO authenticated;

-- Attempt pg_cron scheduling if extension is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('purge-chat-messages', '0 * * * *', 'SELECT public.purge_expired_chat_messages();');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END;
$$;

-- 4. Enable Supabase Realtime
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_threads;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END;
$$;
