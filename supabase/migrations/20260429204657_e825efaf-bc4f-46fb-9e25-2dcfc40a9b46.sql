
INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Auth Select" ON storage.objects;
DROP POLICY IF EXISTS "Allow Anon Upload" ON storage.objects;
DROP POLICY IF EXISTS "contracts_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "contracts_owner_select" ON storage.objects;
DROP POLICY IF EXISTS "contracts_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "contracts_owner_delete" ON storage.objects;

CREATE POLICY "Allow Auth Upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'contracts');

CREATE POLICY "Allow Auth Select" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'contracts');
