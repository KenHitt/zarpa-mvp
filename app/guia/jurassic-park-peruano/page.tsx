import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqBlock } from '@/components/seo/faq-block';
import { JsonLd } from '@/lib/seo/json-ld';
import { GUIDE_FAQS } from '@/lib/seo/content';
import { pageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, faqSchema, guideArticleSchema } from '@/lib/seo/schemas';

const path = '/guia/jurassic-park-peruano';

const DESCRIPTION =
  'Descubre el Bosque de Piedras de Tingo María, conocido como Jurassic Park peruano: formaciones rocosas, selva y tour de día completo. Reserva con Zarpa.';

export const metadata: Metadata = pageMetadata({
  title: 'Jurassic Park peruano · Bosque de Piedras Tingo María',
  description: DESCRIPTION,
  path,
  keywords: [
    'jurassic park peruano',
    'jurasik park peruano',
    'bosque de piedras tingo maria',
    'formaciones rocosas tingo maria',
    'turismo tingo maria',
  ],
});

export default function JurassicParkGuide() {
  const faqs = GUIDE_FAQS['jurassic-park-peruano'];

  return (
    <article className="shell max-w-3xl py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Guías', href: '/guia/turismo-tingo-maria' },
          { label: 'Jurassic Park peruano' },
        ]}
      />
      <p className="eyebrow mt-6">Guía Zarpa · Aventura</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">
        Jurassic Park peruano: Bosque de Piedras
      </h1>
      <p className="mt-6 text-lg leading-8 text-forest/80">
        En redes y boca a boca, muchos viajeros buscan <strong>Jurassic Park peruano</strong> o{' '}
        <strong>Jurasik Park</strong> refiriéndose al <strong>Bosque de Piedras</strong> de Tingo María:
        un paisaje de rocas gigantes en plena selva, perfecto para fotos y caminatas.
      </p>

      <section className="mt-10 space-y-4 text-base leading-8 text-forest/80">
        <h2 className="font-display text-2xl text-forest">Por qué es tan popular</h2>
        <p>
          Las formaciones rocosas crean un escenario único que contrasta con la vegetación amazónica. Es un
          tour de día completo ideal para quienes ya conocieron Derrepente o las cuevas y buscan otra
          experiencia fuerte en la región.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/experiencias/bosque-de-piedras" className="button bg-amber text-forest hover:bg-amber/90">
          Reservar Bosque de Piedras
        </Link>
        <Link href="/guia/turismo-tingo-maria" className="button">
          Guía de Tingo María
        </Link>
      </div>

      <FaqBlock faqs={faqs} />
      <JsonLd
        data={[
          guideArticleSchema({
            title: 'Jurassic Park peruano · Bosque de Piedras',
            description: DESCRIPTION,
            path,
          }),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Guías', path: '/guia/turismo-tingo-maria' },
            { name: 'Jurassic Park peruano', path },
          ]),
          faqSchema(faqs),
        ]}
      />
    </article>
  );
}
