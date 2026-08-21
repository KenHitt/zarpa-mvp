import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/partner', '/partner/', '/checkout', '/mi-paquete', '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
