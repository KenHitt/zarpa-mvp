'use client';

import Link from 'next/link';
import { RotatingCover } from '@/components/rotating-cover';
import { experiencePath } from '@/lib/slug';
import type { Experience } from '@/lib/types';

type Props = {
  experience: Experience;
};

export function FeaturedExperienceHero({ experience }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] bg-forest shadow-[0_24px_60px_rgba(17,50,35,.18)]">
      <RotatingCover
        photos={experience.photos}
        name={experience.name}
        priority
        aspectClass="h-[420px] sm:h-[500px]"
        imageClass="object-cover object-[center_35%]"
        sizes="(max-width: 1024px) 100vw, 58vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/88 via-forest/25 to-forest/5" />
      <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber">Experiencia destacada</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">{experience.name}</h2>
        <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/85">
          <span>
            {experience.duration} · Desde S/{experience.price}
          </span>
          <Link
            className="rounded-full bg-white px-4 py-2 font-semibold text-forest"
            href={experiencePath(experience)}
            prefetch
          >
            Ver tour
          </Link>
        </div>
      </div>
    </article>
  );
}
