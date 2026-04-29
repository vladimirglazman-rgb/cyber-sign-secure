
-- Enums
create type public.app_role as enum ('admin', 'freelancer');
create type public.document_status as enum ('pending', 'signed', 'cancelled');
create type public.recipient_role as enum ('signer', 'cc');
create type public.recipient_status as enum ('waiting', 'signed');

-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());

-- user_roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "user_roles_select_own" on public.user_roles
  for select to authenticated using (user_id = auth.uid());
create policy "user_roles_admin_all" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- handle new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  insert into public.user_roles (user_id, role)
  values (new.id, 'freelancer');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- documents
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  status public.document_status not null default 'pending',
  subject text not null,
  message text,
  sign_in_order boolean not null default false,
  reminder_days integer,
  created_at timestamptz not null default now()
);
alter table public.documents enable row level security;
create index documents_owner_created_idx on public.documents (owner_id, created_at desc);

create policy "documents_select_own" on public.documents
  for select to authenticated using (owner_id = auth.uid());
create policy "documents_insert_own" on public.documents
  for insert to authenticated with check (owner_id = auth.uid());
create policy "documents_update_own" on public.documents
  for update to authenticated using (owner_id = auth.uid());
create policy "documents_delete_own" on public.documents
  for delete to authenticated using (owner_id = auth.uid());

-- recipients
create table public.recipients (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  name text not null,
  email text not null,
  role public.recipient_role not null default 'signer',
  status public.recipient_status not null default 'waiting',
  signing_order integer
);
alter table public.recipients enable row level security;
create index recipients_document_idx on public.recipients (document_id);

create policy "recipients_select_own" on public.recipients
  for select to authenticated using (
    exists (select 1 from public.documents d where d.id = document_id and d.owner_id = auth.uid())
  );
create policy "recipients_insert_own" on public.recipients
  for insert to authenticated with check (
    exists (select 1 from public.documents d where d.id = document_id and d.owner_id = auth.uid())
  );
create policy "recipients_update_own" on public.recipients
  for update to authenticated using (
    exists (select 1 from public.documents d where d.id = document_id and d.owner_id = auth.uid())
  );
create policy "recipients_delete_own" on public.recipients
  for delete to authenticated using (
    exists (select 1 from public.documents d where d.id = document_id and d.owner_id = auth.uid())
  );

-- storage bucket: contracts (private)
insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

create policy "contracts_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'contracts' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "contracts_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'contracts' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "contracts_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'contracts' and (storage.foldername(name))[1] = auth.uid()::text);
