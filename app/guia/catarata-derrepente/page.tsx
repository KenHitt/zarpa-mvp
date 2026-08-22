import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqBlock } from '@/components/seo/faq-block';
import { JsonLd } from '@/lib/seo/json-ld';
import { GUIDE_FAQS } from '@/lib/seo/content';
import { pageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, faqSchema, guideArticleSchema } from '@/lib/seo/schemas';

const path = '/guia/catarata-derrepente';

const DESCRIPTION =
  'Todo sobre la catarata Derrepente y el río Derrepente en Tingo María: cómo llegar, qué esperar, precio y cómo reservar el tour con operadores locales.';

export const metadata: Metadata = pageMetadata({
  title: 'Catarata Derrepente · Río Derrepente en Tingo María',
  description: DESCRIPTION,
  path,
  keywords: [
    'catarata derrepente',
    'rio derrepente',
    'derrepente tingo maria',
    'cataratas tingo maria',
    'cayumba tingo maria',
    'tour derrepente',
  ],
});

export default function CatarataDerrepenteGuide() {
  const faqs = GUIDE_FAQS['catarata-derrepente'];

  return (
    <article className="shell max-w-3xl py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Guías', href: '/guia' },
          { label: 'Catarata Derrepente' },
        ]}
      />
      <p className="eyebrow mt-6">Guía Zarpa · Naturaleza</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">
        Catarata Derrepente y río Derrepente
      </h1>
      <p className="mt-6 text-lg leading-8 text-forest/80">
        Si googlearas <strong>catarata Derrepente</strong>, <strong>río Derrepente</strong> o{' '}
        <strong>Derrepente Tingo María</strong>, esta es la excursión estrella de la ciudad: caminata por
        la selva, chapuzón en aguas cristalinas y una cascada espectacular en la zona de Cayumba.
      </p>

      <section className="mt-10 space-y-4 text-base leading-8 text-forest/80">
        <h2 className="font-display text-2xl text-forest">Qué esperar del tour</h2>
        <p>
          Los tours suelen salir desde la Plaza de Armas de Tingo María. Incluyen traslado, guía local y
          tiempo para caminar, fotografiar y bañarse en el río antes de llegar a la catarata.
        </p>
        <p>
          Lleva ropa cómoda, repelente, calzado con buen agarre y una bolsa impermeable para tu celular.
          Es una de las mejores formas de conocer la selva central sin complicaciones.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/experiencias/catarata-derrepente" className="button bg-amber text-forest hover:bg-amber/90">
          Reservar tour Derrepente
        </Link>
        <Link href="/guia/turismo-tingo-maria" className="button">
          Más sobre Tingo María
        </Link>
      </div>

      <FaqBlock faqs={faqs} />
      <JsonLd
        data={[
          guideArticleSchema({
            title: 'Catarata Derrepente · Tingo María',
            description: DESCRIPTION,
            path,
          }),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Guías', path: '/guia' },
            { name: 'Catarata Derrepente', path },
          ]),
          faqSchema(faqs),
        ]}
      />
    </article>
  );
}
