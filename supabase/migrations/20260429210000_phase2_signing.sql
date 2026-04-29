-- Phase 2: Signing tokens, audit, RPCs, realtime
create extension if not exists pgcrypto;

alter table public.recipients
  add column if not exists signing_token text unique default encode(gen_random_bytes(24), 'hex'),
  add column if not exists verification_type text check (verification_type in ('id_number','phone')),
  add column if not exists verification_value_hash text,
  add column if not exists signed_at timestamptz,
  add column if not exists signed_ip text,
  add column if not exists signed_user_agent text,
  add column if not exists signature_data_url text,
  add column if not exists opened_at timestamptz;

update public.recipients set signing_token = encode(gen_random_bytes(24),'hex') where signing_token is null;

create index if not exists recipients_signing_token_idx on public.recipients(signing_token);

-- Public peek: minimal info to render verification screen
create or replace function public.peek_signing_token(_token text)
returns table(verification_type text, recipient_name text, document_subject text)
language sql
stable
security definer
set search_path = public
as $$
  select r.verification_type, r.name, d.subject
  from public.recipients r
  join public.documents d on d.id = r.document_id
  where r.signing_token = _token
  limit 1;
$$;

-- Verify + return signing context (file path, name, etc.)
create or replace function public.get_signing_context(_token text, _verification text)
returns table(recipient_id uuid, document_id uuid, file_name text, file_path text, subject text, message text, already_signed boolean)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_hash text;
begin
  v_hash := encode(digest(_verification, 'sha256'), 'hex');

  return query
  select r.id, d.id, d.file_name, d.file_path, d.subject, d.message, (r.status = 'signed')
  from public.recipients r
  join public.documents d on d.id = r.document_id
  where r.signing_token = _token
    and r.verification_value_hash = v_hash
  limit 1;
end;
$$;

-- Apply signature
create or replace function public.sign_recipient(
  _token text,
  _verification text,
  _signature text,
  _ip text,
  _ua text
)
returns table(document_id uuid, all_signed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_recipient public.recipients%rowtype;
  v_remaining int;
begin
  if _signature is null or length(_signature) < 50 or length(_signature) > 200000 then
    raise exception 'invalid_signature';
  end if;

  v_hash := encode(digest(_verification, 'sha256'), 'hex');

  select * into v_recipient from public.recipients
  where signing_token = _token and verification_value_hash = v_hash;

  if not found then
    raise exception 'verification_failed';
  end if;

  if v_recipient.status = 'signed' then
    raise exception 'already_signed';
  end if;

  update public.recipients
  set status = 'signed',
      signed_at = now(),
      signed_ip = _ip,
      signed_user_agent = _ua,
      signature_data_url = _signature
  where id = v_recipient.id;

  select count(*) into v_remaining
  from public.recipients
  where document_id = v_recipient.document_id
    and role = 'signer'
    and status <> 'signed';

  if v_remaining = 0 then
    update public.documents set status = 'signed' where id = v_recipient.document_id;
  end if;

  return query select v_recipient.document_id, (v_remaining = 0);
end;
$$;

-- Mark opened (called when client passes verification)
create or replace function public.mark_recipient_opened(_token text, _verification text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
begin
  v_hash := encode(digest(_verification, 'sha256'), 'hex');
  update public.recipients
  set opened_at = coalesce(opened_at, now())
  where signing_token = _token and verification_value_hash = v_hash;
end;
$$;

-- Lock down: only anon/auth can call the public-facing RPCs
revoke all on function public.peek_signing_token(text) from public;
grant execute on function public.peek_signing_token(text) to anon, authenticated;

revoke all on function public.get_signing_context(text, text) from public;
grant execute on function public.get_signing_context(text, text) to anon, authenticated;

revoke all on function public.sign_recipient(text, text, text, text, text) from public;
grant execute on function public.sign_recipient(text, text, text, text, text) to anon, authenticated;

revoke all on function public.mark_recipient_opened(text, text) from public;
grant execute on function public.mark_recipient_opened(text, text) to anon, authenticated;

-- Realtime
alter table public.documents replica identity full;
alter table public.recipients replica identity full;

do $$ begin
  perform 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='documents';
  if not found then
    execute 'alter publication supabase_realtime add table public.documents';
  end if;
  perform 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='recipients';
  if not found then
    execute 'alter publication supabase_realtime add table public.recipients';
  end if;
end $$;
