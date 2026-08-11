-- Bucket público para fotos de hoteles y experiencias.
-- Subir archivos en Supabase Dashboard → Storage → catalog
-- URL pública: https://<project-ref>.supabase.co/storage/v1/object/public/catalog/<ruta>

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog',
  'catalog',
  true,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read catalog images" on storage.objects;
create policy "public read catalog images"
on storage.objects
for select
using (bucket_id = 'catalog');

drop policy if exists "authenticated upload catalog images" on storage.objects;
create policy "authenticated upload catalog images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'catalog');

drop policy if exists "authenticated update catalog images" on storage.objects;
create policy "authenticated update catalog images"
on storage.objects
for update
to authenticated
using (bucket_id = 'catalog')
with check (bucket_id = 'catalog');

drop policy if exists "authenticated delete catalog images" on storage.objects;
create policy "authenticated delete catalog images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'catalog');
