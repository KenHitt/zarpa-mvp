'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  photos: string[];
  name: string;
  priority?: boolean;
};

export function ExperienceGallery({ photos, name, priority = false }: Props) {
  const items = photos.filter(Boolean);
  const [active, setActive] = useState(0);

  if (!items.length) return null;

  const current = items[active] ?? items[0];

  return (
    <div className="mt-8 space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-forest/10">
        <Image
          key={current}
          src={current}
          alt={`${name} · foto ${active + 1} · turismo Tingo María`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover object-[center_35%]"
        />
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
