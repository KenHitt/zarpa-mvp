import Link from 'next/link';
import type { Experience, Hotel } from '@/lib/types';
import { experiencePath } from '@/lib/slug';
import { RotatingCover } from '@/components/rotating-cover';
import { AddExperience } from './experience-actions';

export function HotelCard({ hotel, priority = false }: { hotel: Hotel; priority?: boolean }) {
  return (
    <article className="catalog-card group">
      <RotatingCover photos={hotel.photos} name={hotel.name} priority={priority} />
      <div className="p-5">
        <p className="text-sm text-forest/60">{hotel.location}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight text-forest">{hotel.name}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-forest/75">{hotel.description}</p>
        <div className="mt-4 flex min-h-7 flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="rounded-full bg-cream px-2.5 py-1 text-xs text-forest/75">
              {a}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-forest/10 pt-4">
          <div>
            <b className="text-lg text-forest">S/{hotel.price_per_night}</b>
            <small className="ml-1 text-forest/55">/ noche</small>
          </div>
          <Link className="button" href={`/hoteles/${hotel.id}`} prefetch>
            Elegir fechas
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ExperienceCard({ experience, priority = false }: { experience: Experience; priority?: boolean }) {
  const href = experiencePath(experience);

  return (
    <article className="catalog-card group">
      <Link href={href} prefetch className="block">
        <RotatingCover photos={experience.photos} name={experience.name} priority={priority} />
      </Link>
      <div className="p-5">
        {experience.is_featured && (
          <span className="mb-2 inline-block rounded-full bg-amber/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-forest">
            Recomendado por Zarpa
          </span>
        )}
        <p className="text-xs font-bold uppercase tracking-[.13em] text-amber">
          {experience.category} <span className="text-forest/35">·</span> {experience.duration}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight text-forest">
          <Link href={href} prefetch className="hover:underline">
            {experience.name}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-forest/75">{experience.description}</p>
        <p className="mt-3 truncate text-xs text-forest/55">Salida: {experience.meeting_point}</p>
        <p className="mt-2 text-xs text-forest/45">Reserva en minutos · cupos según disponibilidad</p>
        <div className="mt-5 flex items-center justify-between border-t border-forest/10 pt-4">
          <b className="text-lg text-forest">S/{experience.price}</b>
          <div className="flex items-center gap-2">
            <Link href={href} prefetch className="hidden text-sm font-semibold text-forest underline underline-offset-4 sm:inline">
              Ver tour
            </Link>
            <AddExperience experience={experience} />
          </div>
        </div>
      </div>
    </article>
  );
}
