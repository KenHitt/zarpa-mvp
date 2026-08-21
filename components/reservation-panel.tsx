'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePackage } from '@/components/package-provider';
import { ItinerarySuggestions } from '@/components/itinerary-suggestions';
import { BookingSteps } from '@/components/booking-steps';
import { WhatsAppActions } from '@/components/whatsapp-actions';

type Props = {
  compact?: boolean;
  onNavigate?: () => void;
};

export function ReservationPanel({ compact = false, onNavigate }: Props) {
  const p = usePackage();
  const [sharedBanner, setSharedBanner] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('zarpa-imported-share') === '1') {
      setSharedBanner(true);
      sessionStorage.removeItem('zarpa-imported-share');
    }
  }, []);

  const hasItems = !!p.hotel || p.experiences.length > 0;

  const nav = (href: string) => ({ href, onClick: onNavigate });

  if (!hasItems) {
    return (
      <div className={compact ? 'px-5 py-8' : ''}>
        {!compact && <BookingSteps current={1} />}
        <h2 className={`font-display text-forest ${compact ? 'text-2xl' : 'mt-8 text-4xl'}`}>
          Tu reserva está vacía
        </h2>
        <p className="mt-3 text-sm text-forest/70">Empieza por una experiencia o añade hospedaje si lo necesitas.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="button bg-amber text-forest hover:bg-amber/90" {...nav('/experiencias')}>
            Ver experiencias
          </Link>
          <Link className="button" {...nav('/hoteles')}>
            Ver hospedaje
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? 'px-5 pb-8 pt-2' : ''}>
      {!compact && <BookingSteps current={2} />}
      {sharedBanner && (
        <div className={`rounded-2xl border border-[#25D366]/20 bg-[#25D366]/10 px-4 py-3 text-sm text-forest ${compact ? 'mt-4' : 'mt-6'}`}>
          <strong>Paquete compartido contigo.</strong> Revisa las fechas y reserva cuando quieras.
        </div>
      )}
      <div className={`flex items-end justify-between gap-4 ${compact ? 'mt-4' : 'mt-8'}`}>
        <div>
          {!compact && <p className="eyebrow">Paso 2 · Revisar</p>}
          <h2 className={compact ? 'font-display text-2xl text-forest' : 'section-title'}>Tu reserva</h2>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-forest/60 underline underline-offset-4"
          onClick={p.clear}
        >
          Vaciar
        </button>
      </div>
      {!compact && (
        <p className="mt-3 text-forest/70">Revisa tu selección antes de pagar. Puedes editar o agregar más abajo.</p>
      )}

      <div className="mt-6 space-y-4">
        <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-forest/10 sm:p-5">
          <p className="text-sm font-bold uppercase tracking-[.12em] text-amber">Experiencias</p>
          {p.experiences.length ? (
            p.experiences.map((x) => (
              <div className="mt-4 border-t border-forest/10 pt-3 first:mt-3 first:border-0 first:pt-0" key={x.id}>
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-forest">{x.name}</span>
                  <span className="shrink-0 text-forest">
                    S/{x.price}{' '}
                    <button
                      type="button"
                      className="ml-2 text-sm font-semibold text-red-700 underline underline-offset-2 hover:text-red-800"
                      onClick={() => p.removeExperience(x.id)}
                    >
                      Quitar
                    </button>
                  </span>
                </div>
                <label className="mt-2 block text-sm">
                  Fecha de experiencia
                  <input
                    className="input mt-1 max-w-xs"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    max={p.hotel ? p.checkOut : undefined}
                    value={x.date}
                    onChange={(e) => p.setExperienceDate(x.id, e.target.value)}
                  />
                </label>
              </div>
            ))
          ) : (
            <p className="mt-3 text-sm text-forest/60">Sin experiencias aún.</p>
          )}
          <Link
            className="mt-4 inline-block text-sm font-semibold text-forest underline underline-offset-4"
            {...nav('/experiencias')}
          >
            + Añadir experiencias
          </Link>
        </article>

        {p.hotel ? (
          <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-forest/10 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[.12em] text-amber">Hospedaje · opcional</p>
                <h3 className="mt-1 font-display text-xl text-forest">{p.hotel.name}</h3>
                <p className="mt-1 text-sm text-forest/65">
                  {p.checkIn} → {p.checkOut} · {p.nights} noches
                </p>
              </div>
              <button type="button" className="text-sm font-semibold text-red-700" onClick={p.removeHotel}>
                Quitar
              </button>
            </div>
            <b className="mt-4 block text-lg text-forest">S/{Number(p.hotel.price_per_night) * p.nights}</b>
          </article>
        ) : (
          <Link
            className="block rounded-2xl border border-dashed border-forest/30 p-4 text-forest transition hover:border-forest/50 sm:p-5"
            {...nav('/hoteles')}
          >
            <span className="font-semibold">+ Añadir hospedaje</span>
            <span className="mt-1 block text-sm text-forest/60">Opcional · quédate más tiempo en Tingo María</span>
          </Link>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-forest p-4 text-cream sm:p-5">
        <div>
          <span className="text-sm sm:text-base">Total de tu reserva</span>
          <p className="text-xs text-cream/70">Precio final antes de pagar</p>
        </div>
        <b className="text-xl sm:text-2xl">S/{p.total}</b>
      </div>

      <div className="mt-5 space-y-4">
        <Link
          {...nav('/checkout')}
          className="button w-full bg-amber text-forest hover:bg-amber/90"
        >
          Continuar al pago
        </Link>
        <WhatsAppActions layout="stack" />
        {!compact && (
          <p className="text-sm text-forest/60">
            ¿Prefieres hablar con alguien? Reserva directo por WhatsApp o comparte el paquete con tu grupo antes de
            pagar.
          </p>
        )}
      </div>

      {!compact && <ItinerarySuggestions />}
    </div>
  );
}
