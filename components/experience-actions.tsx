'use client';

import { track } from '@/lib/analytics';
import { usePackage } from './package-provider';
import { useToast } from './toast-provider';
import type { Experience } from '@/lib/types';

export function AddExperience({ experience }: { experience: Experience }) {
  const { addExperience, experiences, hotel, nights } = usePackage();
  const showToast = useToast();
  const added = experiences.some((item) => item.id === experience.id);

  function add() {
    if (added) return;
    addExperience(experience);
    track('experience_added', experience.id, {
      category: experience.category,
      price: Number(experience.price),
    });
    const hotelPart = hotel ? Number(hotel.price_per_night) * nights : 0;
    const expPart =
      experiences.reduce((s, x) => s + Number(x.price) * x.quantity, 0) + Number(experience.price);
    showToast(`✓ ${experience.name} en tu reserva`, `S/${hotelPart + expPart} · Revisa con Ver reserva`);
  }

  return (
    <button
      className={
        added
          ? 'inline-flex min-h-11 items-center justify-center rounded-full bg-amber px-4 py-2 text-sm font-semibold text-forest'
          : 'button min-h-11'
      }
      onClick={add}
      aria-pressed={added}
    >
      {added ? 'En tu reserva ✓' : 'Añadir a mi reserva'}
    </button>
  );
}
