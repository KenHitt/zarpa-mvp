import type { Experience, Hotel, Review } from '@/lib/types';
import { experiencePath } from '@/lib/slug';
import { businessInfo, defaultDescription, siteName, siteUrl, socialProfiles } from './site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteUrl()}/#organization`,
    name: siteName,
    url: siteUrl(),
    logo: `${siteUrl()}/brand/logotipo.png`,
    image: `${siteUrl()}/brand/logotipo.png`,
    description: defaultDescription,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    priceRange: businessInfo.priceRange,
    currenciesAccepted: 'PEN',
    paymentAccepted: 'Yape, Plin, Tarjeta',
    address: {
      '@type': 'PostalAddress',
      addressLocality: businessInfo.address.locality,
      addressRegion: businessInfo.address.region,
      addressCountry: businessInfo.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: businessInfo.geo.latitude,
      longitude: businessInfo.geo.longitude,
    },
    areaServed: {
      '@type': 'City',
      name: 'Tingo María',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Huánuco, Perú' },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: businessInfo.phone,
      contactType: 'reservas',
      areaServed: 'PE',
      availableLanguage: ['Spanish'],
    },
    sameAs: socialProfiles,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl(),
    inLanguage: 'es-PE',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl()}/experiencias?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl()}${item.path}`,
    })),
  };
}

export function experienceProductSchema(
  experience: Experience & { slug?: string | null },
  reviews: Review[] = []
) {
  const path = experiencePath(experience);
  const url = `${siteUrl()}${path}`;
  const photos = (experience.photos ?? []).filter(Boolean);
  const priceValidUntil = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);

  const aggregateRating = reviews.length
    ? {
        '@type': 'AggregateRating',
        ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      }
    : undefined;

  const review = reviews.slice(0, 15).map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author_name },
    datePublished: r.created_at.slice(0, 10),
    reviewBody: r.comment,
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: experience.name,
    description: experience.description,
    image: photos.length ? photos : undefined,
    brand: { '@type': 'Brand', name: siteName },
    category: experience.category,
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(review.length ? { review } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: Number(experience.price),
      priceValidUntil,
      availability: 'https://schema.org/InStock',
      url,
      seller: { '@id': `${siteUrl()}/#organization` },
    },
  };
}

export function touristTripSchema(experience: Experience & { slug?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: experience.name,
    description: experience.description,
    touristType: 'AdventureTraveler',
    provider: { '@id': `${siteUrl()}/#organization` },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: Number(experience.price),
      availability: 'https://schema.org/InStock',
    },
    itinerary: {
      '@type': 'ItemList',
      name: experience.name,
      description: `${experience.duration} · Salida: ${experience.meeting_point}`,
    },
    url: `${siteUrl()}${experiencePath(experience)}`,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function hotelSchema(hotel: Hotel, reviews: Review[] = []) {
  const aggregateRating = reviews.length
    ? {
        '@type': 'AggregateRating',
        ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      }
    : undefined;

  const review = reviews.slice(0, 15).map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author_name },
    datePublished: r.created_at.slice(0, 10),
    reviewBody: r.comment,
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.description,
    address: hotel.location,
    image: hotel.photos?.[0],
    priceRange: `S/${hotel.price_per_night}`,
    url: `${siteUrl()}/hoteles/${hotel.id}`,
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(review.length ? { review } : {}),
  };
}

export function guideArticleSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'es-PE',
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName, url: siteUrl() },
    mainEntityOfPage: `${siteUrl()}${path}`,
  };
}
