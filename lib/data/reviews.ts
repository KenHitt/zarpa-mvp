import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Review, ReviewStats } from '@/lib/types';

function reviewsDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}

const cachedApprovedReviews = unstable_cache(
  async (target: 'experience' | 'hotel', id: string): Promise<Review[]> => {
    const db = reviewsDb();
    if (!db) return [];
    const column = target === 'experience' ? 'experience_id' : 'hotel_id';
    const { data, error } = await db
      .from('reviews')
      .select('*')
      .eq(column, id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data ?? [];
  },
  ['zarpa-approved-reviews-v1'],
  { revalidate: 60, tags: ['reviews'] }
);

const cachedRecentReviews = unstable_cache(
  async (limit: number): Promise<Review[]> => {
    const db = reviewsDb();
    if (!db) return [];
    const { data, error } = await db
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return [];
    return data ?? [];
  },
  ['zarpa-recent-reviews-v1'],
  { revalidate: 60, tags: ['reviews'] }
);

/** Últimas reseñas aprobadas de cualquier producto (para prueba social en la landing). */
export function getRecentApprovedReviews(limit = 3) {
  return cachedRecentReviews(limit);
}

export function getExperienceReviews(experienceId: string) {
  return cachedApprovedReviews('experience', experienceId);
}

export function getHotelReviews(hotelId: string) {
  return cachedApprovedReviews('hotel', hotelId);
}

export function reviewStats(reviews: Review[]): ReviewStats {
  if (!reviews.length) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}
