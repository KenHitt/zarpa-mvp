-- Permite paquetes de solo hotel, solo experiencias o ambos.
alter table public.packages alter column hotel_id drop not null;
alter table public.packages alter column check_in drop not null;
alter table public.packages alter column check_out drop not null;
alter table public.packages drop constraint if exists packages_nights_check;
alter table public.packages add constraint packages_nights_check check (nights >= 0);

update public.hotels set photos = array['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85'];
update public.experiences set photos = array['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85'];
