import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ExperienceGallery } from '@/components/experience-gallery';
import { HotelSelector } from '@/components/hotel-selector';
import { ReviewList } from '@/components/reviews/review-list';
import { ReviewForm } from '@/components/reviews/review-form';
import { ReviewStars } from '@/components/reviews/review-stars';
import { WhatsAppProductButton } from '@/components/whatsapp-product-button';
import { JsonLd } from '@/lib/seo/json-ld';
import { getHotel } from '@/lib/data/catalog';
import { getHotelReviews, reviewStats } from '@/lib/data/reviews';
import { CANCELLATION_POLICY } from '@/lib/copy';
import { pageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, hotelSchema } from '@/lib/seo/schemas';
import { whatsappHotelMessage } from '@/lib/whatsapp';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hotel = await getHotel(params.id);
  if (!hotel) return { title: 'Hotel no encontrado' };

  return pageMetadata({
    title: `${hotel.name} · Hospedaje en Tingo María`,
    description: `${hotel.description} Desde S/${hotel.price_per_night} por noche en ${hotel.location}.`,
    path: `/hoteles/${hotel.id}`,
    keywords: [hotel.name.toLowerCase(), 'hotel tingo maria', 'hospedaje tingo maria', hotel.location.toLowerCase()],
    image: hotel.photos?.[0] ?? null,
  });
}

export default async function HotelDetail({ params }: Props) {
  const hotel = await getHotel(params.id);
  if (!hotel) notFound();

  const path = `/hoteles/${hotel.id}`;
  const reviews = await getHotelReviews(hotel.id);
  const stats = reviewStats(reviews);

  return (
    <section className="shell max-w-3xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Hoteles', href: '/hoteles' },
          { label: hotel.name },
        ]}
      />
      <p className="mt-6 text-sm text-forest/60">{hotel.location}</p>
      <h1 className="font-display text-4xl text-forest sm:text-5xl">{hotel.name}</h1>
      {stats.count > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm text-forest/70">
          <ReviewStars value={stats.average} size="sm" />
          <span className="font-semibold text-forest">{stats.average.toFixed(1)}</span>
          <span>· {stats.count} {stats.count === 1 ? 'reseña' : 'reseñas'}</span>
        </div>
      )}
      <p className="mt-5 text-lg leading-relaxed text-forest/80">{hotel.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {hotel.amenities.map((a) => (
          <span key={a} className="rounded-full bg-white px-3 py-1 text-sm ring-1 ring-forest/10">
            {a}
          </span>
        ))}
      </div>

      {hotel.photos?.length ? <ExperienceGallery photos={hotel.photos} name={hotel.name} priority /> : null}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <p className="text-xl font-bold text-forest">
          S/{hotel.price_per_night} <span className="text-sm font-normal text-forest/55">por noche</span>
        </p>
        <WhatsAppProductButton
          message={whatsappHotelMessage(hotel.name, hotel.price_per_night)}
          productId={hotel.id}
          label="Consultar disponibilidad"
        />
      </div>
      <HotelSelector hotel={hotel} />
      <p className="mt-3 flex items-start gap-2 text-sm text-forest/70">
        <span aria-hidden className="text-forest">✓</span>
        {CANCELLATION_POLICY}
      </p>

      <section className="mt-10 rounded-2xl border border-forest/10 bg-cream/50 p-5">
        <h2 className="font-display text-xl text-forest">Combina tu estadía con una experiencia</h2>
        <p className="mt-2 text-sm leading-6 text-forest/70">
          Añade la catarata Derrepente, el Bosque de Piedras o un city tour a tu reserva y arma tu viaje completo.
        </p>
        <Link href="/experiencias" className="button mt-4">
          Ver experiencias
        </Link>
      </section>

      <section id="resenas" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-2xl text-forest">Reseñas de huéspedes</h2>
        <ReviewList reviews={reviews} stats={stats} />
        <ReviewForm hotelId={hotel.id} productName={hotel.name} />
      </section>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Hoteles', path: '/hoteles' },
            { name: hotel.name, path },
          ]),
          hotelSchema(hotel, reviews),
        ]}
      />
    </section>
  );
}
