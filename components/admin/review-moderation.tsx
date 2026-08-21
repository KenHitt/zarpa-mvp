'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { revalidatePublicCatalog } from '@/lib/admin/revalidate-catalog-client';

type AdminReview = {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  productLabel: string;
};

export function ReviewModeration({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function setStatus(id: string, status: 'approved' | 'rejected') {
    setBusyId(id);
    setError('');
    const db = createClient();
    const { error: updateError } = await db.from('reviews').update({ status }).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      setBusyId(null);
      return;
    }
    await revalidatePublicCatalog();
    router.refresh();
    setBusyId(null);
  }

  if (!reviews.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-slate-500 shadow-sm ring-1 ring-slate-200">
        No hay reseñas por revisar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {reviews.map((review) => (
        <article key={review.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-900">
                {review.author_name}
                <span className="ml-2 text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </p>
              <p className="text-xs text-slate-500">{review.productLabel}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                review.status === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : review.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {review.status === 'pending' ? 'Pendiente' : review.status === 'approved' ? 'Publicada' : 'Rechazada'}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-700">{review.comment}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            {review.status !== 'approved' && (
              <button
                type="button"
                disabled={busyId === review.id}
                onClick={() => setStatus(review.id, 'approved')}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busyId === review.id ? 'Guardando…' : 'Aprobar'}
              </button>
            )}
            {review.status !== 'rejected' && (
              <button
                type="button"
                disabled={busyId === review.id}
                onClick={() => setStatus(review.id, 'rejected')}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                Rechazar
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
