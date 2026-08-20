import { getExperiences } from '@/lib/data/catalog';
import { ExperienceCatalog } from '@/components/catalog-filters';
import { TrustStrip } from '@/components/trust-strip';

export const revalidate = 60;

export default async function Experiences() {
  const experiences = await getExperiences();

  return (
    <section className="shell py-12 sm:py-16">
      <p className="eyebrow">Experiencias de Tingo María</p>
      <h1 className="section-title">Elige tu próxima aventura</h1>
      <p className="mt-3 max-w-2xl leading-7 text-forest/70">
        Añade a tu reserva en un toque. Pagas con Yape o Plin y el operador local confirma tu cupo.
      </p>
      <TrustStrip compact />
      <div className="mt-9">
        <ExperienceCatalog experiences={experiences} />
      </div>
    </section>
  );
}
