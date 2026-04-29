-- Add per-recipient phone + delivery method
alter table public.recipients
  add column if not exists phone text,
  add column if not exists delivery_method text not null default 'email'
    check (delivery_method in ('email','sms'));

create index if not exists recipients_delivery_method_idx
  on public.recipients (delivery_method);