import Link from 'next/link';
import Image from 'next/image';
import { getExperiences, getHotels } from '@/lib/data/catalog';
import { ExperienceCard, HotelCard } from '@/components/catalog';

export const revalidate = 60;

export default async function Home() {
  const [hotels, experiences] = await Promise.all([getHotels(), getExperiences()]);
  const featured = experiences.find((x) => x.name.toLowerCase().includes('derrepente')) || experiences[0];
  const featuredPhoto = featured?.photos?.[0];

  return (
    <>
      <section className="border-b border-forest/10">
        <div className="shell grid min-h-[600px] items-center gap-12 py-16 lg:grid-cols-[.92fr_1.08fr] lg:py-20">
          <div>
            <p className="eyebrow">Tingo María, Perú</p>
            <h1 className="mt-5 max-w-xl font-display text-5xl leading-[.96] tracking-tight text-forest sm:text-7xl">
              Encuentra tu próxima historia.
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-forest/70">
              Experiencias de naturaleza seleccionadas y reservas simples, directamente con operadores locales.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/experiencias" className="button">
                Ver experiencias
              </Link>
              <Link
                href="/mi-paquete"
                className="inline-flex min-h-11 items-center rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition hover:border-forest"
              >
                Mi viaje
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-forest/55">
              <span>Reserva en minutos</span>
              <span>Operadores locales</span>
              <span>Yape, Plin o tarjeta</span>
            </div>
          </div>

          {featured && (
            <article className="group relative overflow-hidden rounded-[28px] bg-forest shadow-[0_24px_60px_rgba(17,50,35,.18)]">
              <div className="relative h-[420px] sm:h-[500px]">
                {featuredPhoto ? (
                  <Image
                    src={featuredPhoto}
                    alt={featured.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-[center_35%] transition duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/90 to-amber/60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/88 via-forest/25 to-forest/5" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber">Experiencia destacada</p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl">{featured.name}</h2>
                <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/85">
                  <span>
                    {featured.duration} · Desde S/{featured.price}
                  </span>
                  <Link className="rounded-full bg-white px-4 py-2 font-semibold text-forest" href="/experiencias">
                    Explorar
                  </Link>
                </div>
              </div>
            </article>
          )}
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
          {experiences.slice(0, 3).map((e) => (
            <ExperienceCard key={e.id} experience={e} />
          ))}
        </div>
        <Link className="button mt-7 w-full sm:hidden" href="/experiencias">
          Ver todas las experiencias
        </Link>
      </section>

      <section className="border-y border-forest/10 bg-white">
        <div className="shell grid gap-8 py-12 sm:grid-cols-3 sm:py-14">
          <div>
            <p className="eyebrow">01</p>
            <h3 className="mt-3 font-display text-2xl text-forest">Elige</h3>
            <p className="mt-2 text-sm leading-6 text-forest/65">Selecciona una experiencia que te interese.</p>
          </div>
          <div>
            <p className="eyebrow">02</p>
            <h3 className="mt-3 font-display text-2xl text-forest">Personaliza</h3>
            <p className="mt-2 text-sm leading-6 text-forest/65">Añade hospedaje o más rutas a tu viaje.</p>
          </div>
          <div>
            <p className="eyebrow">03</p>
            <h3 className="mt-3 font-display text-2xl text-forest">Reserva</h3>
            <p className="mt-2 text-sm leading-6 text-forest/65">Registra tu pago y recibe confirmación del operador.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-forest/10 bg-white">
        <div className="shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[.68fr_1.32fr]">
            <div>
              <p className="eyebrow">Quédate más tiempo</p>
              <h2 className="section-title">Hospedaje, cuando lo necesites.</h2>
              <p className="mt-5 max-w-sm leading-7 text-forest/65">
                Añade un lugar para descansar a una experiencia que ya elegiste.
              </p>
              <Link className="mt-7 inline-block text-sm font-semibold text-forest underline underline-offset-4" href="/hoteles">
                Ver hospedajes
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.slice(0, 3).map((h) => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
