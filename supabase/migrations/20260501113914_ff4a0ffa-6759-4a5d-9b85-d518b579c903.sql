
DROP FUNCTION IF EXISTS public.sign_recipient(text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.get_signing_context(_token text, _verification text)
RETURNS TABLE(recipient_id uuid, document_id uuid, file_name text, file_path text, subject text, message text, already_signed boolean)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_hash text;
begin
  v_hash := encode(sha256(_verification::bytea), 'hex');
  return query
  select r.id, d.id, d.file_name, d.file_path, d.subject, d.message, (r.status = 'signed')
  from public.recipients r
  join public.documents d on d.id = r.document_id
  where r.signing_token = _token
    and r.verification_value_hash = v_hash
  limit 1;
end;
$$;

CREATE OR REPLACE FUNCTION public.mark_recipient_opened(_token text, _verification text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_hash text;
begin
  v_hash := encode(sha256(_verification::bytea), 'hex');
  update public.recipients
  set opened_at = coalesce(opened_at, now())
  where signing_token = _token and verification_value_hash = v_hash;
end;
$$;

CREATE OR REPLACE FUNCTION public.sign_recipient(_token text, _verification text, _signature text, _ip text, _ua text)
RETURNS TABLE(out_document_id uuid, all_signed boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_hash text;
  v_recipient public.recipients%rowtype;
  v_remaining int;
begin
  if _signature is null or length(_signature) < 50 or length(_signature) > 200000 then
    raise exception 'invalid_signature';
  end if;

  v_hash := encode(sha256(_verification::bytea), 'hex');

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

REVOKE EXECUTE ON FUNCTION public.get_signing_context(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.mark_recipient_opened(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sign_recipient(text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_signing_context(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mark_recipient_opened(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.sign_recipient(text, text, text, text, text) TO anon, authenticated, service_role;
