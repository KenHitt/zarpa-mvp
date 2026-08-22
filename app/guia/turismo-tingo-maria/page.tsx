import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqBlock } from '@/components/seo/faq-block';
import { JsonLd } from '@/lib/seo/json-ld';
import { GUIDE_FAQS } from '@/lib/seo/content';
import { pageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, faqSchema, guideArticleSchema } from '@/lib/seo/schemas';

const path = '/guia/turismo-tingo-maria';

const DESCRIPTION =
  'Guía de turismo Tingo María: catarata Derrepente, río Derrepente, Bosque de Piedras (Jurassic Park peruano), cuevas y city tour. Reserva tours con operadores locales.';

export const metadata: Metadata = pageMetadata({
  title: 'Turismo en Tingo María · Qué hacer, tours y cómo reservar',
  description: DESCRIPTION,
  path,
  keywords: [
    'turismo tingo maria',
    'tingo maria peru',
    'que hacer en tingo maria',
    'viaje a tingo maria',
    'tours tingo maria',
    'turismo huánuco',
  ],
});

const highlights = [
  {
    title: 'Catarata Derrepente',
    href: '/experiencias/catarata-derrepente',
    text: 'El tour más buscado: río Derrepente, selva y una caída de agua inolvidable en Cayumba.',
  },
  {
    title: 'Bosque de Piedras · Jurassic Park peruano',
    href: '/guia/jurassic-park-peruano',
    text: 'Formaciones rocosas únicas que muchos llaman el Jurassic Park peruano.',
  },
  {
    title: 'Cueva de las Lechuzas',
    href: '/experiencias/cueva-de-las-lechuzas',
    text: 'Parque Nacional Tingo María y fauna emblemática de la selva.',
  },
  {
    title: 'La Bella Durmiente',
    href: '/experiencias/bella-durmiente',
    text: 'Mirador y la silueta más famosa de la ciudad.',
  },
];

export default function TurismoTingoMariaGuide() {
  const faqs = GUIDE_FAQS['turismo-tingo-maria'];

  return (
    <article className="shell max-w-3xl py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Guías', href: '/guia' },
          { label: 'Turismo Tingo María' },
        ]}
      />
      <p className="eyebrow mt-6">Guía Zarpa</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">
        Turismo en Tingo María: qué hacer y cómo reservar
      </h1>
      <p className="mt-6 text-lg leading-8 text-forest/80">
        Tingo María es la puerta de la selva central peruana. Si buscas <strong>turismo Tingo María</strong>,
        cataratas, ríos y cuevas, aquí tienes lo esencial para planear tu viaje y reservar con operadores
        locales en minutos.
      </p>

      <section className="mt-10 space-y-4 text-base leading-8 text-forest/80">
        <h2 className="font-display text-2xl text-forest">Experiencias imprescindibles</h2>
        <ul className="grid gap-4">
          {highlights.map((item) => (
            <li key={item.href} className="rounded-2xl border border-forest/10 bg-white p-5">
              <Link href={item.href} className="font-display text-xl text-forest hover:underline">
                {item.title}
              </Link>
              <p className="mt-2 text-sm leading-7 text-forest/75">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 text-base leading-8 text-forest/80">
        <h2 className="font-display text-2xl text-forest">Cómo reservar con Zarpa</h2>
        <p className="mt-4">
          Elige experiencias, revisa fechas, paga con Yape o Plin y recibe confirmación del operador. También
          puedes armar paquete con hospedaje y compartirlo por WhatsApp con tu grupo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/experiencias" className="button">
            Ver todos los tours
          </Link>
          <Link href="/guia/catarata-derrepente" className="button bg-amber text-forest hover:bg-amber/90">
            Guía Derrepente
          </Link>
        </div>
      </section>

      <FaqBlock faqs={faqs} />
      <JsonLd
        data={[
          guideArticleSchema({
            title: 'Turismo en Tingo María',
            description: DESCRIPTION,
            path,
          }),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Guías', path: '/guia' },
            { name: 'Turismo Tingo María', path },
          ]),
          faqSchema(faqs),
        ]}
      />
    </article>
  );
}
