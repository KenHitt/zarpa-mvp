import type { Experience, Hotel } from '@/lib/types';
import { experiencePath, experienceSlug } from '@/lib/slug';
import { siteName, siteUrl } from './site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: siteName,
    url: siteUrl(),
    logo: `${siteUrl()}/brand/logotipo.png`,
    description: 'Marketplace de turismo y aventuras en Tingo María, Perú.',
    areaServed: {
      '@type': 'City',
      name: 'Tingo María',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Huánuco, Perú' },
    },
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

export function experienceProductSchema(experience: Experience & { slug?: string | null }) {
  const path = experiencePath(experience);
  const photo = experience.photos?.[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: experience.name,
    description: experience.description,
    image: photo ? [photo] : undefined,
    brand: { '@type': 'Brand', name: siteName },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: Number(experience.price),
      availability: 'https://schema.org/InStock',
      url: `${siteUrl()}${path}`,
    },
    category: experience.category,
  };
}

export function touristTripSchema(experience: Experience & { slug?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: experience.name,
    description: experience.description,
    touristType: 'AdventureTraveler',
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

export function hotelSchema(hotel: Hotel) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.description,
    address: hotel.location,
    image: hotel.photos?.[0],
    priceRange: `S/${hotel.price_per_night}`,
    url: `${siteUrl()}/hoteles/${hotel.id}`,
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

export function allExperienceSlugsForSitemap(experiences: (Experience & { slug?: string | null })[]) {
  return experiences.map((e) => experienceSlug(e));
}
