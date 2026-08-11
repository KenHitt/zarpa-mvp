import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { HotelForm } from '@/components/admin/hotel-form';

export default async function NewHotel() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) redirect('/admin/login');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Nuevo hotel</h1>
      <HotelForm />
    </div>
  );
}
