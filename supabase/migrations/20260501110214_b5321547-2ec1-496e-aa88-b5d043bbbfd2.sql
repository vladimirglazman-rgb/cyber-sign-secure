-- 1) Remove overly permissive storage policies on contracts bucket.
-- Keep only owner-scoped policies (folder name = auth.uid()).
DROP POLICY IF EXISTS "Allow Auth Select" ON storage.objects;
DROP POLICY IF EXISTS "Allow Auth Upload" ON storage.objects;

-- 2) Lock down SECURITY DEFINER helper functions that should never be called
-- directly by clients. The signing RPCs (peek_signing_token, get_signing_context,
-- sign_recipient, mark_recipient_opened) MUST stay callable by anon because the
-- public /sign/:token flow uses them, but they are gated by an unguessable
-- token + verification value, so this is intentional.

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 3) Realtime: remove documents and recipients from the realtime publication.
-- Supabase Realtime currently broadcasts row changes to any authenticated
-- subscriber that knows the channel topic; without realtime.messages RLS it
-- leaks recipient PII (email, phone, signing_token, signature_data_url) and
-- cross-tenant document changes. Until per-channel authorization is added,
-- the dashboard should refresh via query invalidation instead.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'recipients'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.recipients';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'documents'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.documents';
  END IF;
END $$;