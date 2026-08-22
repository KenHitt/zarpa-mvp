'use client';

import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';
import { hasWhatsApp, whatsappContactUrl } from '@/lib/whatsapp';
import { usePackage } from './package-provider';
import { WhatsAppIcon } from './whatsapp-icon';

const TRIP_BAR_HIDDEN_ON = ['/checkout', '/reserva-confirmada'];

export function WhatsAppFloat() {
  const pathname = usePathname();
  const { hotel, experiences, drawerOpen } = usePackage();

  if (!hasWhatsApp()) return null;

  const hasItems = experiences.length > 0 || !!hotel;
  const tripBarVisible = hasItems && !drawerOpen && !TRIP_BAR_HIDDEN_ON.includes(pathname);
  const onExperienceDetail = pathname.startsWith('/experiencias/');

  // Sube el FAB cuando hay una barra inferior (TripBar o CTA sticky) para no tapar el CTA.
  const position = tripBarVisible
    ? 'bottom-24 sm:bottom-24'
    : onExperienceDetail
      ? 'bottom-20 sm:bottom-6'
      : 'bottom-5 sm:bottom-6';

  const href = whatsappContactUrl();

  return (
    <div className={`fixed right-4 z-40 flex items-center gap-2.5 sm:right-6 ${position}`}>
      <span className="pointer-events-none hidden rounded-full border border-forest/10 bg-white/95 px-3 py-1.5 text-xs font-semibold text-forest shadow-[0_8px_24px_rgba(17,50,35,.12)] backdrop-blur-sm sm:block">
        ¿Dudas? Escríbenos
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        onClick={() => track('whatsapp_contact')}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(37,211,102,.45)] transition hover:scale-105 hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/30 motion-reduce:hidden"
          aria-hidden
        />
        <WhatsAppIcon className="relative h-7 w-7 fill-current" />
      </a>
    </div>
  );
}
