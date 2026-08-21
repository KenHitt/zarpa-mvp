'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePackage } from '@/components/package-provider';
import { ItinerarySuggestions } from '@/components/itinerary-suggestions';
import { BookingSteps } from '@/components/booking-steps';
import { WhatsAppActions } from '@/components/whatsapp-actions';

export default function MyPackage() {
  const p = usePackage();
  const [sharedBanner, setSharedBanner] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('zarpa-imported-share') === '1') {
      setSharedBanner(true);
      sessionStorage.removeItem('zarpa-imported-share');
    }
  }, []);

  const hasItems = !!p.hotel || p.experiences.length > 0;

  if (!hasItems) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center">
        <BookingSteps current={1} />
        <h1 className="mt-8 font-display text-4xl text-forest">Tu reserva está vacía</h1>
        <p className="mt-3 text-forest/70">Empieza por una experiencia o añade hospedaje si lo necesitas.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="button bg-amber text-forest hover:bg-amber/90" href="/experiencias">
            Ver experiencias
          </Link>
          <Link className="button" href="/hoteles">
            Ver hospedaje
          </Link>
        </div>
      </section>
    );
  }


  return (
    <section className="shell max-w-3xl py-12">
      <BookingSteps current={2} />
      {sharedBanner && (
        <div className="mt-6 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/10 px-4 py-3 text-sm text-forest">
          <strong>Paquete compartido contigo.</strong> Revisa las fechas y reserva cuando quieras.
        </div>
      )}
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Paso 2 · Revisar</p>
          <h1 className="section-title">Tu reserva</h1>
        </div>
        <button className="text-sm font-semibold text-forest/60 underline underline-offset-4" onClick={p.clear}>
          Vaciar
        </button>
      </div>
      <p className="mt-3 text-forest/70">Revisa tu selección antes de pagar. Puedes editar o agregar más abajo.</p>

      <div className="mt-8 space-y-4">
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest/10">
          <p className="text-sm font-bold uppercase tracking-[.12em] text-amber">Experiencias</p>
          {p.experiences.length ? (
            p.experiences.map((x) => (
              <div className="mt-4 border-t border-forest/10 pt-3 first:mt-3 first:border-0 first:pt-0" key={x.id}>
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-forest">{x.name}</span>
                  <span className="shrink-0 text-forest">
                    S/{x.price}{' '}
                    <button className="ml-2 text-red-700" onClick={() => p.removeExperience(x.id)}>
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
          <Link className="mt-4 inline-block text-sm font-semibold text-forest underline underline-offset-4" href="/experiencias">
            + Añadir experiencias
          </Link>
        </article>

        {p.hotel ? (
          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[.12em] text-amber">Hospedaje · opcional</p>
                <h2 className="mt-1 font-display text-2xl text-forest">{p.hotel.name}</h2>
                <p className="mt-1 text-sm text-forest/65">
                  {p.checkIn} → {p.checkOut} · {p.nights} noches
                </p>
              </div>
              <button className="text-sm font-semibold text-red-700" onClick={p.removeHotel}>
                Quitar
              </button>
            </div>
            <b className="mt-4 block text-lg text-forest">S/{Number(p.hotel.price_per_night) * p.nights}</b>
          </article>
        ) : (
          <Link
            className="block rounded-2xl border border-dashed border-forest/30 p-5 text-forest transition hover:border-forest/50"
            href="/hoteles"
          >
            <span className="font-semibold">+ Añadir hospedaje</span>
            <span className="mt-1 block text-sm text-forest/60">Opcional · quédate más tiempo en Tingo María</span>
          </Link>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-forest p-5 text-cream">
        <div>
          <span>Total de tu reserva</span>
          <p className="text-xs text-cream/70">Precio final antes de pagar</p>
        </div>
        <b className="text-2xl">S/{p.total}</b>
      </div>

      <div className="mt-5 space-y-4">
        <Link href="/checkout" className="button w-full bg-amber text-forest hover:bg-amber/90 sm:w-auto">
          Continuar al pago
        </Link>
        <WhatsAppActions />
        <p className="text-sm text-forest/60">
          ¿Prefieres hablar con alguien? Reserva directo por WhatsApp o comparte el paquete con tu grupo antes de pagar.
        </p>
      </div>

      <ItinerarySuggestions />
    </section>
  );
}
