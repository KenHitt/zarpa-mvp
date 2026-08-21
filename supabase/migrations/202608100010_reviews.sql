-- Reseñas de clientes para experiencias y hoteles.
-- Flujo: el cliente envía una reseña -> queda 'pending' -> el admin la aprueba/rechaza.
-- Solo las 'approved' se muestran en la web pública (y activan estrellas en Google).

create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  experience_id uuid references public.experiences(id) on delete cascade,
  hotel_id uuid references public.hotels(id) on delete cascade,
  author_name text not null check (char_length(author_name) between 2 and 80),
  rating int not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 5 and 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  -- Cada reseña apunta a exactamente un producto (experiencia u hotel).
  constraint review_target_exactly_one check (
    (experience_id is not null and hotel_id is null) or
    (experience_id is null and hotel_id is not null)
  )
);

create index if not exists reviews_experience_idx on public.reviews(experience_id) where experience_id is not null;
create index if not exists reviews_hotel_idx on public.reviews(hotel_id) where hotel_id is not null;
create index if not exists reviews_status_idx on public.reviews(status);

alter table public.reviews enable row level security;

-- La web pública solo lee reseñas aprobadas.
drop policy if exists "public reads approved reviews" on public.reviews;
create policy "public reads approved reviews"
on public.reviews for select
using (status = 'approved');

-- El admin gestiona todas las reseñas (leer pendientes, aprobar, rechazar, borrar).
drop policy if exists "admins manage reviews" on public.reviews;
create policy "admins manage reviews"
on public.reviews for all
using (public.is_admin())
with check (public.is_admin());

-- Nota: las reseñas nuevas se insertan desde el servidor con la service role key
-- (API /api/reviews), por eso no hace falta una policy de insert para anónimos.
