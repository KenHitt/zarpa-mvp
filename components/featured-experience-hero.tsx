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
        showOverlay={false}
        aspectClass="h-[420px] sm:h-[500px]"
        imageClass="object-cover object-[center_35%]"
        sizes="(max-width: 1024px) 100vw, 58vw"
      />

      {/* Scrim sutil: solo la franja inferior donde va el texto; la foto se ve nítida */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-forest/85 via-forest/40 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-9">
        <p className="hero-eyebrow-shadow text-[10px] font-bold uppercase tracking-[.2em] text-amber">
          Experiencia destacada
        </p>
        <h2 className="hero-text-shadow mt-3 max-w-lg font-display text-3xl leading-tight text-white sm:text-4xl">
          {experience.name}
        </h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-white/90">
          <span className="hero-text-shadow">
            {experience.duration} · Desde S/{experience.price}
          </span>
          <Link
            className="rounded-full bg-white px-4 py-2 font-semibold text-forest shadow-[0_4px_14px_rgba(12,28,20,.25)] transition hover:bg-cream"
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
