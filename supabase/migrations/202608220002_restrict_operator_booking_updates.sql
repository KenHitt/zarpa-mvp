-- La policy "operators confirm related bookings" (migración 001) usa
-- `with check (true)`: una vez que un operador puede ver una reserva propia,
-- RLS le permite actualizar CUALQUIER columna de esa fila (total, teléfono,
-- correo, comprobante...), no solo el estado de pago que confirma la ruta
-- /api/partner/bookings/[id]/confirm.
--
-- Este trigger bloquea a nivel de base de datos cualquier cambio a columnas
-- que no sean payment_status/status cuando la operación viene de un usuario
-- autenticado normal (auth.uid() presente). Las escrituras hechas con la
-- service role key (checkout, cron de invitaciones a reseñar) no tienen
-- auth.uid() y no se ven afectadas.

create or replace function public.restrict_operator_booking_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    if new.customer_name is distinct from old.customer_name
      or new.customer_phone is distinct from old.customer_phone
      or new.customer_email is distinct from old.customer_email
      or new.payment_method is distinct from old.payment_method
      or new.payment_proof_url is distinct from old.payment_proof_url
      or new.total is distinct from old.total
      or new.package_id is distinct from old.package_id
    then
      raise exception 'Los operadores solo pueden actualizar el estado de la reserva';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_restrict_operator_update on public.bookings;
create trigger bookings_restrict_operator_update
  before update on public.bookings
  for each row
  execute function public.restrict_operator_booking_update();
