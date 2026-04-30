ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS file_type text NOT NULL DEFAULT 'pdf';

ALTER TABLE public.documents
DROP CONSTRAINT IF EXISTS documents_file_type_check;

ALTER TABLE public.documents
ADD CONSTRAINT documents_file_type_check
CHECK (file_type ~ '^[a-z0-9]{1,12}$');