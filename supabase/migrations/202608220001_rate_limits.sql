-- Rate limiting básico para endpoints públicos (reservas, reseñas, analytics).
-- Guarda un "hit" por request permitido; lib/rate-limit.ts cuenta cuántos hits
-- hay en la ventana de tiempo para un bucket (ej. "booking:203.0.113.5") antes
-- de permitir uno más. Se usa siempre con la service role key (bypassa RLS),
-- por eso no hace falta política de insert/select para anon/authenticated.

create table if not exists public.rate_limit_hits (
  id bigserial primary key,
  bucket text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_bucket_created_idx
  on public.rate_limit_hits (bucket, created_at desc);

alter table public.rate_limit_hits enable row level security;
-- Sin policies públicas: solo el service role (que bypassa RLS) lee/escribe aquí.
