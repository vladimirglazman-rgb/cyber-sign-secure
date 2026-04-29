-- Ensure 'contracts' bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Clean previous policies
DROP POLICY IF EXISTS "Allow Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Auth Select" ON storage.objects;
DROP POLICY IF EXISTS "contracts_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "contracts_owner_select" ON storage.objects;
DROP POLICY IF EXISTS "contracts_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "contracts_owner_delete" ON storage.objects;

-- Owner-scoped policies: path must start with the user's uid as the first folder
CREATE POLICY "contracts_owner_insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'contracts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "contracts_owner_select" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'contracts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "contracts_owner_update" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'contracts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "contracts_owner_delete" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'contracts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);