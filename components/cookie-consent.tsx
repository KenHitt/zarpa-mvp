'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredConsent, setStoredConsent } from '@/lib/cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: 'accepted' | 'rejected') {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-forest/10 bg-white/98 shadow-[0_-8px_30px_rgba(17,50,35,.12)] backdrop-blur-sm"
    >
      <div className="shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-6 text-forest/80">
          Usamos cookies propias y de análisis (Google Analytics) para entender cómo usas el sitio y mejorar
          tu experiencia. Puedes aceptarlas o rechazarlas.{' '}
          <Link href="/privacidad" className="font-semibold text-forest underline underline-offset-2">
            Política de Privacidad
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest/20 px-4 text-sm font-semibold text-forest transition hover:border-forest"
          >
            Rechazar
          </button>
          <button type="button" onClick={() => choose('accepted')} className="button">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
