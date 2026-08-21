'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand-logo';

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(form: FormData) {
    setLoading(true);
    setError('');
    const db = createClient();
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    const { error: authError } = await db.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) {
      setError('No se pudo iniciar sesión.');
      setLoading(false);
      return;
    }

    const { data: admin, error: adminError } = await db
      .from('admins')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await db.auth.signOut();
      setError('Esta cuenta no tiene permisos de administrador.');
      setLoading(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center">
      <BrandLogo href="/" priority className="mb-6" />
      <main className="w-full rounded-xl bg-white p-7 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Panel de catálogo</h1>
        <p className="mt-2 text-sm text-slate-600">Gestiona hoteles, experiencias y fotos.</p>
        <form action={login} className="mt-6 space-y-4">
          <label className="block text-sm">
            Correo
            <input name="email" type="email" required className="mt-1 w-full rounded-md border p-2" />
          </label>
          <label className="block text-sm">
            Contraseña
            <input name="password" type="password" required className="mt-1 w-full rounded-md border p-2" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-md bg-slate-900 py-2 text-white disabled:opacity-50">
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </main>
    </div>
  );
}
