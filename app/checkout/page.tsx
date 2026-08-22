'use client';

import Link from 'next/link';
import { track } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { usePackage } from '@/components/package-provider';
import { BookingSteps } from '@/components/booking-steps';
import { TrustStrip } from '@/components/trust-strip';
import { WhatsAppActions } from '@/components/whatsapp-actions';
import { CANCELLATION_POLICY } from '@/lib/copy';

export default function Checkout() {
  const p = usePackage();
  const router = useRouter();
  const [method, setMethod] = useState<'yape' | 'plin'>('yape');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const paymentNumber =
    (method === 'yape' ? process.env.NEXT_PUBLIC_YAPE_NUMBER : process.env.NEXT_PUBLIC_PLIN_NUMBER) || '';

  useEffect(() => {
    if (p.hotel || p.experiences.length) {
      track('checkout_started', undefined, {
        items: p.experiences.length + (p.hotel ? 1 : 0),
        total: p.total,
      });
    }
  }, [p.hotel, p.experiences.length, p.total]);

  if (!p.hotel && !p.experiences.length) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16">
        <p className="text-forest/70">Tu reserva está vacía.</p>
        <Link className="button mt-4" href="/experiencias">
          Ver experiencias
        </Link>
      </section>
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');
    const form = new FormData(e.currentTarget);
    form.set(
      'payload',
      JSON.stringify({
        hotelId: p.hotel?.id || null,
        checkIn: p.checkIn || null,
        checkOut: p.checkOut || null,
        nights: p.nights,
        experiences: p.experiences.map((x) => ({ id: x.id, date: x.date, quantity: x.quantity })),
      })
    );
    try {
      const r = await fetch('/api/bookings', { method: 'POST', body: form });
      const json = await r.json();
      if (!r.ok) throw Error(json.error);
      track('booking_created', json.id, {
        items: p.experiences.length + (p.hotel ? 1 : 0),
        total: p.total,
        payment_method: method,
      });
      p.clear();
      router.push(`/reserva-confirmada?id=${json.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar la reserva');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-12">
      <BookingSteps current={3} />
      <p className="eyebrow mt-8">Paso 3 · Pagar</p>
      <h1 className="mt-2 font-display text-4xl text-forest">Completa tu reserva</h1>
      <ul className="mt-5 space-y-2 rounded-2xl bg-white p-4 text-sm ring-1 ring-forest/10">
        {p.experiences.map((x) => (
          <li key={x.id} className="flex justify-between gap-3">
            <span className="text-forest/80">
              {x.name} · {x.quantity} {x.quantity === 1 ? 'persona' : 'personas'}
            </span>
            <b className="shrink-0 text-forest">S/{Number(x.price) * x.quantity}</b>
          </li>
        ))}
        {p.hotel && (
          <li className="flex justify-between gap-3">
            <span className="text-forest/80">
              {p.hotel.name} · {p.nights} {p.nights === 1 ? 'noche' : 'noches'}
            </span>
            <b className="shrink-0 text-forest">S/{Number(p.hotel.price_per_night) * p.nights}</b>
          </li>
        )}
        <li className="flex justify-between gap-3 border-t border-forest/10 pt-2">
          <span className="font-semibold text-forest">Total</span>
          <b className="text-forest">S/{p.total}</b>
        </li>
      </ul>
      <Link href="/mi-paquete" className="mt-3 inline-block text-sm font-semibold text-forest underline underline-offset-4">
        ← Volver a tu reserva
      </Link>

      <TrustStrip compact />

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label>
          Nombre completo
          <input required name="customer_name" className="input mt-1" />
        </label>
        <label>
          Teléfono
          <input required name="customer_phone" type="tel" className="input mt-1" />
        </label>
        <label>
          Correo
          <input required name="customer_email" type="email" className="input mt-1" />
        </label>
        <fieldset>
          <legend className="mb-2 font-medium text-forest">Método de pago</legend>
          {(['yape', 'plin'] as const).map((m) => (
            <label className="mr-4" key={m}>
              <input
                type="radio"
                name="payment_method"
                value={m}
                checked={method === m}
                onChange={() => setMethod(m)}
              />{' '}
              {m === 'yape' ? 'Yape' : 'Plin'}
            </label>
          ))}
        </fieldset>
        <div className="rounded-xl bg-white p-4 text-sm ring-1 ring-forest/10">
          {paymentNumber ? (
            <p className="text-forest/80">
              Paga a <b className="text-forest">{paymentNumber}</b> ({method === 'yape' ? 'Yape' : 'Plin'}) y sube tu
              comprobante.
            </p>
          ) : (
            <p className="text-forest/80">
              Escríbenos por WhatsApp y te pasamos el número de {method === 'yape' ? 'Yape' : 'Plin'} para pagar.
            </p>
          )}
          <label className="mt-3 block">
            Comprobante de pago
            <input required type="file" name="proof" accept="image/*" className="mt-1 block" />
          </label>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <p className="text-xs leading-5 text-forest/50">
          Al confirmar, tu cupo queda registrado. El operador validará tu pago y te contactará pronto.{' '}
          {CANCELLATION_POLICY}
        </p>
        <button disabled={sending} className="button w-full bg-amber text-forest hover:bg-amber/90">
          {sending ? 'Registrando…' : 'Confirmar y pagar'}
        </button>
      </form>

      <div className="mt-8 border-t border-forest/10 pt-6">
        <p className="text-sm font-semibold text-forest">¿Prefieres coordinar por WhatsApp?</p>
        <p className="mt-1 text-sm text-forest/60">Te enviamos el resumen del viaje listo para confirmar con un operador.</p>
        <div className="mt-4">
          <WhatsAppActions layout="inline" />
        </div>
      </div>
    </section>
  );
}
