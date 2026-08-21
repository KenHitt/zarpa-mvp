'use client';

import { track } from '@/lib/analytics';
import { usePackage } from './package-provider';
import { useToast } from './toast-provider';
import type { Experience } from '@/lib/types';

export function AddExperience({ experience }: { experience: Experience }) {
  const { addExperience, removeExperience, experiences, hotel, nights, total } = usePackage();
  const showToast = useToast();
  const added = experiences.some((item) => item.id === experience.id);

  function toggle() {
    if (added) {
      removeExperience(experience.id);
      const nextTotal =
        total -
        Number(experience.price) * (experiences.find((item) => item.id === experience.id)?.quantity ?? 1);
      showToast(`Quitaste ${experience.name}`, `S/${Math.max(0, nextTotal)} · Revisa tu reserva`);
      return;
    }

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
      type="button"
      className={
        added
          ? 'inline-flex min-h-11 items-center justify-center rounded-full border border-forest/20 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:border-red-300 hover:text-red-700'
          : 'button min-h-11'
      }
      onClick={toggle}
      aria-pressed={added}
    >
      {added ? 'Quitar de reserva' : 'Añadir a mi reserva'}
    </button>
  );
}
