-- Nombre correcto del tour: Derrepente (no "De Repente")
update public.experiences
set name = 'Río y Catarata Derrepente'
where name = 'Río y Catarata De Repente';

update public.experiences
set is_featured = (name = 'Río y Catarata Derrepente');
