import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';

export default async function AdminExperiences() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) redirect('/admin/login');

  const db = await createClient();
  const { data: experiences } = await db
    .from('experiences')
    .select('id,name,status,price,photos,is_featured')
    .order('name');

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Experiencias</h1>
        <Link href="/admin/experiencias/nuevo" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
          + Nueva experiencia
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-slate-200 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        {(experiences ?? []).map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-slate-900">
                {e.name}
                {e.is_featured && <span className="ml-2 text-xs text-amber-600">★ Destacada</span>}
              </p>
              <p className="text-sm text-slate-500">
                S/{e.price} · {e.status} · {e.photos?.length ?? 0} foto(s)
              </p>
            </div>
            <Link href={`/admin/experiencias/${e.id}`} className="text-sm font-semibold text-slate-700 underline">
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
