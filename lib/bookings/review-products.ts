import type { SupabaseClient } from '@supabase/supabase-js';
import { experiencePath } from '@/lib/slug';
import type { Experience } from '@/lib/types';

export type ReviewProductLink = {
  label: string;
  href: string;
  path: string;
};

export async function getBookingReviewProducts(
  db: SupabaseClient,
  bookingId: string
): Promise<ReviewProductLink[]> {
  const { data: booking } = await db
    .from('bookings')
    .select('package_id, packages(hotel_id, hotels(id,name))')
    .eq('id', bookingId)
    .maybeSingle();

  if (!booking) return [];

  const products: ReviewProductLink[] = [];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zarpa-mvp.vercel.app').replace(/\/$/, '');

  const pkg = booking.packages as unknown as {
    hotel_id: string | null;
    hotels: { id: string; name: string } | null;
  } | null;

  if (pkg?.hotels) {
    const path = `/hoteles/${pkg.hotels.id}#resenas`;
    products.push({
      label: pkg.hotels.name,
      href: `${siteUrl}${path}`,
      path,
    });
  }

  const { data: items } = await db
    .from('package_experiences')
    .select('experiences(id,name,slug,category,duration,meeting_point,price,description,photos,status)')
    .eq('package_id', booking.package_id);

  for (const item of items ?? []) {
    const exp = (item as unknown as { experiences: Partial<Experience> | null }).experiences;
    if (exp?.name) {
      const path = `${experiencePath(exp as Experience)}#resenas`;
      products.push({
        label: exp.name,
        href: `${siteUrl}${path}`,
        path,
      });
    }
  }

  return products;
}

/** Fecha fin del viaje: checkout del hotel o la última experiencia. */
export async function getBookingTripEndDate(db: SupabaseClient, packageId: string): Promise<Date | null> {
  const { data: pkg } = await db
    .from('packages')
    .select('check_out')
    .eq('id', packageId)
    .maybeSingle();

  const { data: exps } = await db
    .from('package_experiences')
    .select('date')
    .eq('package_id', packageId);

  const dates: Date[] = [];
  if (pkg?.check_out) dates.push(new Date(`${pkg.check_out}T12:00:00`));
  for (const row of exps ?? []) {
    if (row.date) dates.push(new Date(`${row.date}T12:00:00`));
  }

  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export function hoursSince(date: Date) {
  return (Date.now() - date.getTime()) / 3600000;
}
