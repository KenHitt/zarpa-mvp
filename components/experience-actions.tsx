'use client';

import { useState } from 'react';
import { track } from '@/lib/analytics';
import { usePackage } from './package-provider';
import { useToast } from './toast-provider';
import type { Experience } from '@/lib/types';

type Props = {
  experience: Experience;
  /** Muestra un stepper de personas junto al botón (página de detalle). */
  withQuantity?: boolean;
  /** Texto del botón cuando aún no se añadió (por defecto "Añadir a mi reserva"). */
  label?: string;
};

export function AddExperience({ experience, withQuantity = false, label }: Props) {
  const { addExperience, removeExperience, experiences, hotel, nights, total } = usePackage();
  const showToast = useToast();
  const [quantity, setQuantity] = useState(1);
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

    addExperience(experience, undefined, quantity);
    track('experience_added', experience.id, {
      category: experience.category,
      price: Number(experience.price),
      quantity,
    });
    const hotelPart = hotel ? Number(hotel.price_per_night) * nights : 0;
    const expPart =
      experiences.reduce((s, x) => s + Number(x.price) * x.quantity, 0) + Number(experience.price) * quantity;
    showToast(`✓ ${experience.name} en tu reserva`, `S/${hotelPart + expPart} · Revisa con Ver reserva`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {withQuantity && !added && (
        <div className="inline-flex items-center gap-1 rounded-full border border-forest/20 bg-white px-1.5 py-1">
          <span className="sr-only">Número de personas</span>
          <button
            type="button"
            aria-label="Quitar persona"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-forest transition hover:bg-cream disabled:opacity-40"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm font-semibold text-forest">
            {quantity} <span className="text-xs font-normal text-forest/55">{quantity === 1 ? 'pers.' : 'pers.'}</span>
          </span>
          <button
            type="button"
            aria-label="Añadir persona"
            onClick={() => setQuantity((q) => Math.min(30, q + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-forest transition hover:bg-cream"
          >
            +
          </button>
        </div>
      )}
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
        {added ? 'Quitar de reserva' : label ?? 'Añadir a mi reserva'}
      </button>
    </div>
  );
}
