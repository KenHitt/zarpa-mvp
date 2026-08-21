import type { Metadata } from 'next';
import { defaultDescription, defaultKeywords, defaultOgImage, siteName, siteTagline, siteUrl } from './site';

type PageMeta = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string | null;
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description = defaultDescription,
  path = '',
  keywords = defaultKeywords,
  image,
  noIndex = false,
}: PageMeta): Metadata {
  const url = `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = image ?? defaultOgImage;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'es_PE',
      url,
      siteName,
      title,
      description,
      images: ogImage ? [{ url: ogImage, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export function homeMetadata(): Metadata {
  return pageMetadata({
    title: `${siteTagline} · Reserva cataratas, cuevas y tours`,
    description: defaultDescription,
    path: '/',
    keywords: defaultKeywords,
  });
}
