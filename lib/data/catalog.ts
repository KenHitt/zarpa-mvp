import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { experienceSlug, resolveSlug } from '@/lib/slug';
import type { Experience, Hotel } from '@/lib/types';

function catalogDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}

const cachedHotels = unstable_cache(
  async (): Promise<Hotel[]> => {
    const db = catalogDb();
    if (!db) return [];
    const { data, error } = await db.from('hotels').select('*').eq('status', 'active').order('price_per_night');
    if (error) throw error;
    return data ?? [];
  },
  ['zarpa-active-hotels-v3'],
  { revalidate: 30, tags: ['catalog-hotels'] }
);

const cachedExperiences = unstable_cache(
  async (): Promise<Experience[]> => {
    const db = catalogDb();
    if (!db) return [];
    const { data, error } = await db
      .from('experiences')
      .select('*')
      .eq('status', 'active')
      .neq('category', 'Transporte')
      .order('is_featured', { ascending: false })
      .order('price');
    if (error) throw error;
    return data ?? [];
  },
  ['zarpa-active-experiences-v4'],
  { revalidate: 30, tags: ['catalog-experiences'] }
);

const cachedHotel = unstable_cache(
  async (id: string): Promise<Hotel | null> => {
    const db = catalogDb();
    if (!db) return null;
    const { data, error } = await db.from('hotels').select('*').eq('id', id).eq('status', 'active').maybeSingle();
    if (error) throw error;
    return data;
  },
  ['zarpa-active-hotel-v3'],
  { revalidate: 30, tags: ['catalog-hotels'] }
);

export const getHotels = () => cachedHotels();
export const getHotel = (id: string) => cachedHotel(id);
export const getExperiences = () => cachedExperiences();

export async function getExperienceBySlug(rawSlug: string): Promise<Experience | null> {
  const slug = resolveSlug(rawSlug);
  const experiences = await getExperiences();
  return (
    experiences.find((item) => experienceSlug(item) === slug || item.slug === slug) ?? null
  );
}

export async function getAllExperienceSlugs(): Promise<string[]> {
  const experiences = await getExperiences();
  return experiences.map((item) => experienceSlug(item));
}
