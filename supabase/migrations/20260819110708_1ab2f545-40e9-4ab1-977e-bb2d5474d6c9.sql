CREATE TABLE public.demo_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  company text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.demo_requests TO anon, authenticated;
GRANT SELECT ON public.demo_requests TO authenticated;
GRANT ALL ON public.demo_requests TO service_role;

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_requests_insert_public" ON public.demo_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "demo_requests_admin_select" ON public.demo_requests
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));