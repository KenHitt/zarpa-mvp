-- Panel admin Zarpa: gestión de catálogo (hoteles, experiencias, fotos)
-- Tras crear usuario en Auth, vincular:
-- insert into public.admins (auth_user_id, email) values ('UUID-AUTH', 'tu@correo.com');

create table if not exists public.admins (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where auth_user_id = auth.uid());
$$;

create policy "admins read themselves"
on public.admins for select
using (auth.uid() = auth_user_id);

create policy "admins manage hotels"
on public.hotels for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage experiences"
on public.experiences for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins upload catalog images" on storage.objects;
create policy "admins upload catalog images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'catalog' and public.is_admin());

drop policy if exists "admins update catalog images" on storage.objects;
create policy "admins update catalog images"
on storage.objects for update
to authenticated
using (bucket_id = 'catalog' and public.is_admin())
with check (bucket_id = 'catalog' and public.is_admin());

drop policy if exists "admins delete catalog images" on storage.objects;
create policy "admins delete catalog images"
on storage.objects for delete
to authenticated
using (bucket_id = 'catalog' and public.is_admin());
