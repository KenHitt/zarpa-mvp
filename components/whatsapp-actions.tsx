'use client';

import { track } from '@/lib/analytics';
import { buildReserveMessage, buildShareMessage, whatsappUrl } from '@/lib/whatsapp';
import { usePackage } from './package-provider';
import { WhatsAppIcon } from './whatsapp-icon';

type Props = {
  layout?: 'stack' | 'inline';
};

export function WhatsAppActions({ layout = 'stack' }: Props) {
  const p = usePackage();
  const itemCount = p.experiences.length + (p.hotel ? 1 : 0);

  function reserve() {
    track('whatsapp_reserve', undefined, {
      items: itemCount,
      total: p.total,
    });
    window.open(
      whatsappUrl(
        buildReserveMessage(
          {
            hotel: p.hotel,
            checkIn: p.checkIn,
            checkOut: p.checkOut,
            experiences: p.experiences,
          },
          p.total
        )
      ),
      '_blank',
      'noopener,noreferrer'
    );
  }

  async function share() {
    const state = {
      hotel: p.hotel,
      checkIn: p.checkIn,
      checkOut: p.checkOut,
      experiences: p.experiences,
    };
    const message = buildShareMessage(state, p.total);

    track('whatsapp_share', undefined, {
      items: itemCount,
      total: p.total,
    });

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Mi viaje a Tingo María · Zarpa',
          text: message,
        });
        return;
      } catch {
        // Usuario canceló o el navegador no soporta compartir texto largo.
      }
    }

    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  }

  const stack = layout === 'stack';

  return (
    <div className={stack ? 'flex flex-col gap-3' : 'flex flex-col gap-3 sm:flex-row'}>
      <button
        type="button"
        onClick={reserve}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 sm:w-auto"
      >
        <WhatsAppIcon />
        Reservar por WhatsApp
      </button>
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-forest/15 bg-white px-5 py-2.5 text-sm font-semibold text-forest transition hover:border-forest/30 hover:bg-cream focus:outline-none focus:ring-2 focus:ring-forest/10 sm:w-auto"
      >
        <ShareIcon />
        Compartir con mi grupo
      </button>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}
