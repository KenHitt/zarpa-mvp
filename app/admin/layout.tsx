import Link from 'next/link';
import { getAdminSession } from '@/lib/admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = await getAdminSession();

  return (
    <div className="min-h-screen bg-slate-100">
      {isAdmin && (
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Zarpa Admin</p>
              <nav className="mt-1 flex flex-wrap gap-4 text-sm font-semibold text-slate-800">
                <Link href="/admin">Inicio</Link>
                <Link href="/admin/hoteles">Hoteles</Link>
                <Link href="/admin/experiencias">Experiencias</Link>
              </nav>
            </div>
            <form action="/api/admin/logout" method="post">
              <button className="text-sm text-slate-600">Cerrar sesión</button>
            </form>
          </div>
        </header>
      )}
      <main className="px-4 py-8">{children}</main>
    </div>
  );
}
