import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';

export default async function AdminHome() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) redirect('/admin/login');

  const db = await createClient();
  const [{ count: hotels }, { count: experiences }] = await Promise.all([
    db.from('hotels').select('*', { count: 'exact', head: true }),
    db.from('experiences').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900">Catálogo Zarpa</h1>
      <p className="mt-2 text-slate-600">Sube fotos, edita textos y publica nuevos productos.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/hoteles" className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300">
          <p className="text-3xl font-bold text-slate-900">{hotels ?? 0}</p>
          <p className="mt-1 font-medium text-slate-700">Hoteles</p>
          <p className="mt-2 text-sm text-slate-500">Crear, editar, fotos y estado</p>
        </Link>
        <Link href="/admin/experiencias" className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300">
          <p className="text-3xl font-bold text-slate-900">{experiences ?? 0}</p>
          <p className="mt-1 font-medium text-slate-700">Experiencias</p>
          <p className="mt-2 text-sm text-slate-500">Tours, precios, destacados</p>
        </Link>
      </div>
      <p className="mt-8 text-sm text-slate-500">
        Tip: usa estado <strong>Activo</strong> para publicar en la web. <strong>Borrador</strong> oculta el producto.
      </p>
    </div>
  );
}
