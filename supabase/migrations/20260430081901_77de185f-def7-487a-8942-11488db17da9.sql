ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS version text NOT NULL DEFAULT 'v1.0.4';