export function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zarpa-mvp.vercel.app';
  return url.replace(/\/$/, '');
}

export const siteName = 'Zarpa';
export const siteTagline = 'Turismo y aventuras en Tingo María';
export const defaultDescription =
  'Reserva tours en Tingo María: catarata Derrepente, río Derrepente, Bosque de Piedras (Jurassic Park peruano), cuevas y más. Operadores locales verificados. Paga con Yape o Plin.';

export const defaultOgImage = '/brand/logotipo.png';

export const defaultKeywords = [
  'turismo tingo maria',
  'tingo maria peru',
  'catarata derrepente',
  'rio derrepente',
  'derrepente tingo maria',
  'jurassic park peruano',
  'bosque de piedras tingo maria',
  'que hacer en tingo maria',
  'tours tingo maria',
  'aventura huánuco',
];
