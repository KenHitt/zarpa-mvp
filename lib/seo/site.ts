export function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zarpa-mvp.vercel.app';
  return url.replace(/\/$/, '');
}

export const siteName = 'Zarpa';
export const siteTagline = 'Turismo y aventuras en Tingo María';
export const siteTabTitle = 'Zarpa : turismo-tingo-maria';
export const defaultDescription =
  'Reserva tours en Tingo María: catarata Derrepente, río Derrepente, Bosque de Piedras (Jurassic Park peruano), cuevas y más. Operadores locales verificados. Paga con Yape o Plin.';

export const defaultOgImage = '/brand/logotipo.png';

/** Datos de negocio para SEO local (rich results de Google). */
export const businessInfo = {
  phone: '+51921682529',
  email: 'reservas@zarpa.travel',
  priceRange: 'S/40 – S/300',
  address: {
    locality: 'Tingo María',
    region: 'Huánuco',
    country: 'PE',
  },
  geo: {
    latitude: -9.2963,
    longitude: -75.9967,
  },
};

/** Perfiles sociales (para el campo sameAs de schema.org). */
export const socialProfiles = ['https://www.tiktok.com/@zarpa.travel'];

export const defaultKeywords = [
  'turismo tingo maria',
  'tingo maria peru',
  'catarata derrepente',
  'rio derrepente',
  'derrepente tingo maria',
  'jurassic park peruano',
  'bosque de piedras tingo maria',
  'cueva de las lechuzas',
  'bella durmiente tingo maria',
  'que hacer en tingo maria',
  'tours tingo maria',
  'paquetes turisticos tingo maria',
  'agencia de viajes tingo maria',
  'city tour tingo maria',
  'aventura huánuco',
];
