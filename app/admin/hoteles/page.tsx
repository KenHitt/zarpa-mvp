import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';

export default async function AdminHotels() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) redirect('/admin/login');

  const db = await createClient();
  const { data: hotels } = await db.from('hotels').select('id,name,status,price_per_night,photos').order('name');

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Hoteles</h1>
        <Link href="/admin/hoteles/nuevo" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
          + Nuevo hotel
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-slate-200 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        {(hotels ?? []).map((h) => (
          <li key={h.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-slate-900">{h.name}</p>
              <p className="text-sm text-slate-500">
                S/{h.price_per_night} · {h.status} · {h.photos?.length ?? 0} foto(s)
              </p>
            </div>
            <Link href={`/admin/hoteles/${h.id}`} className="text-sm font-semibold text-slate-700 underline">
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
