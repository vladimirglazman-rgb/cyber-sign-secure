ALTER TABLE public.payments DROP CONSTRAINT payments_status_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_status_check
  CHECK (status = ANY (ARRAY['pending_bank'::text, 'pending_bank_transfer'::text, 'completed'::text, 'rejected'::text]));