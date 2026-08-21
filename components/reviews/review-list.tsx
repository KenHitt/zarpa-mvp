import type { Review, ReviewStats } from '@/lib/types';
import { ReviewStars } from './review-stars';

type Props = {
  reviews: Review[];
  stats: ReviewStats;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-PE', { year: 'numeric', month: 'long' });
  } catch {
    return '';
  }
}

export function ReviewList({ reviews, stats }: Props) {
  if (!reviews.length) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-forest/20 bg-white/60 p-5 text-sm text-forest/70">
        Aún no hay reseñas de este tour. Si ya lo viviste, ¡sé el primero en contarlo!
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-cream/60 p-4 ring-1 ring-forest/10">
        <span className="font-display text-3xl text-forest">{stats.average.toFixed(1)}</span>
        <div>
          <ReviewStars value={stats.average} size="lg" />
          <p className="mt-0.5 text-sm text-forest/65">
            {stats.count} {stats.count === 1 ? 'reseña' : 'reseñas'} de viajeros
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest/10">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-forest">{review.author_name}</p>
              <ReviewStars value={review.rating} size="sm" />
            </div>
            <p className="mt-2 text-sm leading-7 text-forest/80">{review.comment}</p>
            <p className="mt-2 text-xs text-forest/45">{formatDate(review.created_at)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
