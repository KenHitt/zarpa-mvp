'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getStoredConsent, onConsentChange, type ConsentValue } from '@/lib/cookie-consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const RAW_GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '';
// Un ID sin formato G-XXXXXXXXXX haría fallar la medición en silencio: se descarta y se avisa.
const GA_ID = /^G-[A-Z0-9]+$/i.test(RAW_GA_ID) ? RAW_GA_ID : '';

/**
 * GA4 con pageviews por cambio de ruta (app router no recarga la página).
 * No renderiza nada si falta o es inválido NEXT_PUBLIC_GA_MEASUREMENT_ID.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
    return onConsentChange(setConsent);
  }, []);

  useEffect(() => {
    if (RAW_GA_ID && !GA_ID) {
      console.warn(
        `[GA4] NEXT_PUBLIC_GA_MEASUREMENT_ID "${RAW_GA_ID}" no tiene el formato G-XXXXXXXXXX. Revisa tu .env.local y Vercel.`
      );
    }
    if (!GA_ID || consent !== 'accepted' || typeof window.gtag !== 'function') return;
    window.gtag('config', GA_ID, { page_path: pathname + window.location.search });
  }, [pathname, consent]);

  // Sin ID válido o sin consentimiento aceptado: no se carga ningún script de Google.
  if (!GA_ID || consent !== 'accepted') return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
      </Script>
    </>
  );
}
