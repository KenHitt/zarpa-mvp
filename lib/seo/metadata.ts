import type { Metadata } from 'next';
import { defaultDescription, defaultKeywords, defaultOgImage, defaultOgImageSize, siteName, siteUrl } from './site';

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
  // Solo conocemos las dimensiones reales del logo por defecto; las fotos de
  // producto vienen de Supabase Storage con tamaños variables, así que ahí
  // dejamos que el crawler las detecte (no declarar width/height incorrectos).
  const ogImageSize = ogImage === defaultOgImage ? defaultOgImageSize : undefined;

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
      images: ogImage ? [{ url: ogImage, ...ogImageSize, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
