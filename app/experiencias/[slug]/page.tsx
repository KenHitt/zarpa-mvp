import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AddExperience } from '@/components/experience-actions';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqBlock } from '@/components/seo/faq-block';
import { getExperienceBySlug, getExperiences } from '@/lib/data/catalog';
import { faqsForExperience, SEO_COPY_BY_SLUG } from '@/lib/seo/content';
import { JsonLd } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  experienceProductSchema,
  faqSchema,
  touristTripSchema,
} from '@/lib/seo/schemas';
import { experiencePath, experienceSlug } from '@/lib/slug';
import type { Experience } from '@/lib/types';

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const experience = await getExperienceBySlug(params.slug);
  if (!experience) return { title: 'Experiencia no encontrada' };

  const slug = experienceSlug(experience);
  const seo = SEO_COPY_BY_SLUG[slug];
  const description =
    seo?.intro ??
    `${experience.description} Reserva ${experience.name} en Tingo María con operadores locales verificados.`;

  return pageMetadata({
    title: seo?.title ?? `${experience.name} · Tour en Tingo María`,
    description,
    path: experiencePath(experience),
    keywords: seo?.keywords ?? [
      experience.name.toLowerCase(),
      'turismo tingo maria',
      'tours tingo maria',
      experience.category.toLowerCase(),
    ],
    image: experience.photos?.[0] ?? null,
  });
}

function RelatedExperiences({ current, all }: { current: Experience; all: Experience[] }) {
  const related = all.filter((item) => item.id !== current.id).slice(0, 3);
  if (!related.length) return null;

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl text-forest">También te puede interesar</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((item) => (
          <li key={item.id}>
            <Link
              href={experiencePath(item)}
              className="block rounded-xl border border-forest/10 bg-white p-4 transition hover:border-forest/25 hover:shadow-sm"
            >
              <p className="font-semibold text-forest">{item.name}</p>
              <p className="mt-1 text-sm text-forest/60">Desde S/{item.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ExperienceDetailPage({ params }: Props) {
  const experience = await getExperienceBySlug(params.slug);
  if (!experience) notFound();

  const slug = experienceSlug(experience);
  if (params.slug !== slug) {
    redirect(`/experiencias/${slug}`);
  }

  const all = await getExperiences();
  const faqs = faqsForExperience(slug);
  const seo = SEO_COPY_BY_SLUG[slug];
  const path = experiencePath(experience);
  const photo = experience.photos?.[0];

  return (
    <article className="shell max-w-3xl py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Experiencias', href: '/experiencias' },
          { label: experience.name },
        ]}
      />

      <p className="eyebrow mt-6">
        {experience.category} · {experience.duration}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">
        {seo?.title ?? experience.name}
      </h1>

      {photo && (
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[24px] bg-forest/10">
          <Image
            src={photo}
            alt={`${experience.name} · turismo Tingo María`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-[center_35%]"
          />
        </div>
      )}

      <div className="mt-8 space-y-4 text-base leading-8 text-forest/80">
        {seo?.intro && <p className="text-lg text-forest">{seo.intro}</p>}
        <p>{experience.description}</p>
        <p>
          Salida desde <strong>{experience.meeting_point}</strong>. Duración:{' '}
          <strong>{experience.duration}</strong>. Ideal para quienes buscan{' '}
          {experience.category.toLowerCase()} en Tingo María y quieren reservar con un operador local
          verificado.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-cream/60 p-5 ring-1 ring-forest/10">
        <div>
          <p className="text-sm text-forest/60">Precio desde</p>
          <p className="font-display text-3xl text-forest">S/{experience.price}</p>
        </div>
        <AddExperience experience={experience} />
        <Link href="/mi-paquete" className="text-sm font-semibold text-forest underline underline-offset-4">
          Ver mi reserva →
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-forest/10 bg-white p-5">
        <h2 className="font-display text-xl text-forest">Guías relacionadas</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/guia/turismo-tingo-maria" className="font-semibold text-forest underline underline-offset-4">
              Turismo en Tingo María: qué hacer y cómo planear
            </Link>
          </li>
          {slug === 'catarata-derrepente' && (
            <li>
              <Link href="/guia/catarata-derrepente" className="font-semibold text-forest underline underline-offset-4">
                Guía completa de la catarata Derrepente
              </Link>
            </li>
          )}
          {slug === 'bosque-de-piedras' && (
            <li>
              <Link href="/guia/jurassic-park-peruano" className="font-semibold text-forest underline underline-offset-4">
                Jurassic Park peruano: Bosque de Piedras
              </Link>
            </li>
          )}
        </ul>
      </section>

      <FaqBlock faqs={faqs} />
      <RelatedExperiences current={experience} all={all} />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Experiencias', path: '/experiencias' },
            { name: experience.name, path },
          ]),
          experienceProductSchema(experience),
          touristTripSchema(experience),
          faqSchema(faqs),
        ]}
      />
    </article>
  );
}
