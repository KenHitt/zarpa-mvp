import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: operator } = await db.from('operators').select('id').eq('auth_user_id', user.id).maybeSingle();
  if (!operator) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { data: booking } = await db
    .from('bookings')
    .select('id,package_id')
    .eq('id', params.id)
    .maybeSingle();
  if (!booking) return NextResponse.json({ error: 'Reserva no encontrada o no autorizada' }, { status: 404 });

  const { error } = await db
    .from('bookings')
    .update({ payment_status: 'confirmed', status: 'confirmed' })
    .eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Los operators no tienen UPDATE sobre packages por RLS: se sincroniza con
  // service role. Si falla no bloqueamos la confirmación ya hecha.
  try {
    const admin = createAdminClient();
    await admin.from('packages').update({ status: 'confirmed' }).eq('id', booking.package_id);
  } catch (syncError) {
    console.error('[partner/confirm] no se pudo sincronizar packages.status', syncError);
  }

  return NextResponse.json({ ok: true });
}
