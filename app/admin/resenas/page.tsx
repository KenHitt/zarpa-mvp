import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';
import { ReviewModeration } from '@/components/admin/review-moderation';

export const dynamic = 'force-dynamic';

type ReviewRow = {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  experience_id: string | null;
  hotel_id: string | null;
  experiences: { name: string } | null;
  hotels: { name: string } | null;
};

export default async function AdminReviews() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) redirect('/admin/login');

  const db = await createClient();
  const { data } = await db
    .from('reviews')
    .select('id,author_name,rating,comment,status,created_at,experience_id,hotel_id,experiences(name),hotels(name)')
    .order('status', { ascending: true })
    .order('created_at', { ascending: false });

  const rows = (data ?? []) as unknown as ReviewRow[];
  const reviews = rows.map((r) => ({
    id: r.id,
    author_name: r.author_name,
    rating: r.rating,
    comment: r.comment,
    status: r.status,
    created_at: r.created_at,
    productLabel: r.experiences?.name
      ? `Experiencia · ${r.experiences.name}`
      : r.hotels?.name
        ? `Hotel · ${r.hotels.name}`
        : 'Producto',
  }));

  const pending = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Reseñas</h1>
        {pending > 0 && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            {pending} por revisar
          </span>
        )}
      </div>
      <p className="mt-2 text-slate-600">
        Aprueba las reseñas reales para publicarlas en la web. Las aprobadas activan estrellas en Google.
      </p>
      <div className="mt-6">
        <ReviewModeration reviews={reviews} />
      </div>
    </div>
  );
}
