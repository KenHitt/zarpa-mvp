'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const AUTO_ROTATE_WHEN_MORE_THAN = 2;
const AUTO_INTERVAL_MS = 5000;

type Props = {
  photos: string[];
  name: string;
  priority?: boolean;
};

export function ExperienceGallery({ photos, name, priority = false }: Props) {
  const items = photos.filter(Boolean);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldAutoRotate = items.length > AUTO_ROTATE_WHEN_MORE_THAN;

  useEffect(() => {
    if (!shouldAutoRotate || paused) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [shouldAutoRotate, paused, items.length]);

  if (!items.length) return null;

  return (
    <div className="mt-8 space-y-3">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-forest/10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((url, index) => (
          <Image
            key={url}
            src={url}
            alt={index === active ? `${name} · foto ${active + 1} · turismo Tingo María` : ''}
            fill
            priority={priority && index === 0}
            sizes="(max-width: 768px) 100vw, 768px"
            aria-hidden={index !== active}
            className={`object-cover object-[center_35%] transition-opacity duration-700 ${
              index === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {items.length > 1 && (
          <p className="absolute bottom-3 right-3 rounded-full bg-forest/75 px-3 py-1 text-xs font-semibold text-white">
            {active + 1} / {items.length}
          </p>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                index === active ? 'ring-amber' : 'ring-transparent opacity-80 hover:opacity-100'
              }`}
              aria-label={`Ver foto ${index + 1}`}
              aria-pressed={index === active}
            >
              <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
