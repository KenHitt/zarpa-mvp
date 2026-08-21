import type { Metadata } from 'next';
import { getHotels } from '@/lib/data/catalog';
import { HotelCatalog } from '@/components/catalog-filters';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: 'Hospedaje en Tingo María',
  description:
    'Hoteles en Tingo María para combinar con tus tours. Añade hospedaje a tu reserva de cataratas, cuevas y experiencias en la selva central.',
  path: '/hoteles',
  keywords: ['hoteles tingo maria', 'hospedaje tingo maria', 'donde hospedarse tingo maria', 'turismo tingo maria'],
});

export default async function Hotels({ searchParams }: { searchParams: { tier?: string } }) {
  const hotels = await getHotels();

  return (
    <section className="shell py-12 sm:py-16">
      <p className="eyebrow">Hospedaje en Tingo María</p>
      <h1 className="section-title">Hoteles en Tingo María</h1>
      <p className="mt-3 max-w-2xl leading-7 text-forest/70">
        Descansa cerca de la aventura. Añade hospedaje a tu ruta cuando lo necesites; las experiencias siguen siendo
        el centro de tu viaje.
      </p>
      <div className="mt-9">
        <HotelCatalog hotels={hotels} initialTier={searchParams.tier} />
      </div>
    </section>
  );
}
