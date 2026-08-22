import type { MetadataRoute } from 'next';
import { siteName, siteTagline } from '@/lib/seo/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} · ${siteTagline}`,
    short_name: siteName,
    description: siteTagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f7f4',
    theme_color: '#1F4D3A',
    icons: [
      { src: '/brand/icono.png', sizes: '485x485', type: 'image/png', purpose: 'any' },
      { src: '/brand/icono.png', sizes: '485x485', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
