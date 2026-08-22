-- 012 · Fixes de seguridad y analytics (auditoría QA ago-2026).

-- 1. Analytics: el código trackea eventos whatsapp_* (lib/analytics.ts) pero el
--    CHECK solo permitía 5 valores, así que esos inserts fallaban en silencio.
alter table public.analytics_events drop constraint if exists analytics_events_event_name_check;
alter table public.analytics_events
  add constraint analytics_events_event_name_check
  check (event_name in (
    'page_view','experience_added','hotel_selected','checkout_started','booking_created',
    'whatsapp_reserve','whatsapp_share','whatsapp_contact'
  ));

-- 2. Storage: la migración 005 dejó políticas que permiten a CUALQUIER usuario
--    autenticado (incluidos partners) subir, editar y borrar fotos del catálogo.
--    Las políticas "admins *" de la 007 las reemplazan, pero en RLS las policies
--    se combinan con OR: hay que eliminar las antiguas explícitamente.
drop policy if exists "authenticated upload catalog images" on storage.objects;
drop policy if exists "authenticated update catalog images" on storage.objects;
drop policy if exists "authenticated delete catalog images" on storage.objects;

-- 3. Índices faltantes en FKs usadas en joins de RLS y lookups frecuentes.
create index if not exists package_experiences_experience_id_idx on public.package_experiences(experience_id);
create index if not exists operators_linked_hotel_id_idx on public.operators(linked_hotel_id);
create index if not exists operators_linked_experience_id_idx on public.operators(linked_experience_id);
