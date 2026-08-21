import type { Metadata } from 'next';
import './globals.css';
import { LayoutChrome } from '@/components/layout-chrome';
import { JsonLd } from '@/lib/seo/json-ld';
import { organizationSchema, websiteSchema } from '@/lib/seo/schemas';
import { defaultDescription, defaultKeywords, defaultOgImage, siteName, siteTagline, siteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${siteTagline} · ${siteName}`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  icons: {
    icon: [{ url: '/brand/icono.png', type: 'image/png' }],
    apple: [{ url: '/brand/icono.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName,
    description: defaultDescription,
    images: [{ url: defaultOgImage, alt: siteTagline }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTagline,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');

  return (
    <html lang="es-PE">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
      </head>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
