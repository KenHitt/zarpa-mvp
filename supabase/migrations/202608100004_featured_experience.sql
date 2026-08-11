alter table public.experiences add column if not exists is_featured boolean not null default false;
update public.experiences set is_featured = (name = 'Río y Catarata De Repente');
create index if not exists experiences_featured_idx on public.experiences(is_featured desc, price asc);
