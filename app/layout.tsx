import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LayoutChrome } from '@/components/layout-chrome';
import { JsonLd } from '@/lib/seo/json-ld';
import { organizationSchema, websiteSchema } from '@/lib/seo/schemas';
import {
  defaultDescription,
  defaultKeywords,
  defaultOgImage,
  defaultOgImageSize,
  siteName,
  siteTabTitle,
  siteTagline,
  siteUrl,
} from '@/lib/seo/site';

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: siteTabTitle,
    template: `Zarpa : %s`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  alternates: {
    canonical: '/',
    languages: { 'es-PE': '/', es: '/' },
  },
  icons: {
    icon: [{ url: '/brand/icono.png', type: 'image/png' }],
    apple: [{ url: '/brand/icono.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName,
    title: `${siteTagline} · ${siteName}`,
    description: defaultDescription,
    images: [{ url: defaultOgImage, ...defaultOgImageSize, alt: `${siteName} · ${siteTagline}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteTagline} · ${siteName}`,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#1F4D3A',
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
