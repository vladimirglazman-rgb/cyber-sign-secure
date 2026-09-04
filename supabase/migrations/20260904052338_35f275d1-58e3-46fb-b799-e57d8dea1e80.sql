ALTER TABLE public.demo_requests ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.demo_requests ALTER COLUMN company DROP NOT NULL;
ALTER TABLE public.demo_requests ALTER COLUMN email DROP NOT NULL;