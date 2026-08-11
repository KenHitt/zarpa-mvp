create extension if not exists "uuid-ossp";

create type public.operator_type as enum ('hotel', 'experience');
create type public.booking_status as enum ('pending', 'confirmed', 'cancelled');

create table public.hotels (
  id uuid primary key default uuid_generate_v4(), name text not null, description text not null,
  price_per_night numeric(10,2) not null check (price_per_night >= 0), location text not null,
  amenities text[] not null default '{}', photos text[] not null default '{}', status text not null default 'draft' check (status in ('draft','active','inactive')), created_at timestamptz not null default now()
);
create table public.experiences (
  id uuid primary key default uuid_generate_v4(), name text not null, description text not null,
  price numeric(10,2) not null check (price >= 0), duration text not null, meeting_point text not null,
  category text not null, photos text[] not null default '{}', status text not null default 'draft' check (status in ('draft','active','inactive')), created_at timestamptz not null default now()
);
create table public.operators (
  id uuid primary key default uuid_generate_v4(), auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null, type public.operator_type not null, linked_hotel_id uuid references public.hotels(id) on delete set null,
  linked_experience_id uuid references public.experiences(id) on delete set null, phone text, created_at timestamptz not null default now(),
  constraint exactly_one_operator_business check ((type = 'hotel' and linked_hotel_id is not null and linked_experience_id is null) or (type = 'experience' and linked_experience_id is not null and linked_hotel_id is null))
);
create table public.packages (
  id uuid primary key default uuid_generate_v4(), hotel_id uuid not null references public.hotels(id),
  check_in date not null, check_out date not null, nights integer not null check (nights > 0), total_price numeric(10,2) not null check (total_price >= 0), status text not null default 'pending' check (status in ('pending','confirmed','cancelled')), created_at timestamptz not null default now(), check (check_out > check_in)
);
create table public.package_experiences (
  id uuid primary key default uuid_generate_v4(), package_id uuid not null references public.packages(id) on delete cascade,
  experience_id uuid not null references public.experiences(id), date date not null, quantity integer not null default 1 check (quantity > 0), unique(package_id, experience_id, date)
);
create table public.bookings (
  id uuid primary key default uuid_generate_v4(), package_id uuid not null unique references public.packages(id), customer_name text not null, customer_phone text not null, customer_email text not null, payment_method text not null check (payment_method in ('yape','plin','card')),
  payment_status text not null default 'pending' check (payment_status in ('pending','confirmed','rejected')), payment_proof_url text, total numeric(10,2) not null check (total >= 0), status public.booking_status not null default 'pending', created_at timestamptz not null default now()
);
create index packages_hotel_id_idx on public.packages(hotel_id); create index package_experiences_package_id_idx on public.package_experiences(package_id); create index bookings_package_id_idx on public.bookings(package_id);

alter table public.hotels enable row level security; alter table public.experiences enable row level security; alter table public.operators enable row level security; alter table public.packages enable row level security; alter table public.package_experiences enable row level security; alter table public.bookings enable row level security;
create policy "public reads active hotels" on public.hotels for select using (status = 'active');
create policy "public reads active experiences" on public.experiences for select using (status = 'active');
create policy "operators read themselves" on public.operators for select using (auth.uid() = auth_user_id);
create policy "hotel operator manages hotel" on public.hotels for all using (exists (select 1 from public.operators o where o.auth_user_id = auth.uid() and o.linked_hotel_id = hotels.id)) with check (exists (select 1 from public.operators o where o.auth_user_id = auth.uid() and o.linked_hotel_id = hotels.id));
create policy "experience operator manages experience" on public.experiences for all using (exists (select 1 from public.operators o where o.auth_user_id = auth.uid() and o.linked_experience_id = experiences.id)) with check (exists (select 1 from public.operators o where o.auth_user_id = auth.uid() and o.linked_experience_id = experiences.id));
create policy "operators read related packages" on public.packages for select using (exists (select 1 from public.operators o left join public.package_experiences pe on pe.package_id = packages.id where o.auth_user_id = auth.uid() and (o.linked_hotel_id = packages.hotel_id or o.linked_experience_id = pe.experience_id)));
create policy "operators read related package experiences" on public.package_experiences for select using (exists (select 1 from public.operators o join public.packages p on p.id = package_experiences.package_id where o.auth_user_id = auth.uid() and (o.linked_hotel_id = p.hotel_id or o.linked_experience_id = package_experiences.experience_id)));
create policy "operators read related bookings" on public.bookings for select using (exists (select 1 from public.operators o join public.packages p on p.id = bookings.package_id left join public.package_experiences pe on pe.package_id = p.id where o.auth_user_id = auth.uid() and (o.linked_hotel_id = p.hotel_id or o.linked_experience_id = pe.experience_id)));
create policy "operators confirm related bookings" on public.bookings for update using (exists (select 1 from public.operators o join public.packages p on p.id = bookings.package_id left join public.package_experiences pe on pe.package_id = p.id where o.auth_user_id = auth.uid() and (o.linked_hotel_id = p.hotel_id or o.linked_experience_id = pe.experience_id))) with check (true);

insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', false) on conflict do nothing;
create policy "operators access payment proofs" on storage.objects for select using (bucket_id = 'payment-proofs' and exists (select 1 from public.bookings b join public.packages p on p.id = b.package_id left join public.package_experiences pe on pe.package_id = p.id join public.operators o on (o.linked_hotel_id = p.hotel_id or o.linked_experience_id = pe.experience_id) where o.auth_user_id = auth.uid() and storage.objects.name like b.id::text || '/%'));
