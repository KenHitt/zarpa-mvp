'use client';

import Link from 'next/link';
import { track } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePackage } from './package-provider';
import type { Hotel } from '@/lib/types';

export function HotelSelector({ hotel }: { hotel: Hotel }) {
  const { setHotel, openDrawer } = usePackage();
  const router = useRouter();
  const [checkIn, setIn] = useState('');
  const [checkOut, setOut] = useState('');
  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
      : 0;

  function addHotel(next: 'drawer' | '/experiencias') {
    setHotel(hotel, checkIn, checkOut);
    track('hotel_selected', hotel.id, { nights, price: Number(hotel.price_per_night) });
    if (next === 'drawer') {
      openDrawer();
      return;
    }
    router.push(next);
  }

  return (
    <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="font-display text-2xl text-forest">Elige tus fechas</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label>
          Check-in
          <input
            className="input mt-1"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={checkIn}
            onChange={(e) => setIn(e.target.value)}
          />
        </label>
        <label>
          Check-out
          <input
            className="input mt-1"
            type="date"
            min={checkIn || new Date().toISOString().slice(0, 10)}
            value={checkOut}
            onChange={(e) => setOut(e.target.value)}
          />
        </label>
      </div>
      {nights > 0 && (
        <p className="mt-4">
          {nights} noche{nights !== 1 ? 's' : ''} · <b>S/{nights * Number(hotel.price_per_night)}</b>
        </p>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button disabled={!nights} onClick={() => addHotel('drawer')} className="button">
          Agregar hospedaje
        </button>
        <button
          disabled={!nights}
          onClick={() => addHotel('/experiencias')}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition hover:border-forest disabled:cursor-not-allowed disabled:opacity-50"
        >
          Agregar y ver experiencias
        </button>
      </div>
      <p className="mt-4 text-sm text-forest/60">
        El hospedaje es opcional.{' '}
        <Link className="font-semibold text-forest underline underline-offset-2" href="/experiencias">
          Ver tours sin hotel
        </Link>
      </p>
    </div>
  );
}
