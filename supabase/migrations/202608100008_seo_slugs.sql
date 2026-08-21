-- URLs amigables para SEO (opcional: la app también genera slugs desde el nombre)
alter table public.experiences add column if not exists slug text unique;
alter table public.hotels add column if not exists slug text unique;

update public.experiences set slug = 'catarata-derrepente' where name ilike '%derrepente%' and slug is null;
update public.experiences set slug = 'catarata-honolulu' where name ilike '%honolulu%' and slug is null;
update public.experiences set slug = 'cueva-hayna-capac' where name ilike '%hayna%' and slug is null;
update public.experiences set slug = 'cueva-de-las-lechuzas' where name ilike '%lechuzas%' and slug is null;
update public.experiences set slug = 'bosque-de-piedras' where name ilike '%bosque de piedras%' and slug is null;
update public.experiences set slug = 'bella-durmiente' where name ilike '%bella durmiente%' and slug is null;
update public.experiences set slug = 'city-tour-tingo-maria' where name ilike '%city tour%' and slug is null;
update public.experiences set slug = 'transporte-turistico' where name ilike '%transporte%' and slug is null;

create index if not exists experiences_slug_idx on public.experiences (slug) where slug is not null;
create index if not exists hotels_slug_idx on public.hotels (slug) where slug is not null;
