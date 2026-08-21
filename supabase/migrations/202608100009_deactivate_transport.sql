-- Ocultar transporte como producto suelto: se coordina dentro de cada tour o por WhatsApp.
update public.experiences
set status = 'inactive'
where category = 'Transporte'
   or name ilike '%transporte turístico%';

-- Aclarar traslado incluido en tours activos (solo si aún no lo mencionan).
update public.experiences
set description = trim(description || ' Traslado desde hotel o punto de encuentro incluido.')
where status = 'active'
  and category <> 'Transporte'
  and description not ilike '%traslado%';
