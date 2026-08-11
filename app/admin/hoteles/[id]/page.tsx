import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';
import { HotelForm } from '@/components/admin/hotel-form';

export default async function EditHotel({ params }: { params: { id: string } }) {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) redirect('/admin/login');

  const db = await createClient();
  const { data: hotel } = await db.from('hotels').select('*').eq('id', params.id).maybeSingle();
  if (!hotel) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Editar hotel</h1>
      <HotelForm hotel={hotel} />
    </div>
  );
}
