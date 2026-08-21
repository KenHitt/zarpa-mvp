'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { revalidatePublicCatalog } from '@/lib/admin/revalidate-catalog-client';

type Props = {
  id: string;
  name: string;
  compact?: boolean;
};

export function DeleteExperienceButton({ id, name, compact = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function remove() {
    const ok = window.confirm(
      `¿Eliminar "${name}" del catálogo?\n\nSi tiene reservas antiguas, no se podrá borrar: usa estado Inactivo.`
    );
    if (!ok) return;

    setLoading(true);
    setError('');
    const db = createClient();
    const { error: deleteError } = await db.from('experiences').delete().eq('id', id);

    if (deleteError) {
      const msg =
        deleteError.code === '23503'
          ? 'No se puede eliminar: hay reservas vinculadas. Cambia el estado a Inactivo.'
          : deleteError.message;
      setError(msg);
      setLoading(false);
      return;
    }

    await revalidatePublicCatalog();
    router.push('/admin/experiencias');
    router.refresh();
  }

  if (compact) {
    return (
      <span className="inline-flex flex-col items-end gap-1">
        <button
          type="button"
          disabled={loading}
          onClick={remove}
          className="text-sm font-semibold text-red-700 underline disabled:opacity-50"
        >
          {loading ? 'Eliminando…' : 'Eliminar'}
        </button>
        {error && <span className="max-w-xs text-right text-xs text-red-600">{error}</span>}
      </span>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-semibold text-red-900">Zona de peligro</p>
      <p className="mt-1 text-sm text-red-800/80">
        Elimina la experiencia del catálogo. Si ya tiene reservas, márcala como Inactivo en lugar de borrarla.
      </p>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <button
        type="button"
        disabled={loading}
        onClick={remove}
        className="mt-3 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
      >
        {loading ? 'Eliminando…' : 'Eliminar experiencia'}
      </button>
    </div>
  );
}
