'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const ROTATE_WHEN_MORE_THAN = 2;
const DEFAULT_INTERVAL_MS = 4500;

type Props = {
  photos?: string[];
  name: string;
  priority?: boolean;
  sizes?: string;
  aspectClass?: string;
  imageClass?: string;
  intervalMs?: number;
};

export function RotatingCover({
  photos,
  name,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  aspectClass = 'aspect-[16/10]',
  imageClass = 'object-cover object-[center_38%]',
  intervalMs = DEFAULT_INTERVAL_MS,
}: Props) {
  const items = (photos ?? []).filter(Boolean);
  const shouldRotate = items.length > ROTATE_WHEN_MORE_THAN;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!shouldRotate || paused || reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [shouldRotate, paused, reduceMotion, items.length, intervalMs]);

  return (
    <div
      className={`relative overflow-hidden bg-forest/10 ${aspectClass}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {items.length ? (
        items.map((url, i) => (
          <Image
            key={url}
            src={url}
            alt={i === index ? name : ''}
            fill
            priority={priority && i === 0}
            sizes={sizes}
            aria-hidden={i !== index}
            className={`${imageClass} transition duration-700 ${
              i === index ? 'opacity-100 group-hover:scale-[1.03]' : 'opacity-0'
            }`}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/85 to-amber/70" aria-hidden />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/55 via-forest/10 to-transparent" />
      {shouldRotate && !reduceMotion && (
        <p className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-forest/70 px-2 py-0.5 text-[10px] font-semibold text-white">
          {index + 1}/{items.length}
        </p>
      )}
    </div>
  );
}
