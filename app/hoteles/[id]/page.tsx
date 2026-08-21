import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { HotelSelector } from '@/components/hotel-selector';
import { JsonLd } from '@/lib/seo/json-ld';
import { getHotel } from '@/lib/data/catalog';
import { pageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, hotelSchema } from '@/lib/seo/schemas';

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
      <h1 className="font-display text-5xl text-forest">{hotel.name}</h1>
      <p className="mt-5 text-lg leading-relaxed text-forest/80">{hotel.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {hotel.amenities.map((a) => (
          <span key={a} className="rounded-full bg-white px-3 py-1 text-sm ring-1 ring-forest/10">
            {a}
          </span>
        ))}
      </div>
      <p className="mt-7 text-xl font-bold text-forest">S/{hotel.price_per_night} por noche</p>
      <HotelSelector hotel={hotel} />
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Hoteles', path: '/hoteles' },
            { name: hotel.name, path },
          ]),
          hotelSchema(hotel),
        ]}
      />
    </section>
  );
}
