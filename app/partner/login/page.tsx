'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand-logo';

export default function PartnerLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(form: FormData) {
    setLoading(true);
    setError('');
    const db = createClient();
    const { error: authError } = await db.auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.replace('/partner/dashboard');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16">
      <section className="mx-auto flex max-w-sm flex-col items-center">
        <BrandLogo href="/" priority className="mb-6" />
        <div className="w-full rounded-xl bg-white p-7 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Partners</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Acceso de operadores</h1>
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
        </div>
      </section>
    </main>
  );
}
