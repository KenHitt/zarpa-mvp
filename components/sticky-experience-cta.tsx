'use client';

import { track } from '@/lib/analytics';
import { whatsappExperienceMessage, whatsappUrl } from '@/lib/whatsapp';
import { usePackage } from './package-provider';
import { AddExperience } from './experience-actions';
import { WhatsAppIcon } from './whatsapp-icon';
import type { Experience } from '@/lib/types';

/**
 * Barra fija inferior (solo móvil) con precio + reservar + WhatsApp contextual.
 * Cede el espacio a la TripBar cuando la experiencia ya está en la reserva
 * o cuando el paquete ya tiene items.
 */
export function StickyExperienceCta({ experience }: { experience: Experience }) {
  const { hotel, experiences, drawerOpen } = usePackage();
  const added = experiences.some((x) => x.id === experience.id);
  const hasItems = added || !!hotel || experiences.length > 0;

  if (added || drawerOpen || hasItems) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-forest/10 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(17,50,35,.08)] backdrop-blur-sm sm:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-6 text-forest">S/{experience.price}</p>
          <p className="text-xs text-forest/55">por persona</p>
        </div>
        <a
          href={whatsappUrl(whatsappExperienceMessage(experience.name, experience.price))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar ${experience.name} por WhatsApp`}
          onClick={() => track('whatsapp_contact', experience.id, { context: 'sticky_cta' })}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1ebe5d]"
        >
          <WhatsAppIcon className="h-5 w-5 fill-current" />
        </a>
        <AddExperience experience={experience} label="Reservar" />
      </div>
    </div>
  );
}
