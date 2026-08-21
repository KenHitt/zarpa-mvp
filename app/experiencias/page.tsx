import type { Metadata } from 'next';
import { getExperiences } from '@/lib/data/catalog';
import { ExperienceCatalog } from '@/components/catalog-filters';
import { TrustStrip } from '@/components/trust-strip';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: 'Experiencias y tours en Tingo María',
  description:
    'Reserva tours en Tingo María: catarata Derrepente, Bosque de Piedras, cuevas, city tour y más. Compara precios y reserva con operadores locales.',
  path: '/experiencias',
  keywords: [
    'tours tingo maria',
    'experiencias tingo maria',
    'catarata derrepente tour',
    'que hacer tingo maria',
    'turismo tingo maria',
  ],
});

export default async function Experiences() {
  const experiences = await getExperiences();

  return (
    <section className="shell py-12 sm:py-16">
      <p className="eyebrow">Experiencias de Tingo María</p>
      <h1 className="section-title">Tours y aventuras en Tingo María</h1>
      <p className="mt-3 max-w-2xl leading-7 text-forest/70">
        Cataratas, cuevas, naturaleza y cultura local. Añade a tu reserva en un toque y paga con Yape o Plin.
      </p>
      <TrustStrip compact />
      <div className="mt-9">
        <ExperienceCatalog experiences={experiences} />
      </div>
    </section>
  );
}
