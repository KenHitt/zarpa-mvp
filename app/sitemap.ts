import type { MetadataRoute } from 'next';
import { getExperiences, getHotels } from '@/lib/data/catalog';
import { experiencePath } from '@/lib/slug';
import { siteUrl } from '@/lib/seo/site';

const GUIDE_PATHS = [
  '/guia/turismo-tingo-maria',
  '/guia/catarata-derrepente',
  '/guia/rio-derrepente',
  '/guia/jurassic-park-peruano',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/experiencias`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/hoteles`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...GUIDE_PATHS.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path.includes('turismo-tingo-maria') ? 0.9 : 0.85,
    })),
  ];

  try {
    const [experiences, hotels] = await Promise.all([getExperiences(), getHotels()]);
    const experiencePages: MetadataRoute.Sitemap = experiences.map((item) => ({
      url: `${base}${experiencePath(item)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: item.is_featured ? 0.95 : 0.8,
    }));
    const hotelPages: MetadataRoute.Sitemap = hotels.map((hotel) => ({
      url: `${base}/hoteles/${hotel.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    return [...staticPages, ...experiencePages, ...hotelPages];
  } catch {
    return staticPages;
  }
}
