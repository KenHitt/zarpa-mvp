'use client';

import { track } from '@/lib/analytics';
import { buildReserveMessage, buildShareMessage, whatsappUrl } from '@/lib/whatsapp';
import { usePackage } from './package-provider';

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

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
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
