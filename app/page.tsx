import Link from 'next/link';
import { getExperiences, getHotels } from '@/lib/data/catalog';
import { getRecentApprovedReviews } from '@/lib/data/reviews';
import { ExperienceCard, HotelCard } from '@/components/catalog';
import { FeaturedExperienceHero } from '@/components/featured-experience-hero';
import { TrustStrip } from '@/components/trust-strip';
import { ReviewStars } from '@/components/reviews/review-stars';
import { pageMetadata } from '@/lib/seo/metadata';
import { siteTabTitle } from '@/lib/seo/site';
import { whatsappContactUrl } from '@/lib/whatsapp';

export const metadata = {
  ...pageMetadata({
    title: 'Turismo Tingo María · Catarata Derrepente, tours y reservas',
    description:
      'Reserva turismo en Tingo María: catarata Derrepente, río Derrepente, Jurassic Park peruano (Bosque de Piedras), cuevas y hospedaje. Operadores locales verificados.',
    path: '/',
  }),
  title: { absolute: siteTabTitle },
};
export const revalidate = 60;

export default async function Home() {
  const [hotels, experiences, recentReviews] = await Promise.all([
    getHotels(),
    getExperiences(),
    getRecentApprovedReviews(3),
  ]);
  const featured = experiences.find((x) => x.name.toLowerCase().includes('derrepente')) || experiences[0];
  const minExperience = experiences.length ? Math.min(...experiences.map((e) => Number(e.price))) : 0;
  const minHotel = hotels.length ? Math.min(...hotels.map((h) => Number(h.price_per_night))) : 0;

  const productName = new Map<string, string>();
  experiences.forEach((e) => productName.set(e.id, e.name));
  hotels.forEach((h) => productName.set(h.id, h.name));
  const reviewProduct = (r: (typeof recentReviews)[number]) =>
    (r.experience_id && productName.get(r.experience_id)) || (r.hotel_id && productName.get(r.hotel_id)) || null;

  return (
    <>
      <section className="border-b border-forest/10">
        <div className="shell grid min-h-[600px] items-center gap-12 py-16 lg:grid-cols-[.92fr_1.08fr] lg:py-20">
          <div>
            <p className="eyebrow">Tingo María, Perú</p>
            <h1 className="mt-5 max-w-xl font-display text-5xl leading-[.96] tracking-tight text-forest sm:text-7xl">
              Turismo en Tingo María: reserva en minutos
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-forest/70">
              Catarata Derrepente, ríos, cuevas y tours locales con operadores de
              Tingo María. Sin filas: eliges, pagas con Yape o Plin y recibes tu confirmación.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/experiencias" className="button" prefetch>
                Explorar experiencias
              </Link>
              <Link
                href="/hoteles"
                prefetch
                className="inline-flex min-h-11 items-center rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition hover:border-forest"
              >
                Ver hospedaje
              </Link>
            </div>
            <TrustStrip />
          </div>

          {featured && <FeaturedExperienceHero experience={featured} />}
        </div>
      </section>

      <section className="border-b border-forest/10 bg-white">
        <div className="shell py-12 sm:py-14">
          <p className="eyebrow">Empieza aquí</p>
          <h2 className="section-title">¿Qué buscas hoy?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/experiencias"
              className="rounded-2xl border border-forest/10 bg-cream/40 p-6 transition hover:border-forest/30 hover:shadow-md"
            >
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber">Experiencias</p>
              <h3 className="mt-2 font-display text-2xl text-forest">Tours y aventuras</h3>
              <p className="mt-2 text-sm leading-6 text-forest/65">
                {experiences.length} experiencias · desde S/{minExperience}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-forest underline underline-offset-4">
                Explorar →
              </span>
            </Link>
            <Link
              href="/hoteles"
              className="rounded-2xl border border-forest/10 bg-cream/40 p-6 transition hover:border-forest/30 hover:shadow-md"
            >
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber">Hospedaje · opcional</p>
              <h3 className="mt-2 font-display text-2xl text-forest">Dónde quedarte</h3>
              <p className="mt-2 text-sm leading-6 text-forest/65">
                {hotels.length} hoteles · desde S/{minHotel}/noche
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-forest underline underline-offset-4">
                Ver hoteles →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="shell py-20 sm:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Explora la selva</p>
            <h2 className="section-title">Una experiencia que vale el viaje.</h2>
          </div>
          <Link className="hidden text-sm font-semibold text-forest underline underline-offset-4 sm:block" href="/experiencias">
            Ver todas
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.slice(0, 3).map((e, i) => (
            <ExperienceCard key={e.id} experience={e} priority={i === 0} />
          ))}
        </div>
        {experiences.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-forest/20 p-6 text-center text-forest/60">
            Estamos preparando nuevas experiencias.{' '}
            <a
              href={whatsappContactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-forest underline underline-offset-4"
            >
              Consulta por WhatsApp
            </a>
          </p>
        )}
        <Link className="button mt-7 w-full sm:hidden" href="/experiencias">
          Ver todas las experiencias
        </Link>
      </section>

      <section className="border-y border-forest/10 bg-white">
        <div className="shell grid gap-8 py-12 sm:grid-cols-3 sm:py-14">
          <div>
            <p className="eyebrow">01</p>
            <h3 className="mt-3 font-display text-2xl text-forest">Explora</h3>
            <p className="mt-2 text-sm leading-6 text-forest/65">Elige experiencias y, si quieres, hospedaje.</p>
          </div>
          <div>
            <p className="eyebrow">02</p>
            <h3 className="mt-3 font-display text-2xl text-forest">Revisa</h3>
            <p className="mt-2 text-sm leading-6 text-forest/65">Confirma fechas y total en tu reserva.</p>
          </div>
          <div>
            <p className="eyebrow">03</p>
            <h3 className="mt-3 font-display text-2xl text-forest">Paga</h3>
            <p className="mt-2 text-sm leading-6 text-forest/65">
              Con Yape o Plin, subiendo tu comprobante. El operador confirma al toque.
            </p>
          </div>
        </div>
      </section>

      {recentReviews.length > 0 && (
        <section className="border-b border-forest/10">
          <div className="shell py-16 sm:py-20">
            <p className="eyebrow">Viajeros reales</p>
            <h2 className="section-title">Lo que dicen quienes ya viajaron.</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {recentReviews.map((r) => (
                <figure key={r.id} className="rounded-2xl border border-forest/10 bg-white p-5">
                  <ReviewStars value={r.rating} size="sm" />
                  <blockquote className="mt-3 text-sm leading-6 text-forest/80">“{r.comment}”</blockquote>
                  <figcaption className="mt-4 text-xs font-semibold text-forest">
                    {r.author_name}
                    {reviewProduct(r) && (
                      <span className="mt-0.5 block font-normal text-forest/55">{reviewProduct(r)}</span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-forest/10 bg-white">
        <div className="shell py-16 sm:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Hospedaje</p>
              <h2 className="section-title">Quédate más tiempo.</h2>
              <p className="mt-3 max-w-sm text-forest/65">Opcional. Combínalo con cualquier experiencia.</p>
            </div>
            <Link className="hidden text-sm font-semibold text-forest underline underline-offset-4 sm:block" href="/hoteles">
              Ver todos
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.slice(0, 3).map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
          {hotels.length === 0 && (
            <p className="mt-10 rounded-2xl border border-dashed border-forest/20 p-6 text-center text-forest/60">
              Pronto publicaremos hospedajes aliados en Tingo María.
            </p>
          )}
          <Link className="button mt-7 w-full sm:hidden" href="/hoteles">
            Ver todos los hoteles
          </Link>
        </div>
      </section>
      <section className="border-b border-forest/10 bg-cream/30">
        <div className="shell py-12 sm:py-14">
          <p className="eyebrow">Guías de viaje</p>
          <h2 className="section-title">Planifica tu aventura en Tingo María</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link href="/guia/turismo-tingo-maria" className="rounded-2xl bg-white p-5 ring-1 ring-forest/10 transition hover:shadow-md">
              <h3 className="font-display text-xl text-forest">Turismo Tingo María</h3>
              <p className="mt-2 text-sm text-forest/65">Qué hacer, cuántos días y cómo reservar.</p>
            </Link>
            <Link href="/guia/catarata-derrepente" className="rounded-2xl bg-white p-5 ring-1 ring-forest/10 transition hover:shadow-md">
              <h3 className="font-display text-xl text-forest">Catarata Derrepente</h3>
              <p className="mt-2 text-sm text-forest/65">Río Derrepente, Cayumba y tips del tour.</p>
            </Link>
            <Link href="/guia/jurassic-park-peruano" className="rounded-2xl bg-white p-5 ring-1 ring-forest/10 transition hover:shadow-md">
              <h3 className="font-display text-xl text-forest">Jurassic Park peruano</h3>
              <p className="mt-2 text-sm text-forest/65">Bosque de Piedras y formaciones rocosas.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-forest text-cream">
        <div className="shell flex flex-col items-center py-16 text-center sm:py-20">
          <p className="eyebrow">Reserva hoy</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl leading-[1.05] tracking-tight sm:text-5xl">
            ¿Listo para conocer Tingo María?
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-cream/75">
            Elige tu experiencia, paga con Yape o Plin y recibe confirmación en pocas horas.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/experiencias" className="button bg-amber text-forest hover:bg-amber/90">
              Reservar una experiencia
            </Link>
            <a
              href={whatsappContactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-cream/30 px-5 text-sm font-semibold text-cream transition hover:border-cream"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
