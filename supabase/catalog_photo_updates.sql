-- ============================================================
-- Vincular fotos de Storage → catálogo web
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- 1) Renombrar experiencia (si aún dice "De Repente")
update public.experiences
set name = 'Río y Catarata Derrepente'
where name = 'Río y Catarata De Repente';

update public.experiences
set is_featured = (name = 'Río y Catarata Derrepente');

-- 2) Foto Derrepente (experiencias/derrepente/)
update public.experiences
set photos = array[
  'https://iipfcpeupyvztzutqcka.supabase.co/storage/v1/object/public/catalog/experiencias/derrepente/Derrepente-Damaris-1.jpeg'
]
where name = 'Río y Catarata Derrepente';

-- Huayna Cápac: descomenta tras subir foto y copiar URL
-- update public.experiences
-- set photos = array['https://iipfcpeupyvztzutqcka.supabase.co/storage/v1/object/public/catalog/experiencias/huayna%20capac/TU-ARCHIVO.jpg']
-- where name = 'Cueva Hayna Cápac';

-- Verificar
select name, photos, is_featured from public.experiences where name ilike '%derrepente%' or name ilike '%hayna%';
