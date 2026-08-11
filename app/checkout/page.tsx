'use client';

import Link from 'next/link';
import { track } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { usePackage } from '@/components/package-provider';
import { BookingSteps } from '@/components/booking-steps';

export default function Checkout() {
  const p = usePackage();
  const router = useRouter();
  const [method, setMethod] = useState('yape');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

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
      <p className="mt-2 text-forest/70">
        Total: <b className="text-forest">S/{p.total}</b>
      </p>
      <Link href="/mi-paquete" className="mt-2 inline-block text-sm font-semibold text-forest underline underline-offset-4">
        ← Volver a tu reserva
      </Link>

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
          {['yape', 'plin', 'card'].map((m) => (
            <label className="mr-4 capitalize" key={m}>
              <input type="radio" name="payment_method" value={m} checked={method === m} onChange={() => setMethod(m)} />{' '}
              {m}
            </label>
          ))}
        </fieldset>
        {method !== 'card' && (
          <div className="rounded-xl bg-white p-4 text-sm ring-1 ring-forest/10">
            Paga a {method === 'yape' ? process.env.NEXT_PUBLIC_YAPE_NUMBER : process.env.NEXT_PUBLIC_PLIN_NUMBER}.
            <label className="mt-3 block">
              Comprobante de pago
              <input required type="file" name="proof" accept="image/*" className="mt-1 block" />
            </label>
          </div>
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button disabled={sending} className="button w-full bg-amber text-forest hover:bg-amber/90">
          {sending ? 'Registrando…' : 'Confirmar y pagar'}
        </button>
      </form>
    </section>
  );
}
