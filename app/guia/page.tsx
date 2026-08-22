import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schemas';

const path = '/guia';

const DESCRIPTION =
  'Guías de viaje a Tingo María: qué hacer, catarata Derrepente, Bosque de Piedras (Jurassic Park peruano) y más. Planifica tu aventura y reserva con operadores locales.';

export const metadata: Metadata = pageMetadata({
  title: 'Guías de viaje a Tingo María',
  description: DESCRIPTION,
  path,
  keywords: ['guia tingo maria', 'que hacer en tingo maria', 'turismo tingo maria', 'viaje a tingo maria'],
});

const guides = [
  {
    href: '/guia/turismo-tingo-maria',
    title: 'Turismo en Tingo María',
    text: 'Qué hacer, cuántos días quedarte y cómo reservar tu viaje completo.',
  },
  {
    href: '/guia/catarata-derrepente',
    title: 'Catarata Derrepente',
    text: 'Río Derrepente, Cayumba y todo lo que debes saber antes del tour.',
  },
  {
    href: '/guia/jurassic-park-peruano',
    title: 'Jurassic Park peruano',
    text: 'Bosque de Piedras: las formaciones rocosas más fotografiadas de la selva central.',
  },
];

export default function GuidesIndex() {
  return (
    <section className="shell max-w-3xl py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Guías' }]} />
      <p className="eyebrow mt-6">Guías Zarpa</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">
        Guías de viaje a Tingo María
      </h1>
      <p className="mt-6 text-lg leading-8 text-forest/80">
        Todo lo que necesitas para planear tu viaje a la selva central del Perú: qué visitar, cómo llegar y
        cómo reservar con operadores locales verificados.
      </p>

      <ul className="mt-10 grid gap-4">
        {guides.map((guide) => (
          <li key={guide.href}>
            <Link
              href={guide.href}
              className="block rounded-2xl border border-forest/10 bg-white p-5 transition hover:border-forest/25 hover:shadow-sm"
            >
              <h2 className="font-display text-xl text-forest">{guide.title}</h2>
              <p className="mt-2 text-sm leading-6 text-forest/70">{guide.text}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-forest underline underline-offset-4">
                Leer guía →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link href="/experiencias" className="button">
          Ver todas las experiencias
        </Link>
      </div>

      <JsonLd data={[breadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: 'Guías', path }])]} />
    </section>
  );
}
