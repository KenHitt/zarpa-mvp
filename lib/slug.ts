import type { Experience } from '@/lib/types';

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Slugs canónicos pensados para búsqueda en Google */
const SEO_SLUG_BY_NAME: Record<string, string> = {
  'Río y Catarata Derrepente': 'catarata-derrepente',
  'Catarata Honolulu': 'catarata-honolulu',
  'Cueva Hayna Cápac': 'cueva-hayna-capac',
  'Cueva de las Lechuzas': 'cueva-de-las-lechuzas',
  'Bosque de Piedras': 'bosque-de-piedras',
  'La Bella Durmiente': 'bella-durmiente',
  'City tour Tingo María': 'city-tour-tingo-maria',
  'Transporte turístico': 'transporte-turistico',
};

/** URLs alternativas que apuntan al mismo producto o guía */
export const SLUG_ALIASES: Record<string, string> = {
  'rio-derrepente': 'catarata-derrepente',
  derrepente: 'catarata-derrepente',
  'cataratas-derrepente': 'catarata-derrepente',
  'tingo-maria': 'turismo-tingo-maria',
  'turismo-en-tingo-maria': 'turismo-tingo-maria',
  'jurasik-park-peruano': 'jurassic-park-peruano',
  'jurassic-park': 'jurassic-park-peruano',
};

export function resolveSlug(slug: string) {
  return SLUG_ALIASES[slug] ?? slug;
}

export function experienceSlug(experience: Experience & { slug?: string | null }) {
  if (experience.slug) return experience.slug;
  return SEO_SLUG_BY_NAME[experience.name] ?? slugify(experience.name);
}

export function experiencePath(experience: Experience & { slug?: string | null }) {
  return `/experiencias/${experienceSlug(experience)}`;
}
